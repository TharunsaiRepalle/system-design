import { WebSocketServer, WebSocket as WebSocketWsType } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

interface Room {
    sockets: WebSocketWsType[]
}

const rooms: Record<string, Room> = {}

const RELAYED_URL = "http://localhost:3001";

const relayedSocket = new WebSocket(RELAYED_URL);

relayedSocket.onmessage = ({ data }) => {
    const parseData = JSON.parse(data);
    if (parseData.type === "chat") {
        const room = parseData.room;
        rooms[room]?.sockets.map(socket => socket.send(data));
    }
}



wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('open', function open() {
        console.log('connected:' , wss.options.port);
        ws.send(Date.now());
    });


    ws.on('message', function message(data: string) {
        const parseData = JSON.parse(data);
        if (parseData.type === "join-room") {
            const room = parseData.room;
            if (!rooms[room]) {
                rooms[room] = {
                    sockets: []
                }
            }

            rooms[room].sockets.push(ws);
        }

        if (parseData.type === "chat") {
            relayedSocket.send(data);
        }
    });
});