'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogOut, UserPlus, Trash2, KeyRound, Shield, ArrowLeft, Copy, X } from 'lucide-react';

interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
  must_change_password: boolean;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Invite form
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState<'user' | 'admin'>('user');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  // Reset password
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  // Created user credentials (shown after invite for admin to copy/share)
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
    emailSent: boolean;
    emailError?: string | null;
  } | null>(null);

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = useCallback(async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) { router.push('/login'); return; }
      const { user } = await res.json();
      if (user.role !== 'admin') { router.push('/'); return; }
      setCurrentUserId(user.id);
      loadUsers();
    })();
  }, [router, loadUsers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteError(null);

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: inviteEmail,
        name: inviteName || undefined,
        password: invitePassword,
        role: inviteRole,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setCreatedCredentials({
        email: inviteEmail,
        password: invitePassword,
        emailSent: data.emailSent === true,
        emailError: data.emailError ?? null,
      });
      setShowInviteForm(false);
      setInviteEmail('');
      setInviteName('');
      setInvitePassword('');
      setInviteRole('user');
      loadUsers();
    } else {
      const data = await res.json();
      setInviteError(data.error || 'Failed to create user');
    }
    setInviting(false);
  };

  const handleDelete = (user: UserRecord) => {
    setConfirmDialog({
      message: `Delete user ${user.email}? This cannot be undone.`,
      onConfirm: async () => {
        const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('success', 'User deleted');
          loadUsers();
        } else {
          const data = await res.json();
          showToast('error', data.error || 'Failed to delete user');
        }
        setConfirmDialog(null);
      },
    });
  };

  const handleResetPassword = async (userId: string) => {
    if (!resetPassword || resetPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetPassword }),
    });
    if (res.ok) {
      showToast('success', 'Password reset — user will be prompted to change it on next login');
      setResetUserId(null);
      setResetPassword('');
      loadUsers();
    } else {
      showToast('error', 'Failed to reset password');
    }
  };

  const handleToggleRole = async (user: UserRecord) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      showToast('success', `${user.email} is now ${newRole}`);
      loadUsers();
    } else {
      const data = await res.json();
      showToast('error', data.error || 'Failed to update role');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-csev-slate-900 bg-network-pattern flex items-center justify-center">
        <div className="text-csev-text-secondary animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-csev-slate-900 bg-network-pattern">
      {/* Header */}
      <header className="bg-csev-slate-800 border-b border-csev-border shadow-lg">
        <div className="max-w-[1000px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/CSEV-Leaf Symbol TIGHT.png" alt="CSEV" width={36} height={36} />
            <div>
              <h1 className="text-xl font-heading font-bold text-white">
                <span className="text-csev-green">Charge</span>Smart EV
              </h1>
              <p className="text-sm text-csev-text-secondary flex items-center gap-1">
                <Shield size={12} /> User Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading text-white">
            Users ({users.length})
          </h2>
          <Button variant="primary" onClick={() => setShowInviteForm(true)}>
            <UserPlus size={16} className="mr-2" />
            Invite User
          </Button>
        </div>

        {/* Created user credentials */}
        {createdCredentials && (
          <div className="bg-csev-green/10 border border-csev-green/30 rounded-lg p-4 mb-6 animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-medium mb-1">User Created — Share These Credentials</h3>
                <p className="text-xs text-csev-text-secondary">
                  Send these to the user. They&apos;ll be prompted to change the password on first login.
                </p>
              </div>
              <button
                onClick={() => setCreatedCredentials(null)}
                className="text-csev-text-muted hover:text-white p-1 -m-1"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-csev-text-muted mb-1">Email</div>
                <div className="bg-csev-slate-800 px-3 py-2 rounded border border-csev-border text-white font-mono text-sm break-all">
                  {createdCredentials.email}
                </div>
              </div>
              <div>
                <div className="text-xs text-csev-text-muted mb-1">Temporary Password</div>
                <div className="bg-csev-slate-800 px-3 py-2 rounded border border-csev-border text-white font-mono text-sm break-all">
                  {createdCredentials.password}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs">
                {createdCredentials.emailSent ? (
                  <span className="text-csev-green">✓ Invitation email sent to {createdCredentials.email}</span>
                ) : (
                  <span className="text-amber-400">
                    ⚠ Email not sent{createdCredentials.emailError ? ` (${createdCredentials.emailError})` : ''} — share these credentials manually
                  </span>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`
                  );
                  showToast('success', 'Credentials copied to clipboard');
                }}
              >
                <Copy size={14} className="mr-1.5" />
                Copy Credentials
              </Button>
            </div>
          </div>
        )}

        {/* Invite form */}
        {showInviteForm && (
          <div className="bg-csev-panel rounded-lg border border-csev-border p-6 mb-6 animate-fade-in">
            <h3 className="text-white font-medium mb-4">Create New User</h3>
            <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@company.com"
                required
              />
              <Input
                label="Name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="John Doe"
              />
              <Input
                label="Temporary Password"
                type="text"
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
              <div>
                <label className="block text-sm font-medium text-csev-text-secondary mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'user' | 'admin')}
                  className="w-full bg-csev-slate-700 border border-csev-border rounded-lg px-3 py-2 text-csev-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-csev-green"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {inviteError && (
                <div className="col-span-full bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
                  {inviteError}
                </div>
              )}
              <div className="col-span-full flex gap-3 justify-end">
                <Button variant="ghost" type="button" onClick={() => { setShowInviteForm(false); setInviteError(null); }}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={inviting}>
                  {inviting ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Users table */}
        <div className="bg-csev-panel rounded-lg border border-csev-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-csev-border bg-csev-slate-800">
                <th className="text-left text-xs text-csev-text-secondary font-medium px-4 py-3">User</th>
                <th className="text-left text-xs text-csev-text-secondary font-medium px-4 py-3">Role</th>
                <th className="text-left text-xs text-csev-text-secondary font-medium px-4 py-3">Status</th>
                <th className="text-right text-xs text-csev-text-secondary font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-csev-border/50 hover:bg-csev-hover transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-white text-sm">{user.name || user.email}</span>
                      {user.name && (
                        <span className="block text-xs text-csev-text-muted">{user.email}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-csev-green/20 text-csev-green'
                        : 'bg-csev-slate-600/50 text-csev-text-secondary'
                    }`}>
                      {user.role === 'admin' && <Shield size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.must_change_password ? (
                      <span className="text-xs text-amber-400">Pending password change</span>
                    ) : (
                      <span className="text-xs text-csev-text-muted">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Reset password */}
                      {resetUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={resetPassword}
                            onChange={(e) => setResetPassword(e.target.value)}
                            placeholder="New password"
                            className="bg-csev-slate-700 border border-csev-border rounded px-2 py-1 text-xs text-white w-32"
                          />
                          <Button variant="primary" size="sm" onClick={() => handleResetPassword(user.id)}>
                            Set
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setResetUserId(null); setResetPassword(''); }}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setResetUserId(user.id)}
                            title="Reset password"
                          >
                            <KeyRound size={14} />
                          </Button>
                          {/* Toggle role */}
                          {user.id !== currentUserId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleRole(user)}
                              title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                            >
                              <Shield size={14} className={user.role === 'admin' ? 'text-csev-green' : ''} />
                            </Button>
                          )}
                          {/* Delete */}
                          {user.id !== currentUserId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user)}
                              className="text-csev-text-muted hover:text-red-400"
                              title="Delete user"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-csev-text-muted mt-4">
          New users will be prompted to change their password on first login.
        </p>
      </div>

      {/* Confirm dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-csev-panel rounded-lg border border-csev-border p-6 max-w-sm w-full mx-4">
            <p className="text-white text-sm mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setConfirmDialog(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDialog.onConfirm}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg border animate-fade-in text-sm font-medium ${
          toast.type === 'success'
            ? 'bg-csev-green/20 border-csev-green/30 text-csev-green'
            : 'bg-red-500/20 border-red-500/30 text-red-400'
        }`}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
