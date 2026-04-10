import express from 'express';
import cors from 'cors';
import { setupDB, getNetworks, getNetworkData, saveNetwork, createNetwork, saveDevice, deleteDevice, saveConnection, deleteConnection } from './db.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Init DB
setupDB();

// API Routes
app.get('/api/networks', (req, res) => {
    try {
        const nets = getNetworks();
        res.json(nets);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.get('/api/networks/:id', (req, res) => {
    try {
        const net = getNetworkData(req.params.id);
        if(!net) return res.status(404).json({error: 'Network not found'});
        res.json(net);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.post('/api/networks', (req, res) => {
    try {
        const id = createNetwork(req.body);
        res.json({ id, message: 'Network created' });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.put('/api/networks/:id', (req, res) => {
    try {
        saveNetwork(req.params.id, req.body);
        res.json({ message: 'Network updated' });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// Devices API
app.post('/api/networks/:netId/devices', (req, res) => {
    try {
        saveDevice(req.params.netId, req.body);
        res.json({ message: 'Device saved' });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.delete('/api/devices/:id', (req, res) => {
    try {
        deleteDevice(req.params.id);
        res.json({ message: 'Device deleted' });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// Connections API
app.post('/api/networks/:netId/connections', (req, res) => {
    try {
        saveConnection(req.params.netId, req.body);
        res.json({ message: 'Connection saved' });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.delete('/api/connections/:id', (req, res) => {
    try {
        deleteConnection(req.params.id);
        res.json({ message: 'Connection deleted' });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
