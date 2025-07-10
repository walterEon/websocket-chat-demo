const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

const wss = new WebSocket.Server({ server });

const clients = new Map();
let clientId = 0;

wss.on('connection', (ws) => {
    const id = ++clientId;
    const clientInfo = {
        id: id,
        ws: ws,
        username: `Usuario${id}`
    };
    
    clients.set(ws, clientInfo);
    console.log(`Cliente ${id} conectado`);
    
    // Enviar mensaje de bienvenida
    ws.send(JSON.stringify({
        type: 'welcome',
        message: `¡Bienvenido! Eres el Usuario${id}`,
        clientId: id
    }));
    
    // Notificar a todos que un nuevo usuario se conectó
    broadcast({
        type: 'user_joined',
        message: `Usuario${id} se ha unido al chat`,
        username: `Usuario${id}`,
        timestamp: new Date().toLocaleTimeString()
    }, ws);
    
    sendUserList();
    
    // Manejar mensajes del cliente
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            const client = clients.get(ws);
            
            switch (message.type) {
                case 'chat_message':
                    broadcast({
                        type: 'chat_message',
                        message: message.message,
                        username: client.username,
                        timestamp: new Date().toLocaleTimeString()
                    });
                    break;
                    
                case 'change_username':
                    const oldUsername = client.username;
                    client.username = message.username;
                    
                    broadcast({
                        type: 'username_changed',
                        message: `${oldUsername} ahora se llama ${client.username}`,
                        timestamp: new Date().toLocaleTimeString()
                    });
                    
                    sendUserList();
                    break;
            }
        } catch (error) {
            console.error('Error procesando mensaje:', error);
        }
    });
    
    // Cuando un cliente se desconecta
    ws.on('close', () => {
        const client = clients.get(ws);
        if (client) {
            console.log(`Cliente ${client.id} desconectado`);
            
            broadcast({
                type: 'user_left',
                message: `${client.username} ha abandonado el chat`,
                timestamp: new Date().toLocaleTimeString()
            }, ws);
            
            clients.delete(ws);
            sendUserList();
        }
    });
    
    ws.on('error', (error) => {
        console.error('Error en WebSocket:', error);
    });
});

// Función para enviar mensaje a todos los clientes
function broadcast(message, excludeWs = null) {
    const messageStr = JSON.stringify(message);
    
    clients.forEach((client, ws) => {
        if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
            ws.send(messageStr);
        }
    });
}

// Función para enviar lista de usuarios conectados
function sendUserList() {
    const userList = Array.from(clients.values()).map(client => ({
        id: client.id,
        username: client.username
    }));
    
    broadcast({
        type: 'user_list',
        users: userList
    });
}

app.get('/health', (req, res) => {
    res.json({ status: 'ok', clients: clients.size });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor WebSocket corriendo en puerto ${PORT}`);
});