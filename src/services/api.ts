// REST API service for the library system
const API_BASE_URL = 'http://localhost:8000';

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

export interface Transaction {
  transaction_id: number;
  book_id: number;
  member_id: number;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  created_at: string;
}

export interface TransactionWithDetails extends Transaction {
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

  async getBook(bookId: number): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
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

  async getMember(memberId: number): Promise<Member> {
    const response = await fetch(`${API_BASE_URL}/members/${memberId}`);
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

  // Transactions API
  async issueBook(bookId: number, memberId: number): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: bookId, member_id: memberId }),
    });
    return response.json();
  }


  async getMemberIssuedBooks(memberId: number): Promise<TransactionWithDetails[]> {
    // Assuming your backend has an endpoint to get issued books for a specific member
    // You might need to adjust the endpoint based on your backend API
    const response = await fetch(`${API_BASE_URL}/members/${memberId}/issued-books`);

    if (!response.ok) {
      throw new Error(`Failed to fetch issued books for member ${memberId}`);
    }

    return response.json();
  }

  async returnBook(transactionId: number): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async getCurrentTransactions(): Promise<TransactionWithDetails[]> {
    const response = await fetch(`${API_BASE_URL}/transactions?status=Issued`);
    return response.json();
  }

  async getTransactionHistory(memberId?: number): Promise<TransactionWithDetails[]> {
    const url = memberId
      ? `${API_BASE_URL}/transactions/history?member_id=${memberId}`
      : `${API_BASE_URL}/transactions/history`;
    const response = await fetch(url);
    return response.json();
  }

  async getOverdueTransactions(): Promise<TransactionWithDetails[]> {
    const response = await fetch(`${API_BASE_URL}/transactions?status=Overdue`);
    return response.json();
  }

  async getTransaction(transactionId: number): Promise<TransactionWithDetails> {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`);
    return response.json();
  }

  async updateTransaction(transactionId: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    return response.json();
  }

  // Members API - add deleteMember method
  async deleteMember(memberId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/members/${memberId}`, { method: 'DELETE' });
  }





}

export const libraryApi = new LibraryApi();