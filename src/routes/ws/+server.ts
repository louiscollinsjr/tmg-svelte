import { WebSocketServer } from 'ws';
import type { RequestHandler } from './$types';
import { MONGODB_URI } from '$env/static/private';

const wss = new WebSocketServer({ noServer: true });

// Store active connections
const clients = new Set<WebSocket>();

// Broadcast message to all connected clients
function broadcast(message: string) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

export const GET: RequestHandler = async ({ request }) => {
    if (request.headers.get('upgrade') !== 'websocket') {
        return new Response('Expected websocket', { status: 400 });
    }

    const { socket, response } = Deno.upgradeWebSocket(request);

    // Add client to the set when connected
    socket.onopen = () => {
        clients.add(socket);
        console.log('Client connected');
    };

    // Remove client from the set when disconnected
    socket.onclose = () => {
        clients.delete(socket);
        console.log('Client disconnected');
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
        console.log('Message received:', event.data);
        // Broadcast the message to all clients
        broadcast(event.data);
    };

    return response;
};
