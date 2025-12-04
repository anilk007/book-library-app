import React, { useState, useEffect } from 'react';
import type { Member } from '../../services/api';
import { libraryApi } from '../../services/api';
import CreateMember from './CreateMember';

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const membersData = await libraryApi.getMembers();
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberCreated = (newMember: Member) => {
    setMembers(prev => [...prev, newMember]);
    setShowCreateForm(false);
  };

  const handleDeleteMember = async (memberId: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await libraryApi.deleteMember(memberId);
        setMembers(prev => prev.filter(member => member.member_id !== memberId));
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Error deleting member. They might have active transactions.');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; text: string }> = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800' },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'Suspended': { bg: 'bg-red-100', text: 'text-red-800' },
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' }
    };
    
    const style = statusStyles[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return `${style.bg} ${style.text}`;
  };

  if (loading) return <div className="p-4">Loading members...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Library Members</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Add New Member'}
        </button>
      </div>

      {showCreateForm && (
        <CreateMember onMemberCreated={handleMemberCreated} />
      )}

      {members.length === 0 ? (
        <div className="text-center py-8 border rounded">No members registered.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Address</th>
                <th className="p-2 text-left">Membership Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.member_id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-2 whitespace-nowrap">{member.member_id}</td>
                  <td className="p-2">
                    <div className="font-medium">
                      {member.first_name} {member.last_name}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <a 
                      href={`mailto:${member.email}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {member.email}
                    </a>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {member.phone ? (
                      <a 
                        href={`tel:${member.phone}`}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        {member.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-2">
                    <div className="max-w-xs truncate" title={member.address}>
                      {member.address || '-'}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {formatDate(member.membership_date)}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        onClick={() => {
                          // Add edit functionality here if needed
                          console.log('Edit member:', member.member_id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        onClick={() => handleDeleteMember(member.member_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary footer */}
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
        <div>
          <span className="font-medium">Total Members:</span> {members.length}
        </div>
        <div className="flex space-x-4">
          <div>
            <span className="font-medium">Active:</span>{' '}
            {members.filter(m => m.status === 'Active').length}
          </div>
          <div>
            <span className="font-medium">Inactive:</span>{' '}
            {members.filter(m => m.status === 'Inactive').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberList;