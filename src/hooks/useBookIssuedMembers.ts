import { useState, useCallback } from 'react';
import type { IssuedMember } from '../services/api';
import { libraryApi } from '../services/api';

export const useBookIssuedMembers = () => {
  const [issuedMembers, setIssuedMembers] = useState<Record<number, IssuedMember[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);

  const loadIssuedMembers = useCallback(async (bookId: number) => {
    // If already loaded, just return the cached data
    if (issuedMembers[bookId]) {
      return issuedMembers[bookId];
    }

    try {
      setLoadingStates(prev => ({ ...prev, [bookId]: true }));
      const members = await libraryApi.getBookIssuedMembers(bookId);
      setIssuedMembers(prev => ({ ...prev, [bookId]: members }));
      return members;
    } catch (error) {
      console.error(`Error loading issued members for book ${bookId}:`, error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, [bookId]: false }));
    }
  }, [issuedMembers]);

  const toggleBookExpand = useCallback(async (bookId: number) => {
    if (expandedBookId === bookId) {
      // Collapse if already expanded
      setExpandedBookId(null);
    } else {
      // Expand and load members if not already loaded
      try {
        await loadIssuedMembers(bookId);
        setExpandedBookId(bookId);
      } catch (error) {
        console.error('Error toggling book expand:', error);
      }
    }
  }, [expandedBookId, loadIssuedMembers]);

  const clearBookMembers = useCallback((bookId: number) => {
    setIssuedMembers(prev => {
      const newState = { ...prev };
      delete newState[bookId];
      return newState;
    });
  }, []);

  const isLoading = useCallback((bookId: number) => {
    return loadingStates[bookId] || false;
  }, [loadingStates]);

  return {
    issuedMembers,
    expandedBookId,
    loadingStates,
    loadIssuedMembers,
    toggleBookExpand,
    clearBookMembers,
    isLoading,
    setExpandedBookId
  };
};