import { useWebSocket } from '../hooks/useWebSocket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

const Chat = () => {
    const {
        isConnected,
        messages,
        users,
        clientId,
        username,
        sendMessage,
        changeUsername
    } = useWebSocket('ws://localhost:3001');

    return (
        <div className="container">
            <header>
                <h1>Chat en tiempo real</h1>
                <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                </div>
            </header>
            
            <main>
                <div className="chat-container">
                    <UserList 
                        users={users}
                        clientId={clientId}
                        onUsernameChange={changeUsername}
                    />
                    
                    <div className="chat-area">
                        <MessageList messages={messages} />
                        <MessageInput 
                            onSendMessage={sendMessage}
                            disabled={!isConnected}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Chat;