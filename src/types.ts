export interface Feedback {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: Date;
  status: 'unresolved' | 'resolved';
  type: FeedbackType;
  attachments: string[];
  replies: Reply[];
}

export type FeedbackType = 'BUG' | '新功能' | '功能优化' | '性能问题' | '其他';

export interface Reply {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: Date;
  attachments: string[];
}

export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}