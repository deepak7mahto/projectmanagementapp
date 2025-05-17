import { useState } from 'react';
import { supabase } from '~/utils/supabaseClient';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccess('Login successful!');
        // Redirect after successful login
        router.push('/tasks');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Insert into profiles table if signup is successful and user exists
        const user = data?.user;
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: user.id }]);
          if (profileError) throw profileError;
        }
        setSuccess('Signup successful! Check your email for verification.');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow">
        <h1 className="mb-4 text-xl font-bold text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <button onClick={() => setMode('login')} className={mode === 'login' ? 'font-bold' : ''}>
            Login
          </button>
          <button onClick={() => setMode('signup')} className={mode === 'signup' ? 'font-bold' : ''}>
            Sign Up
          </button>
        </div>
        {error && <div className="mt-4 text-red-600">{error}</div>}
        {success && <div className="mt-4 text-green-600">{success}</div>}
      </div>
    </div>
  );
}
