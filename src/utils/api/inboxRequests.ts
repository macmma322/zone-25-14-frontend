// File: src/utils/api/inboxRequests.ts

export async function fetchInboxRequests() {
  const res = await fetch("/api/messaging/requests", {
    credentials: "include",
  });
  return await res.json();
}

export async function acceptInboxRequest(requestId: string) {
  const res = await fetch(`/api/messaging/requests/${requestId}/accept`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
}

export async function declineInboxRequest(requestId: string) {
  const res = await fetch(`/api/messaging/requests/${requestId}/reject`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
}
