import React, { createContext, useContext, useState } from 'react';

const BannerContext = createContext();

export const useBanner = () => {
    const context = useContext(BannerContext);
    if (!context) {
        throw new Error('useBanner must be used within BannerProvider');
    }
    return context;
};

export const BannerProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    const openPanel = (banner = null) => {
        setEditingBanner(banner);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closePanel = () => {
        setIsOpen(false);
        setEditingBanner(null);
        document.body.style.overflow = 'unset';
    };

    const value = {
        isOpen,
        editingBanner,
        openPanel,
        closePanel
    };

    return (
        <BannerContext.Provider value={value}>
            {children}
        </BannerContext.Provider>
    );
};

