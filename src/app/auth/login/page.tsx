"use client";
import React from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    await signIn('credentials', { redirect: true, email, password });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" required className="mt-1 block w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input name="password" type="password" required className="mt-1 block w-full rounded border px-3 py-2" />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Se connecter</button>
          </div>
        </form>
      </div>
    </main>
  );
}
