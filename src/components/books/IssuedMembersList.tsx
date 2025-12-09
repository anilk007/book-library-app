import React from 'react';
import type { IssuedMember } from '../../services/api';

interface IssuedMembersListProps {
  members: IssuedMember[];
  loading: boolean;
  bookTitle?: string;
}

const IssuedMembersList: React.FC<IssuedMembersListProps> = ({ 
  members, 
  loading,
  bookTitle 
}) => {
  if (loading) {
    return (
      <div className="py-2 text-center text-gray-500 text-sm">
        Loading members...
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="py-2 text-gray-500 text-sm">
        No members currently have this book issued.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="font-medium text-sm">
        Currently issued to ({members.length} member{members.length !== 1 ? 's' : ''}):
      </div>
      <div className="space-y-1">
        {members.map((member) => {
          const dueDate = new Date(member.due_date);
          const isOverdue = dueDate < new Date();
          
          return (
            <div 
              key={member.transaction_id} 
              className="p-2 bg-gray-50 rounded text-sm border border-gray-200"
            >
              <div className="flex justify-between">
                <div className="font-medium">
                  {member.first_name} {member.last_name}
                </div>
                <div className={`text-xs ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                  Due: {dueDate.toLocaleDateString()}
                  {isOverdue && ' (Overdue)'}
                </div>
              </div>
              <div className="text-gray-600 text-xs">
                Email: {member.email}
              </div>
              <div className="text-gray-500 text-xs">
                Issued: {new Date(member.issue_date).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IssuedMembersList;