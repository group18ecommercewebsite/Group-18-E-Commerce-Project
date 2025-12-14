import React, { createContext, useContext, useState } from 'react';

const AddProductContext = createContext();

export const useAddProduct = () => {
    const context = useContext(AddProductContext);
    if (!context) {
        throw new Error('useAddProduct must be used within AddProductProvider');
    }
    return context;
};

export const AddProductProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openPanel = () => {
        setIsOpen(true);
        // Ngăn scroll body khi panel mở
        document.body.style.overflow = 'hidden';
    };

    const closePanel = () => {
        setIsOpen(false);
        // Khôi phục scroll body khi panel đóng
        document.body.style.overflow = 'unset';
    };

    const togglePanel = () => {
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    };

    const value = {
        isOpen,
        openPanel,
        closePanel,
        togglePanel
    };

    return (
        <AddProductContext.Provider value={value}>
            {children}
        </AddProductContext.Provider>
    );
};

