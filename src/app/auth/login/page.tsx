"use client";
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    try {
      // Use redirect:false to inspect the result and handle errors client-side
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      } as any);

      if (res && (res as any).error) {
        setError((res as any).error || 'Échec de la connexion');
        setLoading(false);
        return;
      }

      // successful, navigate to callbackUrl
      router.push(callbackUrl);
    } catch (err) {
      setError('Erreur interne, réessayez');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
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
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
