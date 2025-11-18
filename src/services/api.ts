// REST API service for the library system
const API_BASE_URL = 'http://localhost:3001/api';

export interface Book {
  book_id: number;
  title: string;
  author: string;
  isbn: string;
  publication_year: number;
  publisher: string;
  genre: string;
  total_copies: number;
  available_copies: number;
  created_at: string;
}

export interface Member {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  membership_date: string;
  status: string;
}

export interface BorrowingRecord {
  record_id: number;
  book_id: number;
  member_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  created_at: string;
}

export interface BorrowingWithDetails extends BorrowingRecord {
  book_title: string;
  book_author: string;
  member_name: string;
  member_email: string;
  days_overdue: number;
}

class LibraryApi {
  // Books API
  async getBooks(): Promise<Book[]> {
    const response = await fetch(`${API_BASE_URL}/books`);
    return response.json();
  }

  async createBook(book: Omit<Book, 'book_id' | 'created_at'>): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    return response.json();
  }

  async updateBook(bookId: number, book: Partial<Book>): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    return response.json();
  }

  async deleteBook(bookId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/books/${bookId}`, { method: 'DELETE' });
  }

  // Members API
  async getMembers(): Promise<Member[]> {
    const response = await fetch(`${API_BASE_URL}/members`);
    return response.json();
  }

  async createMember(member: Omit<Member, 'member_id' | 'membership_date'>): Promise<Member> {
    const response = await fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    return response.json();
  }

  async updateMember(memberId: number, member: Partial<Member>): Promise<Member> {
    const response = await fetch(`${API_BASE_URL}/members/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    return response.json();
  }

  // Borrowing API
  async borrowBook(bookId: number, memberId: number, borrowDays: number = 14): Promise<BorrowingRecord> {
    const response = await fetch(`${API_BASE_URL}/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: bookId, member_id: memberId, borrow_days: borrowDays }),
    });
    return response.json();
  }

  async returnBook(recordId: number): Promise<BorrowingRecord> {
    const response = await fetch(`${API_BASE_URL}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ record_id: recordId }),
    });
    return response.json();
  }

  async getCurrentBorrowings(): Promise<BorrowingWithDetails[]> {
    const response = await fetch(`${API_BASE_URL}/borrowings/current`);
    return response.json();
  }

  async getBorrowingHistory(memberId?: number): Promise<BorrowingWithDetails[]> {
    const url = memberId 
      ? `${API_BASE_URL}/borrowings/history?member_id=${memberId}`
      : `${API_BASE_URL}/borrowings/history`;
    const response = await fetch(url);
    return response.json();
  }

  async getOverdueBooks(): Promise<BorrowingWithDetails[]> {
    const response = await fetch(`${API_BASE_URL}/borrowings/overdue`);
    return response.json();
  }
}

export const libraryApi = new LibraryApi();