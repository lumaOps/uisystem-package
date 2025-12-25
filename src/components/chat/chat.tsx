'use client';

import { Paperclip, Mic, SendHorizonal, CarFront, DollarSign } from 'lucide-react';
import React, { useState } from 'react';
import { CustomButton } from '@/components/button/CustomButton';
import { ChatMessageList } from './chat-message-list';
import Image from 'next/image';
import { ChatViewProps, ChatMessage, QuickReply } from '@/types/chat/chat';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

const ChatHeader: React.FC<{
  name: string;
  avatar?: string;
  initials?: string;
  source?: string;
  onMarkNotInterested?: () => void;
}> = ({ name, avatar, initials, source, onMarkNotInterested }) => {
  const t = useCustomTranslation();

  return (
    <div className="flex items-center gap-3 flex-wrap border-b border-border px-4 sm:px-6 py-3 sm:py-4 bg-background">
      {avatar ? (
        <Image
          width={48}
          height={48}
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border border-border"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold border border-border">
          {initials || name[0]}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg leading-tight text-foreground">{name}</div>
        {source && <div className="text-xs text-muted-foreground">{source}</div>}
      </div>
      <CustomButton
        variant="outline"
        size="sm"
        onClick={onMarkNotInterested}
        className="font-medium w-full sm:w-auto"
      >
        {t('Mark as not interested')}
      </CustomButton>
    </div>
  );
};

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const images = message.media || [];
  const showImageGrid = images.length > 0;
  const maxImages = 4;
  const imagesToShow = images.slice(0, maxImages);
  const extraCount = images.length - maxImages;

  return (
    <div
      className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'} w-full max-w-full`}
    >
      <div className="flex items-end gap-2 w-full max-w-full min-w-0 md:max-w-[70%]">
        {message.senderType !== 'user' &&
          (message.senderAvatar ? (
            <Image
              src={message.senderAvatar}
              alt={message.sender}
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold border border-border">
              {message.senderInitials || message.sender[0]}
            </div>
          ))}
        <div
          className={`rounded-lg px-4 py-2 text-sm shadow w-full max-w-full break-words overflow-x-hidden md:max-w-[90%] ${message.senderType === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
          style={{
            borderTopLeftRadius: message.senderType === 'user' ? 16 : 4,
            borderTopRightRadius: message.senderType === 'user' ? 4 : 16,
          }}
        >
          <span className="break-words w-full max-w-full block">{message.content}</span>
          {showImageGrid && (
            <div className="mt-2 grid grid-cols-2 gap-2 w-full max-w-xs">
              {imagesToShow.map((url, i) => (
                <div key={i} className="relative w-full aspect-square rounded-md overflow-hidden">
                  <Image
                    src={url}
                    alt="media"
                    className="object-cover w-full h-full rounded-md"
                    width={100}
                    height={100}
                  />
                  {extraCount > 0 && i === maxImages - 1 && (
                    <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center rounded-md">
                      <span className="text-background text-lg font-semibold">+{extraCount}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {message.senderType === 'user' && <div className="w-8 h-8" />}
      </div>
    </div>
  );
};

const QuickReplies: React.FC<{ quickReplies?: QuickReply[] }> = ({ quickReplies }) => {
  const t = useCustomTranslation();

  return quickReplies && quickReplies.length > 0 ? (
    <div className=" pb-4 flex flex-col gap-2">
      <span className="text-md text-foreground font-medium flex">
        {t('Quick messages suggestions')}
      </span>
      <div className="flex flex-wrap gap-2 w-full min-w-0 max-w-full overflow-x-auto">
        {quickReplies.map((qr, i) => (
          <CustomButton
            key={i}
            variant="outline"
            size="sm"
            onClick={qr.onClick}
            className="font-medium whitespace-normal break-words max-w-full h-auto min-h-0 py-2"
          >
            {qr.label}
          </CustomButton>
        ))}
      </div>
    </div>
  ) : null;
};

const ChatInputArea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  onMic?: () => void;
  isLoading?: boolean;
}> = ({ value, onChange, onSend, onAttach, onMic, isLoading }) => {
  const t = useCustomTranslation();

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (value.trim()) onSend();
      }}
      className="relative rounded-lg border border-border bg-background focus-within:ring-1 focus-within:ring-ring p-1 w-full max-w-full min-w-0"
    >
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('Write a message')}
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0 w-full text-foreground"
        disabled={isLoading}
      />
      <div className="flex flex-wrap md:flex-nowrap gap-2 items-center p-3 pt-0 w-full min-w-0 max-w-full">
        <div className="flex flex-wrap md:flex-nowrap gap-1 flex-1">
          <CustomButton
            variant="outline"
            type="button"
            icon={<Paperclip className="size-4" />}
            positionIcon="left"
            onClick={onAttach}
            size="sm"
          />
          <CustomButton
            variant="outline"
            type="button"
            icon={<Mic className="size-4" />}
            positionIcon="left"
            onClick={onMic}
            size="sm"
          />
          <CustomButton
            variant="outline"
            type="button"
            icon={<CarFront className="size-4" />}
            positionIcon="left"
            size="sm"
            className="whitespace-normal break-words w-full md:w-auto"
          >
            {t('Suggest vehicles')}
          </CustomButton>
          <CustomButton
            variant="outline"
            type="button"
            icon={<DollarSign className="size-4" />}
            positionIcon="left"
            size="sm"
            className="whitespace-normal break-words w-full md:w-auto"
          >
            {t('Finance simulation')}
          </CustomButton>
        </div>
        <CustomButton
          type="submit"
          variant="default"
          disabled={isLoading}
          icon={<SendHorizonal className="size-4" />}
          positionIcon="right"
          size="sm"
          className="whitespace-normal break-words w-full md:w-auto md:ml-auto"
        >
          {t('Send')}
        </CustomButton>
      </div>
    </form>
  );
};

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  participantName,
  participantAvatar,
  participantInitials,
  participantSource,
  onMarkNotInterested,
  quickReplies,
  onSendMessage,
  onAttachFile,
  onMicClick,
  isLoading,
}) => {
  const [input, setInput] = useState('');
  if (!messages || messages.length === 0) return null;

  return (
    <div className="flex flex-col w-full min-h-0 min-w-0 bg-background overflow-x-hidden">
      <ChatHeader
        name={participantName}
        avatar={participantAvatar}
        initials={participantInitials}
        source={participantSource}
        onMarkNotInterested={onMarkNotInterested}
      />
      <div className="flex-1 min-h-[200px] max-h-[50vh] overflow-y-auto bg-background px-2 sm:px-4 md:px-6 text-sm md:text-base w-full max-w-full">
        <ChatMessageList className="w-full">
          {messages.map(msg => (
            <div key={msg.id} className="max-w-full break-words overflow-x-hidden">
              <ChatBubble key={msg.id} message={msg} />
            </div>
          ))}
        </ChatMessageList>
      </div>
      <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-4 md:px-6 pb-2">
        <div className="flex flex-wrap gap-2 w-full min-w-0">
          <QuickReplies quickReplies={quickReplies} />
        </div>
      </div>
      <div className="px-2 sm:px-4 md:px-6 py-4 border-t border-border bg-background w-full max-w-full overflow-x-hidden">
        <ChatInputArea
          value={input}
          onChange={setInput}
          onSend={() => {
            if (input.trim()) {
              onSendMessage(input);
              setInput('');
            }
          }}
          onAttach={onAttachFile}
          onMic={onMicClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatView;
