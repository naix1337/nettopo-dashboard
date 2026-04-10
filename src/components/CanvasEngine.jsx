import React, { useRef, useEffect, useContext } from 'react';
import { NetworksContext } from '../context';

export default function CanvasEngine() {
  const canvasRef = useRef(null);
  const { activeNetworkData, selection, setSelection, connectMode, setConnectMode, refreshData } = useContext(NetworksContext);
  
  // Minimal Canvas approach matching the Vanilla JS layout mapping
  useEffect(() => {
     const canvas = canvasRef.current;
     if (!canvas || !activeNetworkData) return;
     const ctx = canvas.getContext('2d');
     let reqId;
     
     // Responsive canvas to wrapper size
     const resize = () => {
         const rect = canvas.parentElement.getBoundingClientRect();
         canvas.width = rect.width;
         canvas.height = rect.height;
     };
     resize();
     window.addEventListener('resize', resize);

     const devices = activeNetworkData.devices || [];
     const connections = activeNetworkData.connections || [];
     const vp = activeNetworkData.viewport;

     const w2s = (x, y) => ({ x: x * vp.scale + vp.x, y: y * vp.scale + vp.y });
     
     const render = () => {
         const cColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#000';
         const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || '#fff';
         const pColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || 'teal';

         ctx.fillStyle = bg;
         ctx.fillRect(0, 0, canvas.width, canvas.height);

         // Background Grid
         ctx.fillStyle = cColor;
         ctx.globalAlpha = 0.08;
         const gap = 24 * vp.scale;
         const offsetX = vp.x % gap;
         const offsetY = vp.y % gap;
         for (let x = offsetX; x < canvas.width; x += gap) {
             for (let y = offsetY; y < canvas.height; y += gap) {
                 ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI*2); ctx.fill();
             }
         }
         ctx.globalAlpha = 1.0;

         // Draw Edges
         connections.forEach(c => {
             const from = devices.find(d => d.id === c.fromId);
             const to = devices.find(d => d.id === c.toId);
             if(!from || !to) return;
             const p1 = w2s(from.x, from.y);
             const p2 = w2s(to.x, to.y);
             ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
             ctx.lineWidth = selection.id === c.id ? 3 : 2;
             ctx.strokeStyle = selection.id === c.id ? pColor : 'rgba(150,150,150,0.5)';
             ctx.stroke();
         });

         // Draw Nodes
         devices.forEach(d => {
             const p = w2s(d.x, d.y);
             const w = 120 * vp.scale;
             const h = 60 * vp.scale;
             const px = p.x - w/2;
             const py = p.y - h/2;

             ctx.beginPath();
             ctx.roundRect(px, py, w, h, 10 * vp.scale);
             ctx.fillStyle = 'rgba(100,100,100,0.1)';
             ctx.lineWidth = selection.id === d.id ? 2 : 1;
             ctx.strokeStyle = selection.id === d.id ? pColor : 'rgba(150,150,150,0.8)';
             ctx.fill(); ctx.stroke();

             ctx.fillStyle = cColor;
             ctx.font = `500 ${13 * vp.scale}px sans-serif`;
             ctx.textAlign = 'center';
             ctx.fillText(d.name, px + w/2, py + 30*vp.scale);
         });

         reqId = requestAnimationFrame(render);
     };
     
     reqId = requestAnimationFrame(render);

     return () => {
         cancelAnimationFrame(reqId);
         window.removeEventListener('resize', resize);
     };
  }, [activeNetworkData, selection]);

  const handlePointerDown = (e) => {
    if (!activeNetworkData) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const vp = activeNetworkData.viewport;
    
    // convert click to world pos
    const wx = (x - vp.x) / vp.scale;
    const wy = (y - vp.y) / vp.scale;

    // simple hit test
    const clickedDev = activeNetworkData.devices.find(d => 
       wx > d.x - 60 && wx < d.x + 60 && wy > d.y - 30 && wy < d.y + 30
    );

    if (clickedDev) {
        if (connectMode) {
           // Basic connection logic can go here
           setConnectMode(false);
        } else {
           setSelection({ type: 'device', id: clickedDev.id });
        }
    } else {
        setSelection({ type: null, id: null });
    }
  };

  return (
    <canvas 
       ref={canvasRef} 
       style={{ width: '100%', height: '100%', display: 'block', cursor: connectMode ? 'crosshair' : 'default' }}
       onPointerDown={handlePointerDown}
    />
  );
}
