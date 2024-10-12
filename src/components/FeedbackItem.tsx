import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Button, Input, Badge, Link, useColorModeValue } from '@chakra-ui/react';
import { Paperclip, Send } from 'lucide-react';
import { Feedback, User, FeedbackType } from '../types';

interface FeedbackItemProps {
  feedback: Feedback;
  currentUser: User;
  onStatusChange: (feedbackId: string, newStatus: 'resolved' | 'unresolved') => void;
  onReply: (feedbackId: string, content: string, attachments: string[]) => void;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, currentUser, onStatusChange, onReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    onReply(feedback.id, replyContent, attachments);
    setReplyContent('');
    setAttachments([]);
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const canChangeStatus = currentUser.isAdmin || currentUser.id === feedback.userId;

  const getTypeColor = (type: FeedbackType): string => {
    switch (type) {
      case 'BUG':
        return 'red';
      case '新功能':
        return 'blue';
      case '功能优化':
        return 'green';
      case '性能问题':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box bg={bgColor} shadow="md" rounded="lg" p={6} borderWidth={1} borderColor={borderColor}>
      <VStack align="stretch" spacing={4}>
        <HStack justifyContent="space-between">
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{feedback.userName}</Text>
            <Text fontSize="sm" color="gray.500">{feedback.createdAt.toLocaleString()}</Text>
          </VStack>
          <HStack>
            <Badge colorScheme={getTypeColor(feedback.type)}>{feedback.type}</Badge>
            <Badge colorScheme={feedback.status === 'resolved' ? 'green' : 'yellow'}>
              {feedback.status === 'resolved' ? '已解决' : '未解决'}
            </Badge>
            {canChangeStatus && (
              <Button
                size="sm"
                onClick={() => onStatusChange(feedback.id, feedback.status === 'resolved' ? 'unresolved' : 'resolved')}
              >
                更改状态
              </Button>
            )}
          </HStack>
        </HStack>
        <Text>{feedback.content}</Text>
        {feedback.attachments.length > 0 && (
          <Box>
            <Text fontWeight="semibold" mb={2}>附件:</Text>
            <HStack>
              {feedback.attachments.map((attachment, index) => (
                <Link key={index} href={attachment} isExternal color="blue.500">
                  附件 {index + 1}
                </Link>
              ))}
            </HStack>
          </Box>
        )}
        <Box>
          <Text fontWeight="semibold" mb={2}>回复:</Text>
          <VStack align="stretch" spacing={2}>
            {feedback.replies.map((reply, index) => (
              <Box key={index} bg={useColorModeValue('gray.100', 'gray.600')} p={3} rounded="md">
                <HStack justifyContent="space-between" mb={2}>
                  <Text fontWeight="semibold">{reply.userName}</Text>
                  <Text fontSize="sm" color="gray.500">{reply.createdAt.toLocaleString()}</Text>
                </HStack>
                <Text>{reply.content}</Text>
                {reply.attachments.length > 0 && (
                  <HStack mt={2}>
                    <Text fontSize="sm" fontWeight="semibold">附件:</Text>
                    {reply.attachments.map((attachment, attIndex) => (
                      <Link key={attIndex} href={attachment} isExternal fontSize="sm" color="blue.500">
                        附件 {attIndex + 1}
                      </Link>
                    ))}
                  </HStack>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
        <Box as="form" onSubmit={handleReply}>
          <HStack>
            <Input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="输入您的回复..."
            />
            <Button as="label" cursor="pointer">
              <Paperclip />
              <input type="file" hidden onChange={handleAttachment} multiple />
            </Button>
            <Button type="submit" colorScheme="blue">
              <Send />
            </Button>
          </HStack>
          {attachments.length > 0 && (
            <Text fontSize="sm" mt={2}>
              已附加文件: {attachments.map((_, index) => `文件 ${index + 1}`).join(', ')}
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default FeedbackItem;