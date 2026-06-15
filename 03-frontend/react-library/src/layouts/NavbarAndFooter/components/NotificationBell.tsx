import React from 'react';

interface NotificationBellProps {
    unreadCount: number;
    onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount, onClick }) => {
    return (
        <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            {unreadCount > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'red',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '10px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {unreadCount}
                </span>
            )}
        </div>
    );
};