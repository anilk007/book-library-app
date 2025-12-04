import React, { useEffect, useState } from "react";
import { libraryApi, type Transaction } from "../../services/api";

const CurrentIssuedBooks: React.FC = () => {
  const [issued, setIssued] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssued();
  }, []);

  const loadIssued = async () => {
    try {
      const response = await fetch("http://localhost:8000/transactions/issued");
      const data = await response.json();
      setIssued(data.issued_books);
    } catch (err) {
      console.error("Error loading issued books", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading issued books...</div>;

  if (issued.length === 0)
    return <div>No books are currently issued.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Current Issued Books</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Transaction ID</th>
            <th className="p-2">Book ID</th>
            <th className="p-2">Member ID</th>
            <th className="p-2">Issue Date</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {issued.map((t) => (
            <tr key={t.transaction_id} className="border-b">
              <td className="p-2">{t.transaction_id}</td>
              <td className="p-2">{t.book_id}</td>
              <td className="p-2">{t.member_id}</td>
              <td className="p-2">{t.issue_date}</td>
              <td className="p-2">{t.due_date}</td>
              <td className="p-2">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentIssuedBooks;
