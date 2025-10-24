import { useState } from 'react';

export const useEmailModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const setLoading = (loading: boolean) => setIsLoading(loading);

  return {
    isOpen,
    isLoading,
    openModal,
    closeModal,
    setLoading
  };
};
