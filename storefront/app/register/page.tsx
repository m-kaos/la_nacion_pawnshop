'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { graphqlClient } from '@/lib/graphql-client';
import { REGISTER_CUSTOMER } from '@/lib/auth-queries';
import { saveFormData, getFormData, clearFormData } from '@/lib/form-storage';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Load saved form data from login page
  useEffect(() => {
    const savedData = getFormData();
    if (savedData.email || savedData.password) {
      setFormData(prev => ({
        ...prev,
        emailAddress: savedData.email || '',
        password: savedData.password || '',
        firstName: savedData.firstName || '',
        lastName: savedData.lastName || '',
        phoneNumber: savedData.phoneNumber || '',
      }));
    }
  }, []);

  // Save form data as user types
  useEffect(() => {
    saveFormData({
      email: formData.emailAddress,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
    });
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await graphqlClient.mutation(REGISTER_CUSTOMER, {
        input: formData,
      });

      if (result.data?.registerCustomerAccount?.success) {
        setSuccess(true);
        // No email verification needed - redirect to login immediately
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 1500);
      } else if (result.data?.registerCustomerAccount?.errorCode) {
        setError(result.data.registerCustomerAccount.message || 'Registration failed');
        setLoading(false);
      } else {
        setError('Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p>Your account has been created.</p>
            <p className="text-sm mt-2">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="emailAddress" className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                id="emailAddress"
                name="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold mb-2">
                Phone Number (optional)
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
