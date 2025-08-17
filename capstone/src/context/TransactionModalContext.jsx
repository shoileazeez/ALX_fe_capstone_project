import React, { createContext, useContext, useState } from 'react';

const TransactionModalContext = createContext();

export const useTransactionModal = () => {
    const context = useContext(TransactionModalContext);
    if (!context) {
        throw new Error('useTransactionModal must be used within a TransactionModalProvider');
    }
    return context;
};

export const TransactionModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <TransactionModalContext.Provider value={{
            isModalOpen,
            openModal,
            closeModal
        }}>
            {children}
        </TransactionModalContext.Provider>
    );
};

export default TransactionModalContext;
