import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import Button from './Button';
import { LogOut } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Out" size="sm">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Leaving so soon?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Your growth journey will be waiting when you return.
        </p>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Stay
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="flex-1"
            loading={loading}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;