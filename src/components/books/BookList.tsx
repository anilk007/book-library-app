import React, { useState, useEffect } from "react";
import type { Book } from "../../services/api";
import { libraryApi } from "../../services/api";
import { useBookIssuedMembers } from "../../hooks/useBookIssuedMembers";
import CreateBook from "./CreateBook";
import BookRow from "./BookRow";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Use the custom hook for managing issued members
  const {
    issuedMembers,
    expandedBookId,
    loadingStates,
    toggleBookExpand,
    clearBookMembers
  } = useBookIssuedMembers();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const booksData = await libraryApi.getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookCreated = (newBook: Book) => {
    setBooks((prev) => [...prev, newBook]);
    setShowCreateForm(false);
  };

  const handleDeleteBook = async (bookId: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await libraryApi.deleteBook(bookId);
        setBooks((prev) => prev.filter((book) => book.book_id !== bookId));
        // Clear the issued members cache for this book
        clearBookMembers(bookId);
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book. It might be currently issued.");
      }
    }
  };

  if (loading) return <div className="p-4">Loading books...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Library Books</h2>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Add New Book"}
        </button>
      </div>

      {showCreateForm && <CreateBook onBookCreated={handleBookCreated} />}

      {books.length === 0 ? (
        <div className="text-gray-500">No books found in the library.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Author</th>
              <th className="p-2 text-left">ISBN</th>
              <th className="p-2 text-left">Year</th>
              <th className="p-2 text-left">Publisher</th>
              <th className="p-2 text-left">Genre</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Available</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <BookRow
                key={book.book_id}
                book={book}
                issuedMembers={issuedMembers[book.book_id] || []}
                isExpanded={expandedBookId === book.book_id}
                isLoading={loadingStates[book.book_id] || false}
                onToggleExpand={() => toggleBookExpand(book.book_id)}
                onDelete={handleDeleteBook}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookList;