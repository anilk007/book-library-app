import React from 'react';
import type { Member } from '../../services/api';

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="member-card">
      <h3>{member.name}</h3>
      <p>Email: {member.email}</p>
      <p>Phone: {member.phone}</p>
      <p>Member ID: {member.member_id}</p>
    </div>
  );
};

export default MemberCard;