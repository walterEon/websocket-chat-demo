// client/src/components/UserList.jsx - VERSIÓN SIMPLE
import React, { useState } from 'react';

const UserList = ({ users, clientId, onUsernameChange }) => {
    const [newUsername, setNewUsername] = useState('');

    const handleUsernameChange = (e) => {
        e.preventDefault();
        if (newUsername.trim()) {
            onUsernameChange(newUsername);
            setNewUsername('');
        }
    };

    return (
        <div className="sidebar">
            <div className="username-section">
                <h4>Cambiar nombre</h4>
                <form onSubmit={handleUsernameChange}>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Nuevo nombre..."
                        className="username-input"
                    />
                    <button type="submit" className="change-username-btn">
                        Cambiar
                    </button>
                </form>
            </div>

            <div className="users-section">
                <h3>Usuarios Conectados ({users.length})</h3>
                <ul className="user-list">
                    {users.map((user) => (
                        <li key={user.id} className="user-item">
                            {user.username}
                            {user.id === clientId && <span className="you-indicator"> (tú)</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserList;