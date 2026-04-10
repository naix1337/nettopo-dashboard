import sqlite3 from 'sqlite3';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, 'netmap.db');

export function setupDB() {
    const db = new sqlite3.Database(dbPath);
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS networks (
            id TEXT PRIMARY KEY,
            name TEXT,
            desc TEXT,
            vlan TEXT,
            viewportX REAL,
            viewportY REAL,
            viewportScale REAL
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS devices (
            id TEXT PRIMARY KEY,
            networkId TEXT,
            name TEXT,
            ip TEXT,
            subnet TEXT,
            mac TEXT,
            notes TEXT,
            type TEXT,
            x REAL,
            y REAL,
            FOREIGN KEY(networkId) REFERENCES networks(id) ON DELETE CASCADE
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS connections (
            id TEXT PRIMARY KEY,
            networkId TEXT,
            fromId TEXT,
            toId TEXT,
            label TEXT,
            vlan TEXT,
            linkSpeed TEXT,
            directed INTEGER,
            FOREIGN KEY(networkId) REFERENCES networks(id) ON DELETE CASCADE,
            FOREIGN KEY(fromId) REFERENCES devices(id) ON DELETE CASCADE,
            FOREIGN KEY(toId) REFERENCES devices(id) ON DELETE CASCADE
        )`);
    });
    db.close();
}

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
        db.close();
    });
}

function getRows(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
        db.close();
    });
}

function getRow(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
        db.close();
    });
}

export async function getNetworks() {
    return await getRows(`SELECT id, name, desc, vlan FROM networks`);
}

export async function getNetworkData(id) {
    const net = await getRow(`SELECT * FROM networks WHERE id = ?`, [id]);
    if (!net) return null;
    
    const devices = await getRows(`SELECT * FROM devices WHERE networkId = ?`, [id]);
    const connections = await getRows(`SELECT * FROM connections WHERE networkId = ?`, [id]);
    
    return {
        id: net.id,
        name: net.name,
        desc: net.desc,
        vlan: net.vlan,
        viewport: { x: net.viewportX || 0, y: net.viewportY || 0, scale: net.viewportScale || 1 },
        devices: devices.map(d => ({...d, directed: Boolean(d.directed)})),
        connections: connections.map(c => ({...c, directed: Boolean(c.directed)}))
    };
}

export async function createNetwork(data) {
    const id = data.id || Math.random().toString(36).substr(2, 9);
    await runQuery(`INSERT INTO networks (id, name, desc, vlan, viewportX, viewportY, viewportScale) VALUES (?, ?, ?, ?, 0, 0, 1)`, [
        id, data.name, data.desc || '', data.vlan || ''
    ]);
    
    if (data.devices) {
        for(const d of data.devices) await saveDevice(id, d);
    }
    if (data.connections) {
        for(const c of data.connections) await saveConnection(id, c);
    }
    return id;
}

export async function saveNetwork(id, data) {
    await runQuery(`UPDATE networks SET name=?, desc=?, vlan=?, viewportX=?, viewportY=?, viewportScale=? WHERE id=?`, [
        data.name, data.desc, data.vlan, data.viewport.x, data.viewport.y, data.viewport.scale, id
    ]);
}

export async function saveDevice(netId, d) {
    const exists = await getRow('SELECT id FROM devices WHERE id=?', [d.id]);
    if (exists) {
        await runQuery(`UPDATE devices SET name=?, ip=?, subnet=?, mac=?, type=?, notes=?, x=?, y=? WHERE id=?`, [
            d.name, d.ip, d.subnet, d.mac, d.type, d.notes, d.x, d.y, d.id
        ]);
    } else {
        await runQuery(`INSERT INTO devices (id, networkId, name, ip, subnet, mac, type, notes, x, y) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            d.id, netId, d.name, d.ip, d.subnet, d.mac, d.type, d.notes, d.x, d.y
        ]);
    }
}

export async function deleteDevice(id) {
    await runQuery(`DELETE FROM devices WHERE id=?`, [id]);
}

export async function saveConnection(netId, c) {
    const exists = await getRow('SELECT id FROM connections WHERE id=?', [c.id]);
    if (exists) {
        await runQuery(`UPDATE connections SET label=?, vlan=?, linkSpeed=?, directed=? WHERE id=?`, [
            c.label, c.vlan, c.linkSpeed, c.directed ? 1 : 0, c.id
        ]);
    } else {
        await runQuery(`INSERT INTO connections (id, networkId, fromId, toId, label, vlan, linkSpeed, directed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            c.id, netId, c.from, c.to, c.label, c.vlan, c.linkSpeed, c.directed ? 1 : 0
        ]);
    }
}

export async function deleteConnection(id) {
    await runQuery(`DELETE FROM connections WHERE id=?`, [id]);
}
