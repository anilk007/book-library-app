import React from 'react';
import type { Book } from '../../services/api';


interface BookCardProps {
  book: Book;
  onDelete: (bookId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {
  const availabilityColor = book.available_copies > 0 ? 'available' : 'unavailable';

  return (
    <div className={`book-card ${availabilityColor}`}>
      <div className="book-header">
        <h3 className="book-title">{book.title}</h3>
        <span className={`availability-badge ${availabilityColor}`}>
          {book.available_copies > 0 
            ? `${book.available_copies} available` 
            : 'Out of stock'
          }
        </span>
      </div>
      
      <div className="book-details">
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Published:</strong> {book.publication_year}</p>
        <p><strong>Publisher:</strong> {book.publisher}</p>
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Total Copies:</strong> {book.total_copies}</p>
      </div>

      <div className="book-actions">
        <button 
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(book.book_id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;