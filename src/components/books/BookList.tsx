import React, { useState, useEffect } from "react";
import type { Book } from "../../services/api";
import { libraryApi } from "../../services/api";
import CreateBook from "./CreateBook";

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
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book. It might be currently issued.");
      }
    }
  };

  if (loading) return <div>Loading books...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Library Books</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Add New Book"}
        </button>
      </div>

      {showCreateForm && <CreateBook onBookCreated={handleBookCreated} />}

      {books.length === 0 ? (
        <div>No books found in the library.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
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
            {books.map((b) => (
              <tr key={b.book_id} className="border-b border-gray-300">
                <td className="p-2 whitespace-nowrap">{b.book_id}</td>
                <td className="p-2 whitespace-nowrap">{b.title}</td>
                <td className="p-2 whitespace-nowrap">{b.author}</td>
                <td className="p-2 whitespace-nowrap">{b.isbn || "-"}</td>
                <td className="p-2 whitespace-nowrap">{b.publication_year}</td>
                <td className="p-2 whitespace-nowrap">{b.publisher || "-"}</td>
                <td className="p-2 whitespace-nowrap">{b.genre}</td>
                <td className="p-2 whitespace-nowrap">{b.total_copies}</td>
                <td className="p-2 whitespace-nowrap">{b.available_copies}</td>
                <td className="p-2 whitespace-nowrap">
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleDeleteBook(b.book_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookList;
