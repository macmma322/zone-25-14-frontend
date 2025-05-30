//File: src/app/inbox/requests/InboxRequestCard.tsx

import Image from "next/image";

interface Props {
  request: {
    request_id: string;
    username: string;
    profile_picture: string | null;
    content: string;
    sent_at: string;
  };
  onAccept: () => void;
  onDecline: () => void;
}

export default function InboxRequestCard({
  request,
  onAccept,
  onDecline,
}: Props) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-start space-x-4">
      <div className="flex-shrink-0">
        <Image
          src={request.profile_picture || "/default-avatar.png"}
          alt={`${request.username}'s profile picture`}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{request.username}</h3>
        <p className="text-gray-600">{request.content}</p>
        <p className="text-sm text-gray-500">
          {new Date(request.sent_at).toLocaleString()}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
