import React, { useState } from 'react';
import BookList from './components/books/BookList';
import MemberList from './components/members/MemberList';
import BorrowBook from './components/borrowing/BorrowBook';
import CurrentBorrowings from './components/borrowing/CurrentBorrowings';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

type TabType = 'dashboard' | 'books' | 'members' | 'borrow' | 'current';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <BookList />;
      case 'members':
        return <MemberList />;
      case 'borrow':
        return <BorrowBook />;
      case 'current':
        return <CurrentBorrowings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Library Management System</h1>
        <nav className="app-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'books' ? 'active' : ''}
            onClick={() => setActiveTab('books')}
          >
            Books
          </button>
          <button 
            className={activeTab === 'members' ? 'active' : ''}
            onClick={() => setActiveTab('members')}
          >
            Members
          </button>
          <button 
            className={activeTab === 'borrow' ? 'active' : ''}
            onClick={() => setActiveTab('borrow')}
          >
            Borrow Book
          </button>
          <button 
            className={activeTab === 'current' ? 'active' : ''}
            onClick={() => setActiveTab('current')}
          >
            Current Borrowings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;