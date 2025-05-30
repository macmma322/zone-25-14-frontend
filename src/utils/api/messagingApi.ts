export const startConversation = async (memberIds: string[]) => {
  const res = await fetch("http://localhost:5000/api/messaging/conversations", {
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
  const res = await fetch("http://localhost:5000/api/messaging/messages", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, content }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

export const getMessages = async (conversationId: string) => {
  const res = await fetch(`http://localhost:5000/api/messaging/messages/${conversationId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};
