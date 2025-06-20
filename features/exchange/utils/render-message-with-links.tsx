import { ReactNode } from 'react';

import { MessageSegment } from '@/features/exchange/types';

const renderMessageWithLinks = (text: string): ReactNode[] => {
  // Combined regex for hashtags and mentions
  const regex = /(#|@)([^ !@#$%^&*(),.?":{}|<>]*)/g;
  const segments: MessageSegment[] = [];
  let lastIndex = 0;
  let match;

  // Find all matches in a single pass
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }

    // Determine if it's a hashtag or mention
    const type = match[1] === '#' ? 'hashtag' : 'mention';
    segments.push({ type, content: match[2] });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments.map((segment, index) => {
    if (segment.type === 'hashtag') {
      return (
        <a
          key={index}
          target="_blank"
          href={`https://x.com/hashtag/${segment.content}`}
          rel="noopener noreferrer"
        >
          #{segment.content}
        </a>
      );
    } else if (segment.type === 'mention') {
      return (
        <a
          key={index}
          target="_blank"
          href={`https://x.com/${segment.content}`}
          rel="noopener noreferrer"
        >
          @{segment.content}
        </a>
      );
    } else {
      return <span key={index}>{segment.content}</span>;
    }
  });
};

export default renderMessageWithLinks;
