import Image from 'next/image';
import React from 'react';
import {
  ConversationListItem,
  ConversationListProps,
} from '@/modules/inventory/types/vehicle-details/messages';
import { BadgeCustom } from '@/components/badge/BadgeCustom';

const ConversationListItemComponent: React.FC<{
  conversation: ConversationListItem;
  active: boolean;
  onClick: () => void;
}> = ({ conversation, active, onClick }) => (
  <div
    className={`flex items-center gap-3 px-5 py-4  cursor-pointer transition-colors ${active ? 'bg-muted' : 'bg-background hover:bg-muted'} border-b border-border last:border-b-0`}
    onClick={onClick}
    style={{ minHeight: 72 }}
  >
    {conversation.unread ? (
      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
    ) : (
      <div className="w-2 h-2 flex-shrink-0" />
    )}
    {conversation.avatarUrl ? (
      <Image
        width={40}
        height={40}
        src={conversation.avatarUrl}
        alt={conversation.name}
        className="w-10 h-10 rounded-full object-cover border border-border"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-base font-semibold border border-border">
        {conversation.initials || conversation.name[0]}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline gap-2 mb-0.5">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-medium text-[15px] text-foreground truncate">
            {conversation.name}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {conversation.time}
          </span>
        </div>
        {conversation.source && (
          <BadgeCustom
            variant="secondary"
            className="text-xs border border-border  px-2 py-0.5  rounded-full font-medium flex-shrink-0"
          >
            {conversation.source}
          </BadgeCustom>
        )}
      </div>
      <div className="text-sm text-muted-foreground truncate max-w-full leading-tight">
        {conversation.preview}
      </div>
    </div>
  </div>
);

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
}) => (
  <div className="bg-background overflow-hidden">
    {conversations.map(conv => (
      <ConversationListItemComponent
        key={conv.id}
        conversation={conv}
        active={activeConversationId === conv.id}
        onClick={() => onSelectConversation(conv.id)}
      />
    ))}
  </div>
);

export default ConversationList;
