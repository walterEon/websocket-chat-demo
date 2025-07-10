import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (url) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [username, setUsername] = useState('');
    
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const addSystemMessage = useCallback((message, timestamp = null) => {
        setMessages(prev => [...prev, {
            id: `system-${Date.now()}`,
            type: 'system',
            message: message,
            timestamp: timestamp || new Date().toLocaleTimeString()
        }]);
    }, []);

    const handleMessage = useCallback((data) => {
        switch (data.type) {
            case 'welcome':
                setClientId(data.clientId);
                setUsername(`Usuario${data.clientId}`);
                addSystemMessage(data.message);
                break;
                
            case 'chat_message':
                setMessages(prev => [...prev, {
                    id: `msg-${Date.now()}`,
                    type: data.username === username ? 'own' : 'user',
                    username: data.username,
                    message: data.message,
                    timestamp: data.timestamp
                }]);
                break;
                
            case 'user_joined':
            case 'user_left':
            case 'username_changed':
                addSystemMessage(data.message, data.timestamp);
                break;
                
            case 'user_list':
                setUsers(data.users);
                break;
        }
    }, [username, addSystemMessage]);

    const connect = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
            return;
        }

        try {
            const ws = new WebSocket(url);
            socketRef.current = ws;
            
            ws.onopen = () => {
                setIsConnected(true);
                addSystemMessage('Conectado al servidor');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleMessage(data);
            };

            ws.onclose = () => {
                setIsConnected(false);
                addSystemMessage('Conexión perdida. Reconectando...');
                
                if (!reconnectTimeoutRef.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectTimeoutRef.current = null;
                        connect();
                    }, 3000);
                }
            };

            ws.onerror = () => {
                addSystemMessage('Error de conexión');
            };

        } catch (error) {
            addSystemMessage('Error al conectar al servidor');
        }
    }, [url]);

    const sendMessage = useCallback((message) => {
        if (socketRef.current && isConnected && message.trim()) {
            socketRef.current.send(JSON.stringify({
                type: 'chat_message',
                message: message
            }));
        }
    }, [isConnected]);

    const changeUsername = useCallback((newUsername) => {
        if (socketRef.current && isConnected && newUsername.trim() && newUsername !== username) {
            socketRef.current.send(JSON.stringify({
                type: 'change_username',
                username: newUsername
            }));
            setUsername(newUsername);
        }
    }, [isConnected, username]);

    useEffect(() => {
        connect();
        
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, []);

    return {
        isConnected,
        messages,
        users,
        clientId,
        username,
        sendMessage,
        changeUsername
    };
};