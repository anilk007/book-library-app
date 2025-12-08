import React, { useState, useEffect } from 'react';
import { libraryApi } from '../../services/api';
import type { Transaction } from '../../services/api';

interface MemberIssuedBooksProps {
  memberId: number;
  memberName: string;
  onBookReturned?: () => void;
  isExpanded: boolean;
  onClose?: () => void;
}

const MemberIssuedBooks: React.FC<MemberIssuedBooksProps> = ({ 
  memberId, 
  memberName,
  onBookReturned,
  isExpanded,
  onClose
}) => {
  const [issuedBooks, setIssuedBooks] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningBookId, setReturningBookId] = useState<number | null>(null);

  useEffect(() => {
    if (isExpanded) {
      loadIssuedBooks();
    }
  }, [isExpanded, memberId]);

  const loadIssuedBooks = async () => {
    setLoading(true);
    try {
      const books = await libraryApi.getMemberIssuedBooks(memberId);
      setIssuedBooks(books);
    } catch (error) {
      console.error('Error loading issued books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (transactionId: number) => {
    if (!window.confirm('Are you sure you want to mark this book as returned?')) {
      return;
    }

    setReturningBookId(transactionId);
    try {
      await libraryApi.returnBook(transactionId);
      // Refresh the list
      await loadIssuedBooks();
      // Notify parent component
      if (onBookReturned) {
        onBookReturned();
      }
      alert('Book returned successfully!');
    } catch (error: any) {
      console.error('Error returning book:', error);
      alert(error.message || 'Failed to return book. Please try again.');
    } finally {
      setReturningBookId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === 'Returned') {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Returned</span>;
    }
    
    const daysOverdue = getDaysOverdue(dueDate);
    if (daysOverdue > 0) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue
        </span>
      );
    }
    
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>;
  };

  return (
    <div className="mt-3 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Books Issued to {memberName}</h4>
        <button
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : issuedBooks.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No books currently issued to this member.
        </div>
      ) : (
        <div className="space-y-3">
          {issuedBooks.map((book) => (
            <div key={book.transaction_id} className="p-3 bg-white border rounded shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">Book ID: {book.book_id}</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">Issued:</span>{' '}
                      <span className="font-medium">{formatDate(book.issue_date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Due:</span>{' '}
                      <span className="font-medium">{formatDate(book.due_date)}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(book.status, book.due_date)}
                  </div>
                </div>
                {book.status !== 'Returned' && (
                  <button
                    className={`ml-4 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 ${
                      returningBookId === book.transaction_id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handleReturnBook(book.transaction_id)}
                    disabled={returningBookId === book.transaction_id}
                  >
                    {returningBookId === book.transaction_id ? 'Returning...' : 'Mark as Returned'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-sm text-gray-500">
        Total: {issuedBooks.length} book{issuedBooks.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default MemberIssuedBooks;