'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { graphqlClient } from '@/lib/graphql-client';
import { gql } from 'urql';

const GET_CUSTOMER_ADDRESSES = gql`
  query GetCustomerAddresses {
    activeCustomer {
      id
      addresses {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
          id
          code
          name
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
      }
    }
  }
`;

const CREATE_CUSTOMER_ADDRESS = gql`
  mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      id
      fullName
      streetLine1
      city
    }
  }
`;

const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
      id
      fullName
      streetLine1
      city
    }
  }
`;

const DELETE_CUSTOMER_ADDRESS = gql`
  mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      success
      message
    }
  }
`;

interface Address {
  id: string;
  fullName?: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: {
    id: string;
    code: string;
    name: string;
  };
  phoneNumber?: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
}

export default function AddressesPage() {
  const { customer, loading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    province: '',
    postalCode: '',
    countryCode: 'US',
    phoneNumber: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login');
    }
  }, [customer, authLoading, router]);

  useEffect(() => {
    if (customer) {
      fetchAddresses();
    }
  }, [customer]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const result = await graphqlClient.query(GET_CUSTOMER_ADDRESSES, {});
      if (result.data?.activeCustomer?.addresses) {
        setAddresses(result.data.activeCustomer.addresses);
      }
    } catch (err: any) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingAddress) {
        await graphqlClient.mutation(UPDATE_CUSTOMER_ADDRESS, {
          input: {
            id: editingAddress.id,
            ...formData,
          },
        });
      } else {
        await graphqlClient.mutation(CREATE_CUSTOMER_ADDRESS, {
          input: formData,
        });
      }

      setShowForm(false);
      setEditingAddress(null);
      resetForm();
      await fetchAddresses();
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName || '',
      company: address.company || '',
      streetLine1: address.streetLine1,
      streetLine2: address.streetLine2 || '',
      city: address.city,
      province: address.province || '',
      postalCode: address.postalCode,
      countryCode: address.country.code,
      phoneNumber: address.phoneNumber || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      return;
    }

    try {
      await graphqlClient.mutation(DELETE_CUSTOMER_ADDRESS, { id });
      await fetchAddresses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete address');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      company: '',
      streetLine1: '',
      streetLine2: '',
      city: '',
      province: '',
      postalCode: '',
      countryCode: 'US',
      phoneNumber: '',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    resetForm();
    setError('');
  };

  if (authLoading || loading) {
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Mis Direcciones</h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                + Agregar Dirección
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Empresa (opcional)</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Dirección *</label>
                <input
                  type="text"
                  value={formData.streetLine1}
                  onChange={(e) => setFormData({ ...formData, streetLine1: e.target.value })}
                  required
                  placeholder="Calle y número"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Dirección 2 (opcional)</label>
                <input
                  type="text"
                  value={formData.streetLine2}
                  onChange={(e) => setFormData({ ...formData, streetLine2: e.target.value })}
                  placeholder="Apartamento, suite, etc."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Ciudad *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Estado/Provincia</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Código Postal *</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">País *</label>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="US">Estados Unidos</option>
                    <option value="MX">México</option>
                    <option value="ES">España</option>
                    <option value="AR">Argentina</option>
                    <option value="CO">Colombia</option>
                    <option value="CL">Chile</option>
                    <option value="PE">Perú</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  {editingAddress ? 'Actualizar Dirección' : 'Guardar Dirección'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {!showForm && addresses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Agregar tu primera dirección →
            </button>
          </div>
        )}

        {!showForm && addresses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow-md p-6 relative">
                {(address.defaultShippingAddress || address.defaultBillingAddress) && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    {address.defaultShippingAddress && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                        Envío
                      </span>
                    )}
                    {address.defaultBillingAddress && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                        Facturación
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-1 mb-4">
                  {address.fullName && <p className="font-semibold">{address.fullName}</p>}
                  {address.company && <p className="text-sm text-gray-600">{address.company}</p>}
                  <p className="text-sm">{address.streetLine1}</p>
                  {address.streetLine2 && <p className="text-sm">{address.streetLine2}</p>}
                  <p className="text-sm">
                    {address.city}
                    {address.province && `, ${address.province}`} {address.postalCode}
                  </p>
                  <p className="text-sm">{address.country.name}</p>
                  {address.phoneNumber && <p className="text-sm text-gray-600">{address.phoneNumber}</p>}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
