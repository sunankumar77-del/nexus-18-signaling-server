const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
app.get('/', (_req,res)=>res.status(200).send('NEXUS-18 signaling server is running.'));
const server = http.createServer(app);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://nexus-global-meet.netlify.app').split(',').map(s=>s.trim());
const io = new Server(server, { cors: { origin: allowedOrigins, methods: ['GET','POST'] }, transports: ['websocket','polling'] });
let waiting = null;
const pairs = new Map();
const lastAction = new Map();
function cleanup(id, notify=true) {
  if (waiting === id) waiting = null;
  const peer = pairs.get(id);
  if (peer) { pairs.delete(id); pairs.delete(peer); if (notify) io.to(peer).emit('peer_disconnected'); }
}
io.on('connection', socket => {
  const allowed = allowedOrigins.includes(socket.handshake.headers.origin);
  if (!allowed) { socket.disconnect(true); return; }
  socket.on('find_peer', () => {
    const now=Date.now(); if(now-(lastAction.get(socket.id)||0)<1200) return; lastAction.set(socket.id,now);
    cleanup(socket.id);
    if (waiting && waiting !== socket.id && io.sockets.sockets.has(waiting)) {
      const peer=waiting; waiting=null; pairs.set(socket.id,peer); pairs.set(peer,socket.id);
      socket.emit('peer_matched',{peerId:peer,initiator:true});
      io.to(peer).emit('peer_matched',{peerId:socket.id,initiator:false});
    } else { waiting=socket.id; socket.emit('waiting_in_queue'); }
  });
  for (const event of ['signal_offer','signal_answer','signal_ice']) socket.on(event, payload => {
    if (!payload || !payload.target || pairs.get(socket.id)!==payload.target) return;
    io.to(payload.target).emit(event,{sender:socket.id,[event==='signal_offer'?'offer':event==='signal_answer'?'answer':'candidate']:payload[event==='signal_offer'?'offer':event==='signal_answer'?'answer':'candidate']});
  });
  socket.on('leave_queue',()=>cleanup(socket.id));
  socket.on('disconnect',()=>{cleanup(socket.id);lastAction.delete(socket.id);});
});
const port=process.env.PORT||10000;
server.listen(port,'0.0.0.0',()=>console.log(`NEXUS-18 signaling server listening on ${port}`));
