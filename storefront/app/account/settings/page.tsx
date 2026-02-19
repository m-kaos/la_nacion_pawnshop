'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { graphqlClient } from '@/lib/graphql-client';
import { gql } from 'urql';

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      id
      title
      firstName
      lastName
      phoneNumber
    }
  }
`;

const UPDATE_PASSWORD = gql`
  mutation UpdateCustomerPassword($currentPassword: String!, $newPassword: String!) {
    updateCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const REQUEST_EMAIL_UPDATE = gql`
  mutation RequestUpdateCustomerEmailAddress($password: String!, $newEmailAddress: String!) {
    requestUpdateCustomerEmailAddress(password: $password, newEmailAddress: $newEmailAddress) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export default function AccountSettingsPage() {
  const { customer, loading: authLoading, refetchCustomer } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'email'>('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile form
  const [profileData, setProfileData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Email form
  const [emailData, setEmailData] = useState({
    password: '',
    newEmail: '',
  });

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login');
    }
  }, [customer, authLoading, router]);

  useEffect(() => {
    if (customer) {
      setProfileData({
        title: customer.title || '',
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber || '',
      });
    }
  }, [customer]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await graphqlClient.mutation(UPDATE_CUSTOMER, {
        input: profileData,
      });

      await refetchCustomer();
      setSuccess('Perfil actualizado correctamente');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await graphqlClient.mutation(UPDATE_PASSWORD, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.data?.updateCustomerPassword?.success) {
        setSuccess('Contraseña actualizada correctamente');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(result.data?.updateCustomerPassword?.message || 'Error al actualizar la contraseña');
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await graphqlClient.mutation(REQUEST_EMAIL_UPDATE, {
        password: emailData.password,
        newEmailAddress: emailData.newEmail,
      });

      if (result.data?.requestUpdateCustomerEmailAddress?.success) {
        setSuccess('Se ha enviado un correo de verificación a tu nueva dirección');
        setEmailData({
          password: '',
          newEmail: '',
        });
      } else {
        setError(result.data?.requestUpdateCustomerEmailAddress?.message || 'Error al solicitar cambio de email');
      }
    } catch (err: any) {
      setError(err.message || 'Error al solicitar cambio de email');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/account"
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold mb-4 inline-block"
          >
            ← Volver a Mi Cuenta
          </Link>
          <h1 className="text-3xl font-bold">Configuración de Cuenta</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 font-semibold ${
                activeTab === 'profile'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-4 font-semibold ${
                activeTab === 'password'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contraseña
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 px-6 py-4 font-semibold ${
                activeTab === 'email'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email
            </button>
          </div>

          <div className="p-6">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Información Personal</h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">Título (opcional)</label>
                  <select
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Mr">Sr.</option>
                    <option value="Mrs">Sra.</option>
                    <option value="Ms">Srta.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Apellido *</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">Contraseña Actual *</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Nueva Contraseña *</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Confirmar Nueva Contraseña *</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </form>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Cambiar Email</h2>

                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">
                    Email actual: <strong>{customer?.emailAddress}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Contraseña *</label>
                  <input
                    type="password"
                    value={emailData.password}
                    onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Nuevo Email *</label>
                  <input
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-sm">
                  Se enviará un email de verificación a tu nueva dirección. Deberás confirmar el cambio haciendo clic en el
                  enlace del email.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Enviando...' : 'Solicitar Cambio de Email'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
