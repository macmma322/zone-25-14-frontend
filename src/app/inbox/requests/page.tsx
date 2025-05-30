// File: src/app/inbox/requests/page.tsx

'use client';
import { useEffect, useState } from 'react';
import { fetchInboxRequests, acceptInboxRequest, declineInboxRequest } from '@/utils/api/inboxRequests';
import InboxRequestCard from './InboxRequestCard';
import { useRouter } from 'next/navigation';

type InboxRequest = {
  request_id: string;
  username: string;
  profile_picture: string | null;
  content: string;
  sent_at: string;
};

export default function InboxRequestsPage() {
  const [requests, setRequests] = useState<InboxRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await fetchInboxRequests();
      setRequests(data.requests || []);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    const res = await acceptInboxRequest(requestId);
    const json = await res.json();
    if (res.ok) {
      router.push(`/chat/${json.conversationId}`);
    } else {
      alert(json.error || 'Failed to accept request.');
    }
  };

  const handleDecline = async (requestId: string) => {
    const res = await declineInboxRequest(requestId);
    if (res.ok) {
      setRequests(prev => prev.filter(req => req.request_id !== requestId));
    } else {
      alert('Failed to decline.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Message Requests</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <InboxRequestCard
              key={req.request_id}
              request={req}
              onAccept={() => handleAccept(req.request_id)}
              onDecline={() => handleDecline(req.request_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}