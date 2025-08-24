
import { describe, expect, test } from "bun:test";

const BACKEND_URL = "ws://localhost:8080";
const BACKEND_URL2 = "ws://localhost:8081";
describe("Chat application", () => {
    test("Message sent from room1 reacher another participant in room1", async () => {
        const ws1 = new WebSocket(BACKEND_URL);
        const ws2 = new WebSocket(BACKEND_URL);

        //MAKE SURE SOCKETS ARE CONNECTED.
        await new Promise<void>((resolve, reject) => {
            let count = 0;
            ws1.onopen = () => {
                count = count + 1;
                if (count === 2) resolve();
                console.log("web socket1 connected")
            }

            ws2.onopen = () => {
                count = count + 1;
                if (count === 2) resolve();
                console.log("web socket2 connected")
            }
        })

        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room-1"
        }))

        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room-1"
        }))


        await new Promise<void>((resolve) => {
            ws2.onmessage = ({ data }) => {
                const parsedData = JSON.parse(data);
                expect(parsedData.type === "chat");
                expect(parsedData.message === "Hi");
                resolve()
            }

            ws1.send(JSON.stringify({
                type: "chat",
                room: "Room-1",
                message: "Hi"
            }))
        })
    })


    test("Message sent from room1 reacher another participant in room1 in another server", async () => {
        const ws1 = new WebSocket(BACKEND_URL);
        const ws2 = new WebSocket(BACKEND_URL2);

        //MAKE SURE SOCKETS ARE CONNECTED.
        await new Promise<void>((resolve, reject) => {
            let count = 0;
            ws1.onopen = () => {
                count = count + 1;
                if (count === 2) resolve();
                console.log("web socket1 connected")
            }

            ws2.onopen = () => {
                count = count + 1;
                if (count === 2) resolve();
                console.log("web socket2 connected")
            }
        })

        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room-1"
        }))

        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room-1"
        }))


        await new Promise<void>((resolve) => {
            ws2.onmessage = ({ data }) => {
                const parsedData = JSON.parse(data);
                expect(parsedData.type === "chat");
                expect(parsedData.message === "Hi");
                resolve()
            }

            ws1.send(JSON.stringify({
                type: "chat",
                room: "Room-1",
                message: "Hi"
            }))
        })
    })
})