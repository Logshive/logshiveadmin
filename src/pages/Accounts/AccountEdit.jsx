import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AccountForm from '../../components/forms/AccountForm';
import api from '../../services/api';
import { Loader } from 'lucide-react';

const AccountEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccount();
  }, [id]);

  const fetchAccount = async () => {
    try {
      const response = await api.get(`/admin/accounts/${id}`);
      setAccount(response.data.data);
    } catch (error) {
      console.error('Error fetching account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      await api.put(`/admin/accounts/${id}`, data);
      navigate('/accounts');
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-[#C9A84C]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold">Edit Account</h1>
        <p className="text-gray-500 text-sm mt-1">Update account information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <AccountForm initialData={account} onSubmit={handleSubmit} isEdit />
      </div>
    </div>
  );
};

export default AccountEdit;