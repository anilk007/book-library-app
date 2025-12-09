import React from 'react';
import type { Book, IssuedMember } from '../../services/api';
import IssuedMembersList from './IssuedMembersList';

interface BookRowProps {
  book: Book;
  issuedMembers: IssuedMember[];
  isExpanded: boolean;
  isLoading: boolean;
  onToggleExpand: () => void;
  onDelete: (bookId: number) => void;
}

const BookRow: React.FC<BookRowProps> = ({
  book,
  issuedMembers,
  isExpanded,
  isLoading,
  onToggleExpand,
  onDelete
}) => {
  return (
    <>
      <tr className="border-b border-gray-300 hover:bg-gray-50">
        <td className="p-2 whitespace-nowrap">{book.book_id}</td>
        <td className="p-2 whitespace-nowrap">{book.title}</td>
        <td className="p-2 whitespace-nowrap">{book.author}</td>
        <td className="p-2 whitespace-nowrap">{book.isbn || "-"}</td>
        <td className="p-2 whitespace-nowrap">{book.publication_year}</td>
        <td className="p-2 whitespace-nowrap">{book.publisher || "-"}</td>
        <td className="p-2 whitespace-nowrap">{book.genre}</td>
        <td className="p-2 whitespace-nowrap">{book.total_copies}</td>
        <td className="p-2 whitespace-nowrap">
          <span className={`px-2 py-1 rounded text-xs ${
            book.available_copies === 0 
              ? 'bg-red-100 text-red-800'
              : book.available_copies < book.total_copies
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {book.available_copies}
          </span>
        </td>
        <td className="p-2 whitespace-nowrap space-x-2">
          <button
            className={`px-3 py-1 text-white rounded text-sm ${
              isExpanded 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
            onClick={onToggleExpand}
            disabled={isLoading}
            title={isExpanded ? "Hide issued members" : "Show issued members"}
          >
            {isLoading ? 'Loading...' : (isExpanded ? 'Hide Members' : 'Show Members')}
          </button>
          <button
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            onClick={() => onDelete(book.book_id)}
          >
            Delete
          </button>
        </td>
      </tr>
      
      {/* Expanded row for showing issued members */}
      {isExpanded && (
        <tr>
          <td colSpan={10} className="p-4 bg-gray-50">
            <div className="ml-8">
              <IssuedMembersList
                members={issuedMembers}
                loading={isLoading}
                bookTitle={book.title}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default BookRow;