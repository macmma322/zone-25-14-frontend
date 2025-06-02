const BASE_URL = "http://localhost:5000/api/messaging";

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

export const sendMessage = async (conversationId: string, content: string) => {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, content }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

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
