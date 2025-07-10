import { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="input-area">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={disabled}
                className="message-input"
            />
            <button 
                type="submit" 
                disabled={disabled || !message.trim()}
                className="send-btn"
            >
                Enviar
            </button>
        </form>
    );
};

export default MessageInput;