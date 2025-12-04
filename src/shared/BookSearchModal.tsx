// src/components/shared/BookSearchModal.tsx
import React, { useState, useEffect } from 'react';
import type { Book } from '../../services/api';
import { libraryApi } from '../../services/api';

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssueBook: (bookId: number) => Promise<void>;
  memberName: string;
}

const BookSearchModal: React.FC<BookSearchModalProps> = ({
  isOpen,
  onClose,
  onIssueBook,
  memberName
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadBooks();
    }
  }, [isOpen]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const booksData = await libraryApi.getBooks();
      const availableBooks = booksData.filter(book => book.available_copies > 0);
      setBooks(availableBooks);
      setFilteredBooks(availableBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  const handleIssueBook = async (bookId: number) => {
    setIssuing(bookId);
    try {
      await onIssueBook(bookId);
      // Refresh available books after issuing
      loadBooks();
    } catch (error) {
      console.error('Error issuing book:', error);
    } finally {
      setIssuing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Issue Book to {memberName}</h3>
              <p className="text-gray-600 mt-1">Search and select a book to issue</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search books by title, author, genre, or ISBN..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">Loading available books...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8">
              {searchTerm ? 'No books found matching your search.' : 'No available books found.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.book_id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-lg truncate">{book.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Genre:</span>
                      <span className="font-medium">{book.genre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">ISBN:</span>
                      <span className="font-mono text-sm">{book.isbn || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Available:</span>
                      <span className={`font-bold ${book.available_copies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.available_copies} / {book.total_copies}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleIssueBook(book.book_id)}
                    disabled={issuing === book.book_id || book.available_copies === 0}
                    className={`w-full mt-4 py-2 px-4 rounded font-medium ${
                      book.available_copies === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {issuing === book.book_id ? 'Issuing...' : 'Issue Book'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Found {filteredBooks.length} available books</span>
              {searchTerm && (
                <span className="text-gray-600 ml-2">(matching "{searchTerm}")</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSearchModal;