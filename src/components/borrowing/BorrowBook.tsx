import React, { useState, useEffect } from 'react';
import { libraryApi, Book, Member } from '../../services/api';

const BorrowBook: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | ''>('');
  const [selectedMemberId, setSelectedMemberId] = useState<number | ''>('');
  const [borrowDays, setBorrowDays] = useState(14);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, membersData] = await Promise.all([
        libraryApi.getBooks(),
        libraryApi.getMembers()
      ]);
      setBooks(booksData);
      setMembers(membersData.filter(m => m.status === 'Active'));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId) return;

    setLoading(true);
    try {
      await libraryApi.borrowBook(selectedBookId, selectedMemberId, borrowDays);
      alert('Book borrowed successfully!');
      setSelectedBookId('');
      setSelectedMemberId('');
      await loadData(); // Refresh data to update availability
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Error borrowing book. It might not be available.');
    } finally {
      setLoading(false);
    }
  };

  const availableBooks = books.filter(book => book.available_copies > 0);

  return (
    <div className="borrow-book">
      <h2>Borrow a Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Book *</label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(Number(e.target.value))}
            required
          >
            <option value="">Choose a book...</option>
            {availableBooks.map(book => (
              <option key={book.book_id} value={book.book_id}>
                {book.title} by {book.author} ({book.available_copies} available)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Member *</label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(Number(e.target.value))}
            required
          >
            <option value="">Choose a member...</option>
            {members.map(member => (
              <option key={member.member_id} value={member.member_id}>
                {member.first_name} {member.last_name} ({member.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Borrow Period (Days)</label>
          <input
            type="number"
            value={borrowDays}
            onChange={(e) => setBorrowDays(Number(e.target.value))}
            min="1"
            max="30"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !selectedBookId || !selectedMemberId}
        >
          {loading ? 'Borrowing...' : 'Borrow Book'}
        </button>
      </form>
    </div>
  );
};

export default BorrowBook;