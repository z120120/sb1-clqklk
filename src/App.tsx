import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Heading, Button, useColorMode, Flex } from '@chakra-ui/react';
import { MessageSquare, Sun, Moon } from 'lucide-react';
import FeedbackList from './components/FeedbackList';
import FeedbackForm from './components/FeedbackForm';
import { Feedback, User, FeedbackType } from './types';

const App: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({ id: '1', name: '张三', isAdmin: false });
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    // 模拟从API获取反馈
    const mockFeedbacks: Feedback[] = [
      {
        id: '1',
        content: '新功能很棒，但我发现了一个小bug。',
        userId: '2',
        userName: '李四',
        createdAt: new Date('2023-04-01T10:00:00'),
        status: 'unresolved',
        type: 'BUG',
        attachments: ['https://example.com/screenshot1.png'],
        replies: [],
      },
      {
        id: '2',
        content: '我喜欢新的设计！现在更直观了。',
        userId: '3',
        userName: '王五',
        createdAt: new Date('2023-04-02T14:30:00'),
        status: 'resolved',
        type: '功能优化',
        attachments: [],
        replies: [
          {
            id: '1',
            content: '感谢您的反馈！我们很高兴您喜欢它。',
            userId: '1',
            userName: '张三',
            createdAt: new Date('2023-04-02T15:00:00'),
            attachments: [],
          },
        ],
      },
    ];
    setFeedbacks(mockFeedbacks);
  }, []);

  const handleSubmitFeedback = (content: string, type: FeedbackType, attachments: string[]) => {
    const newFeedback: Feedback = {
      id: (feedbacks.length + 1).toString(),
      content,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date(),
      status: 'unresolved',
      type,
      attachments,
      replies: [],
    };
    setFeedbacks([newFeedback, ...feedbacks]);
  };

  const handleStatusChange = (feedbackId: string, newStatus: 'resolved' | 'unresolved') => {
    setFeedbacks(feedbacks.map(feedback =>
      feedback.id === feedbackId ? { ...feedback, status: newStatus } : feedback
    ));
  };

  const handleReply = (feedbackId: string, content: string, attachments: string[]) => {
    setFeedbacks(feedbacks.map(feedback =>
      feedback.id === feedbackId
        ? {
            ...feedback,
            replies: [
              ...feedback.replies,
              {
                id: (feedback.replies.length + 1).toString(),
                content,
                userId: currentUser.id,
                userName: currentUser.name,
                createdAt: new Date(),
                attachments,
              },
            ],
          }
        : feedback
    ));
  };

  const toggleUserRole = () => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      isAdmin: !prevUser.isAdmin,
    }));
  };

  return (
    <ChakraProvider>
      <Box minHeight="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.800'} py={8}>
        <VStack spacing={8} width="full" maxWidth="container.xl" mx="auto" px={4}>
          <Flex justifyContent="space-between" width="full" alignItems="center">
            <Heading display="flex" alignItems="center" color={colorMode === 'light' ? 'gray.800' : 'white'}>
              <MessageSquare style={{ marginRight: '0.5rem' }} />
              反馈管理系统
            </Heading>
            <Flex>
              <Button onClick={toggleColorMode} mr={4}>
                {colorMode === 'light' ? <Moon /> : <Sun />}
              </Button>
              <Button onClick={toggleUserRole} colorScheme="blue">
                切换到{currentUser.isAdmin ? '用户' : '管理员'}视图
              </Button>
            </Flex>
          </Flex>
          <FeedbackForm onSubmit={handleSubmitFeedback} />
          <FeedbackList
            feedbacks={currentUser.isAdmin ? feedbacks : feedbacks.filter(f => f.userId === currentUser.id)}
            currentUser={currentUser}
            onStatusChange={handleStatusChange}
            onReply={handleReply}
          />
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;