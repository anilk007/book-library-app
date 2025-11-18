import React, { useState, useEffect } from 'react';
import { libraryApi, Member } from '../../services/api';
import MemberCard from './MemberCard';
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

  if (loading) return <div className="loading">Loading members...</div>;

  return (
    <div className="member-list">
      <div className="header">
        <h2>Library Members</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Add New Member'}
        </button>
      </div>

      {showCreateForm && (
        <CreateMember onMemberCreated={handleMemberCreated} />
      )}

      <div className="members-grid">
        {members.length === 0 ? (
          <div className="empty-state">No members registered.</div>
        ) : (
          members.map(member => (
            <MemberCard key={member.member_id} member={member} />
          ))
        )}
      </div>
    </div>
  );
};

export default MemberList;