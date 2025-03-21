import React from 'react';
import "./MessagePage.css";


const MessagePage = (props) => {
    return (
        <div className='message-container'>
            <p>{props.message}</p>
        </div>
    );
};

export default MessagePage;