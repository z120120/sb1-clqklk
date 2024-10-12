import React, { useState } from 'react';
import { Box, VStack, Heading, Textarea, Select, Button, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { Paperclip, Send } from 'lucide-react';
import { FeedbackType } from '../types';

interface FeedbackFormProps {
  onSubmit: (content: string, type: FeedbackType, attachments: string[]) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<FeedbackType>('其他');
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content, type, attachments);
    setContent('');
    setType('其他');
    setAttachments([]);
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box as="form" onSubmit={handleSubmit} bg={bgColor} shadow="md" rounded="lg" p={6} width="full">
      <VStack spacing={4} align="stretch">
        <Heading size="md">提交反馈</Heading>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as FeedbackType)}
          placeholder="选择反馈类型"
        >
          <option value="BUG">BUG</option>
          <option value="新功能">新功能</option>
          <option value="功能优化">功能优化</option>
          <option value="性能问题">性能问题</option>
          <option value="其他">其他</option>
        </Select>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在这里输入您的反馈..."
          rows={4}
        />
        <HStack>
          <Button as="label" leftIcon={<Paperclip />} cursor="pointer">
            添加附件
            <input type="file" hidden onChange={handleAttachment} multiple />
          </Button>
          <Button type="submit" colorScheme="blue" leftIcon={<Send />}>
            提交
          </Button>
        </HStack>
        {attachments.length > 0 && (
          <Text fontSize="sm">
            已附加文件: {attachments.map((_, index) => `文件 ${index + 1}`).join(', ')}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default FeedbackForm;