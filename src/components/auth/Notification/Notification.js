
import React from 'react';
import './Notification.css';

const Notification = ({ message, onClose }) => {
    if (!message) return null;

    return (
    <div className="notification">
        <p>{message}</p>
        <button onClick={onClose}>Закрыть</button>
    </div>
    );
};

export default Notification;
