import { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="messages-container">
            {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                    <span className="timestamp">[{message.timestamp}]</span>
                    {message.username && message.type !== 'system' && (
                        <span className="username">{message.username}:</span>
                    )}
                    <span className="content">{message.message}</span>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;