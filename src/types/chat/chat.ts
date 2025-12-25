export interface ChatMessage {
  id: string | number;
  content: string;
  sender: string;
  senderAvatar?: string;
  senderInitials?: string;
  senderType?: 'user' | 'participant';
  timestamp?: string;
  media?: string[];
}

export interface QuickReply {
  label: string;
  onClick: () => void;
}

export interface ChatViewProps {
  messages: ChatMessage[];
  participantName: string;
  participantAvatar?: string;
  participantInitials?: string;
  participantSource?: string;
  onMarkNotInterested?: () => void;
  quickReplies?: QuickReply[];
  onSendMessage: (msg: string) => void;
  onAttachFile?: () => void;
  onMicClick?: () => void;
  isLoading?: boolean;
}
