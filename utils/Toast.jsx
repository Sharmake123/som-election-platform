
import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, onDone }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                if (onDone) {
                    onDone();
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onDone]);

    if (!visible) return null;

    const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white z-50 transition-transform transform ";
    const typeStyle = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const animationStyle = visible ? 'translate-x-0' : 'translate-x-full';

    return (
        <div className={`${baseStyle} ${typeStyle} ${animationStyle}`}>
            {message}
        </div>
    );
};

export default Toast;
