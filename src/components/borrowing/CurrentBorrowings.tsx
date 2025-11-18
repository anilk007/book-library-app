import React, { useState, useEffect } from 'react';
import { libraryApi, BorrowingWithDetails } from '../../services/api';

const CurrentBorrowings: React.FC = () => {
  const [borrowings, setBorrowings] = useState<BorrowingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentBorrowings();
  }, []);

  const loadCurrentBorrowings = async () => {
    try {
      const borrowingsData = await libraryApi.getCurrentBorrowings();
      setBorrowings(borrowingsData);
    } catch (error) {
      console.error('Error loading current borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (recordId: number) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      try {
        await libraryApi.returnBook(recordId);
        alert('Book returned successfully!');
        await loadCurrentBorrowings();
      } catch (error) {
        console.error('Error returning book:', error);
        alert('Error returning book.');
      }
    }
  };

  if (loading) return <div className="loading">Loading current borrowings...</div>;

  return (
    <div className="current-borrowings">
      <h2>Currently Borrowed Books</h2>
      
      {borrowings.length === 0 ? (
        <div className="empty-state">No books are currently borrowed.</div>
      ) : (
        <div className="borrowings-table">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map(record => (
                <tr key={record.record_id} className={record.days_overdue > 0 ? 'overdue' : ''}>
                  <td>{record.book_title}</td>
                  <td>{record.book_author}</td>
                  <td>{record.member_name}</td>
                  <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
                  <td>{new Date(record.due_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status}
                      {record.days_overdue > 0 && ` (${record.days_overdue} days overdue)`}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleReturnBook(record.record_id)}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrentBorrowings;