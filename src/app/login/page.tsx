'use client';
import { useState } from 'react';
import { loginUser } from '@/utils/apiFunctions';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await loginUser(form.username, form.password);
    console.log(res);
    if (res.token) {
      alert('Login successful!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <input name="username" onChange={handleChange} className="input mb-4" placeholder="Username" />
      <input name="password" type="password" onChange={handleChange} className="input mb-4" placeholder="Password" />
      <button onClick={handleLogin} className="btn w-full">Login</button>
    </div>
  );
}
