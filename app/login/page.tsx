'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-csev-slate-900 bg-network-pattern flex items-center justify-center p-4">
      <div className="bg-csev-panel rounded-lg shadow-card border border-csev-border p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-csev-green/20 rounded-lg">
              <Zap size={40} className="text-csev-green" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-csev-text-primary">
            <span className="text-csev-green">Charge</span>Smart EV
          </h1>
          <p className="text-csev-text-secondary mt-2">Proposal Generator</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-csev-text-muted text-center mt-6">
          Contact your administrator for account access.
        </p>
      </div>
    </div>
  );
}
