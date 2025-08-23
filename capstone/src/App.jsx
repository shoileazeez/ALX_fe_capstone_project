import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import SettingsPage from "./Pages/Settings";
import Market from "./Pages/Market";
import CoinDetails from "./Pages/CoinDetails";
import Portfolio from "./Pages/Portfolio";
import ErrorBoundary from "./components/ErrorBoundary";
import AddTransactionModal from "./components/AddTransactionModal";
import { TransactionModalProvider, useTransactionModal } from "./context/TransactionModalContext";
// ... other components

const AppContent = () => {
  const { isModalOpen, closeModal } = useTransactionModal();

  const handleTransactionAdded = (newTransaction, updatedTransactions) => {
    // Trigger a custom event to notify other components about the new transaction
    window.dispatchEvent(new CustomEvent('transactionAdded', { 
      detail: { newTransaction, updatedTransactions } 
    }));
  };

  return (
    <div className="app-container bg-black min-h-screen">
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/markets" element={<Market />} />
            <Route path="/coin/:coinId" element={<CoinDetails />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          
          {/* Global Add Transaction Modal */}
          {isModalOpen && (
            <AddTransactionModal 
              isOpen={isModalOpen}
              onClose={closeModal}
              onTransactionAdded={handleTransactionAdded}
            />
          )}
        </ErrorBoundary>
      </Router>
    </div>
  );
};

function App() {
  return (
    <TransactionModalProvider>
      <AppContent />
    </TransactionModalProvider>
  );
}

export default App;