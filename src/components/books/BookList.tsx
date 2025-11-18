import React, { useState, useEffect } from 'react';
import { libraryApi, Book } from '../../services/api';
import BookCard from './BookCard';
import CreateBook from './CreateBook';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const booksData = await libraryApi.getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookCreated = (newBook: Book) => {
    setBooks(prev => [...prev, newBook]);
    setShowCreateForm(false);
  };

  const handleDeleteBook = async (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await libraryApi.deleteBook(bookId);
        setBooks(prev => prev.filter(book => book.book_id !== bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book. It might be currently borrowed.');
      }
    }
  };

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="book-list">
      <div className="header">
        <h2>Library Books</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Add New Book'}
        </button>
      </div>

      {showCreateForm && (
        <CreateBook onBookCreated={handleBookCreated} />
      )}

      <div className="books-grid">
        {books.length === 0 ? (
          <div className="empty-state">No books found in the library.</div>
        ) : (
          books.map(book => (
            <BookCard 
              key={book.book_id} 
              book={book} 
              onDelete={handleDeleteBook}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;