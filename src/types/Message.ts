// File: src/types/Message.ts
// Description: Reaction routes for handling message reactions in conversations
// Functions: addReactionController, getReactionsByMessage, getReactionsByConversation
// This file contains the routes for adding and retrieving reactions to messages in conversations.
// The addReactionController function handles adding a reaction to a message, while the getReactionsByMessage and getReactionsByConversation functions retrieve reactions for a specific message or conversation, respectively.

export type Reaction = {
  reaction_id: string;
  message_id: string;
  user_id: string;
  username: string;
  reaction: string;
  reacted_at: string;
  avatar?: string | null;
};

export type Message = {
  message_id: string;
  sender_id: string;
  username: string;
  content: string;
  sent_at?: string;
  read_at?: string;
  reactions?: Reaction[];

  reply_to_id?: string;
  reply_to_message?: {
    message_id: string;
    username: string;
    content: string;
  };
};
