"use client";
import { useState } from "react";
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "@/utils/api/friendsApi";

type RelationshipStatus = {
  targetId: string;
  areFriends: boolean;
  hasPendingFriendRequest: boolean;
  theySentRequest: boolean;
  requestId: string | null;
  canMessage: boolean;
};

type Props = {
  username: string;
  relationship: RelationshipStatus;
};

export default function RelationshipActions({ username, relationship }: Props) {
  const [status, setStatus] = useState(relationship);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await sendFriendRequest(username);
      setStatus({
        ...status,
        hasPendingFriendRequest: true,
        theySentRequest: false,
        requestId: null,
      });
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelFriendRequest(username);
      setStatus({
        ...status,
        hasPendingFriendRequest: false,
        requestId: null,
      });
    } catch (err) {
      console.error("Cancel failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!status.requestId) return;
    setLoading(true);
    try {
      await acceptFriendRequest(status.requestId);
      setStatus({
        ...status,
        areFriends: true,
        hasPendingFriendRequest: false,
        requestId: null,
      });
    } catch (err) {
      console.error("Accept failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!status.requestId) return;
    setLoading(true);
    try {
      await declineFriendRequest(status.requestId);
      setStatus({
        ...status,
        hasPendingFriendRequest: false,
        requestId: null,
      });
    } catch (err) {
      console.error("Decline failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white/60">Processing...</p>;

  if (status.areFriends) {
    return <span className="text-green-400 font-semibold">✅ Friends</span>;
  }

  if (status.hasPendingFriendRequest) {
    return status.theySentRequest ? (
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded"
        >
          Decline
        </button>
      </div>
    ) : (
      <button
        onClick={handleCancel}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1.5 rounded"
      >
        Cancel Request
      </button>
    );
  }

  return (
    <button
      onClick={handleSend}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded"
    >
      Add Friend
    </button>
  );
}
