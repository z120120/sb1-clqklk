import React from 'react';
import { Feedback, User } from '../types';
import FeedbackItem from './FeedbackItem';

interface FeedbackListProps {
  feedbacks: Feedback[];
  currentUser: User;
  onStatusChange: (feedbackId: string, newStatus: 'resolved' | 'unresolved') => void;
  onReply: (feedbackId: string, content: string, attachments: string[]) => void;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks, currentUser, onStatusChange, onReply }) => {
  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <FeedbackItem
          key={feedback.id}
          feedback={feedback}
          currentUser={currentUser}
          onStatusChange={onStatusChange}
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default FeedbackList;