import React, { useState } from 'react';
import { libraryApi } from '../../services/api';

interface CreateBookProps {
  onBookCreated: (book: any) => void;
}

const CreateBook: React.FC<CreateBookProps> = ({ onBookCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publication_year: new Date().getFullYear(),
    publisher: '',
    genre: '',
    total_copies: 1
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publication_year' || name === 'total_copies'
        ? parseInt(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await libraryApi.createBook(formData);

      // 2. Fetch the newly created book using book_id
      const newBook = await libraryApi.getBook(response.book_id);

      onBookCreated(newBook);

      setFormData({
        title: '',
        author: '',
        isbn: '',
        publication_year: new Date().getFullYear(),
        publisher: '',
        genre: '',
        total_copies: 1
      });
    } catch (error) {
      console.error('Error creating book:', error);
      alert('Error creating book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Biography',
    'History',
    'Science',
    'Technology'
  ];

  return (
    <div className="create-book-form">
      <h3>Add New Book</h3>
      <form onSubmit={handleSubmit}>

        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
            />
          </div>

          <div className="form-group">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN"
            />
          </div>

          <div className="form-group">
            <label>Publication Year</label>
            <input
              type="number"
              name="publication_year"
              value={formData.publication_year}
              onChange={handleChange}
              min="1000"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Enter publisher name"
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            >
              <option value="">Select Genre</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Total Copies</label>
          <input
            type="number"
            name="total_copies"
            value={formData.total_copies}
            onChange={handleChange}
            min="1"
            max="100"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBook;
