import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Loader,
  Package,
  MoreVertical
} from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    platform: '',
    country: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, [pagination.page, filters, searchTerm]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };
      
      const response = await api.get('/admin/accounts', { params });
      setAccounts(response.data.data || []);
      setPagination({
        ...pagination,
        total: response.data.total || 0,
        pages: Math.ceil((response.data.total || 0) / pagination.limit)
      });
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!accountToDelete) return;
    
    try {
      await api.delete(`/admin/accounts/${accountToDelete}`);
      fetchAccounts();
      setShowDeleteConfirm(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAccounts.length === 0) return;
    
    try {
      await api.post('/admin/accounts/bulk-delete', { ids: selectedAccounts });
      fetchAccounts();
      setSelectedAccounts([]);
    } catch (error) {
      console.error('Error bulk deleting accounts:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(accounts.map(a => a._id));
    }
  };

  const handleSelectAccount = (id) => {
    if (selectedAccounts.includes(id)) {
      setSelectedAccounts(selectedAccounts.filter(accId => accId !== id));
    } else {
      setSelectedAccounts([...selectedAccounts, id]);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Platform', 'Price', 'Available', 'Country', 'Created At'];
    const csvData = accounts.map(acc => [
      acc._id,
      acc.title,
      acc.platform,
      acc.price,
      acc.available,
      acc.country,
      new Date(acc.createdAt).toLocaleDateString()
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounts_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">Accounts Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
          <button
            onClick={() => navigate('/accounts/create')}
            className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-gray-900 rounded-lg hover:bg-[#B8973C] transition-colors"
          >
            <Plus size={18} />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-[#C9A84C] border-[#C9A84C] text-gray-900' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>

          {/* Bulk Actions */}
          {selectedAccounts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} />
              <span>Delete Selected ({selectedAccounts.length})</span>
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <select
              value={filters.platform}
              onChange={(e) => setFilters({...filters, platform: e.target.value})}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="">All Platforms</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="Twitter/X">Twitter/X</option>
            </select>

            <select
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="">All Countries</option>
              <option value="USA">USA</option>
              <option value="Germany">Germany</option>
              <option value="UK">UK</option>
              <option value="Random">Random</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="">All Status</option>
              <option value="available">In Stock</option>
              <option value="sold">Sold Out</option>
            </select>
          </div>
        )}
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Platform</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Available</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Country</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Badge</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <Loader className="animate-spin mx-auto text-[#C9A84C]" size={32} />
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No accounts found</p>
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account._id)}
                      onChange={() => handleSelectAccount(account._id)}
                      className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{account.title?.substring(0, 40)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={account.platform} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">₦{account.price?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${account.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {account.available}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{account.country}</td>
                  <td className="px-6 py-4">
                    {account.badge && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        account.badge === 'PURE' ? 'bg-purple-50 text-purple-600' :
                        account.badge === 'HOT' ? 'bg-red-50 text-red-600' :
                        account.badge === 'NEW' ? 'bg-green-50 text-green-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {account.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/accounts/edit/${account._id}`)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setAccountToDelete(account._id);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination({...pagination, page: pagination.page - 1})}
              disabled={pagination.page === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 bg-gray-50 rounded-lg text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination({...pagination, page: pagination.page + 1})}
              disabled={pagination.page === pagination.pages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
      />
    </div>
  );
};

export default AccountList;