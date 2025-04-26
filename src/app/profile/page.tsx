'use client';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/utils/apiFunctions';

export default function ProfilePage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const res = await fetchUserProfile() as { user: { username: string; role_name: string; points?: number } };
            setUser(res.user);
        };
        loadProfile();
    }, []);

    if (!user) return <div className="text-center mt-10">Loading profile...</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Role:</strong> {user.role_name}</p>
            <p><strong>Points:</strong> {user.points || 0}</p>
        </div>
    );
}
