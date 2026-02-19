'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { saveFormData, getFormData, clearFormData, setRememberMe as saveRememberMe, getRememberMe } from '@/lib/form-storage';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load saved form data and remember me preference
  useEffect(() => {
    const savedData = getFormData();
    const shouldRemember = getRememberMe();

    if (savedData.email) {
      setEmail(savedData.email);
    }
    if (savedData.password && shouldRemember) {
      setPassword(savedData.password);
    }
    setRememberMe(shouldRemember);
  }, []);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowRegisteredMessage(true);
      setTimeout(() => setShowRegisteredMessage(false), 5000);
    }
  }, [searchParams]);

  // Save form data as user types
  useEffect(() => {
    if (email || password) {
      saveFormData({ email, password });
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Save remember me preference
    saveRememberMe(rememberMe);

    console.log('Login page: submitting form');
    const result = await login(email, password, rememberMe);
    console.log('Login page: result received', result);

    if (result.success) {
      console.log('Login page: redirecting to /account');

      // Clear password if not remembering
      if (!rememberMe) {
        clearFormData();
      }

      // Small delay to ensure auth state is updated before redirect
      setTimeout(() => {
        window.location.href = '/account';
        console.log('Login page: redirect initiated');
      }, 100);
    } else {
      console.log('Login page: login failed', result.error);
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          {showRegisteredMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              Account created successfully! You can now login.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-primary-600"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
