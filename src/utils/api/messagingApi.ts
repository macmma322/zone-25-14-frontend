// zone-25-14-frontend/src/utils/api/messagingApi.ts

const BASE_URL = "http://localhost:5000/api/messaging";
const REACT_URL = "http://localhost:5000/api/reactions";

/**
 * Start a new conversation between users
 */
export const startConversation = async (memberIds: string[]) => {
  const res = await fetch(`${BASE_URL}/conversations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      isGroup: false,
      groupName: null,
      memberIds,
    }),
  });

  if (!res.ok) throw new Error("Failed to start conversation");
  return res.json();
};

/**
 * Send a message to a conversation
 */
export const sendMessage = async (
  conversationId: string,
  content: string,
  replyToMessageId?: string
) => {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId,
      content,
      replyToMessageId: replyToMessageId ?? null,
    }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

/**
 * Get paginated messages from a conversation
 */
export const getMessages = async (
  convoId: string,
  before?: string,
  limit: number = 30
) => {
  const url = new URL(`${BASE_URL}/messages`);
  url.searchParams.append("conversationId", convoId);
  if (before) url.searchParams.append("before", before);
  url.searchParams.append("limit", limit.toString());

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

/**
 * Toggle a reaction on a message
 * Sends the same reaction again to remove it.
 * Sends a different reaction to change it.
 */
export const toggleReaction = async (messageId: string, reaction: string) => {
  const res = await fetch(`${REACT_URL}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message_id: messageId, reaction }),
  });

  if (!res.ok) throw new Error("Failed to toggle reaction");
  return res.json();
};

/**
 * Explicitly update the emoji of an existing reaction (PATCH)
 */
export const patchReaction = async (
  reactionId: string,
  newReaction: string
) => {
  const res = await fetch(`${REACT_URL}/${reactionId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newReaction }),
  });

  if (!res.ok) throw new Error("Failed to update reaction");
  return res.json();
};

/**
 * Explicitly delete a reaction by its ID (DELETE)
 */
export const deleteReaction = async (reactionId: string) => {
  const res = await fetch(`${REACT_URL}/${reactionId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete reaction");
  return res.json();
};

/**
 * Fetch reactions for a specific message
 */
export const fetchMessageReactions = async (messageId: string) => {
  const res = await fetch(`${REACT_URL}?messageId=${messageId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to load reactions");
  return res.json();
};

/**
 * Fetch all reactions across a conversation
 */
export const fetchConversationReactions = async (conversationId: string) => {
  const res = await fetch(
    `${REACT_URL}/byConversation?conversationId=${conversationId}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to load reactions for conversation");
  return res.json();
};
