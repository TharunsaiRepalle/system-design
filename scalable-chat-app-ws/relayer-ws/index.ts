import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

const severs: WebSocket[] = [];

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    severs.push(ws);

    ws.on('message', function message(data: string) {
        severs.map(socket => {
            socket.send(data);
        })
    });
});