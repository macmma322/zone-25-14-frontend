'use client';
import { useState } from 'react';
import { registerUser } from '@/utils/apiFunctions';

export default function RegisterPage() {
    const [form, setForm] = useState({ username: '', password: '', email: '', phone: '', first_name: '', last_name: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        const res = await registerUser(form);
        console.log(res);
        alert('Registration successful!');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Register</h1>
            {Object.keys(form).map((field) => (
                <input
                    key={field}
                    name={field}
                    onChange={handleChange}
                    className="input mb-4"
                    placeholder={field.replace('_', ' ')}
                />
            ))}
            <button onClick={handleRegister} className="btn w-full">Register</button>
        </div>
    );
}
