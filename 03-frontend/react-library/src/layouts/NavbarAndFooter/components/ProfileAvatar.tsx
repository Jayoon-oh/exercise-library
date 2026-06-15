import React from 'react';

interface ProfileAvatarProps {
    url: string | undefined;
    onClick: () => void;
}

export const ProfileAvatar = ({ url, onClick }: ProfileAvatarProps) => {
    return (
        <img
            src={url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} // defualt image
            alt="Profile"
            className="rounded-circle"
            width="36"
            style={{ cursor: 'pointer' }}
            onClick={onClick}
        />
    );
};