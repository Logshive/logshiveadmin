import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccountForm from '../../components/forms/AccountForm';
import api from '../../services/api';

const AccountCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await api.post('/admin/accounts', data);
      navigate('/accounts');
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold">Create New Account</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new account to the marketplace</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <AccountForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AccountCreate;