import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AccountForm = ({ initialData = {}, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    price: initialData.price || '',
    available: initialData.available || 0,
    country: initialData.country || 'Random',
    platform: initialData.platform || 'Facebook',
    friendRange: initialData.friendRange || '',
    yearRange: initialData.yearRange || '',
    features: initialData.features || [],
    badge: initialData.badge || 'BASIC',
    ...initialData
  });
  const [feature, setFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Items management
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newItem, setNewItem] = useState({ email: '', password: '' });
  const [bulkText, setBulkText] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState({}); // per item ID

  const navigate = useNavigate();

  const platforms = [
    'Facebook', 'Instagram', 'TikTok', 'Twitter/X', 
    'Dating Accounts', 'BM & Ads', 'Fanpages', 'Email Accounts'
  ];

  const countries = [
    'Random', 'USA', 'Germany', 'UK', 'Canada', 
    'Indonesia', 'Philippines', 'Brazil', 'India'
  ];

  const badges = ['PURE', 'BASIC', 'NEW', 'HOT', 'DATING', 'AGED', 'PREMIUM'];

  // Fetch items when editing
  useEffect(() => {
    if (isEdit && initialData._id) {
      fetchItems();
    }
  }, [isEdit, initialData._id]);

  const fetchItems = async () => {
    setItemsLoading(true);
    try {
      const res = await api.get(`/admin/accounts/${initialData._id}/items`);
      setItems(res.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setItemsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await onSubmit(formData);
      // After create, redirect to edit page if we want to add items
      // But if onSubmit handles navigation (like in AccountCreate), it will navigate away.
      // We'll handle navigation in the parent component.
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (feature.trim() && !formData.features.includes(feature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, feature.trim()]
      });
      setFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  // Items handlers
  const handleAddSingleItem = async () => {
    if (!newItem.email || !newItem.password) return;
    try {
      await api.post(`/admin/accounts/${initialData._id}/items`, {
        items: [{ credentials: newItem }]
      });
      setNewItem({ email: '', password: '' });
      setShowAddItemModal(false);
      fetchItems(); // refresh list
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleBulkAdd = async () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    const items = lines.map(line => {
      const [email, password] = line.split(':').map(s => s.trim());
      return { credentials: { email, password } };
    }).filter(item => item.credentials.email && item.credentials.password);
    if (items.length === 0) return;
    try {
      await api.post(`/admin/accounts/${initialData._id}/items`, { items });
      setBulkText('');
      setShowBulkModal(false);
      fetchItems();
    } catch (error) {
      console.error('Error bulk adding items:', error);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/admin/accounts/items/${itemToDelete}`);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const togglePasswordVisibility = (itemId) => {
    setShowPassword(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main account fields (same as before) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C9A84C] ${
            errors.title ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="e.g., USA Facebook Account with 1000 friends"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C9A84C] ${
            errors.description ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="Detailed description of the account..."
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₦) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C9A84C] ${
              errors.price ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="5000"
            min="0"
          />
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Quantity
          </label>
          <input
            type="number"
            value={formData.available}
            disabled
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Automatically updated based on items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({...formData, platform: e.target.value})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C9A84C] ${
              errors.platform ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.platform && <p className="mt-1 text-xs text-red-500">{errors.platform}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C9A84C] ${
              errors.country ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Friend Range</label>
          <input
            type="text"
            value={formData.friendRange}
            onChange={(e) => setFormData({...formData, friendRange: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            placeholder="e.g., 30-1k"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year Range</label>
          <input
            type="text"
            value={formData.yearRange}
            onChange={(e) => setFormData({...formData, yearRange: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            placeholder="e.g., 2009-2022"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
        <select
          value={formData.badge}
          onChange={(e) => setFormData({...formData, badge: e.target.value})}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
        >
          {badges.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            placeholder="Add a feature..."
          />
          <button type="button" onClick={addFeature} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feat, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
              {feat}
              <button type="button" onClick={() => removeFeature(index)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Items Section (only visible when editing) */}
      {isEdit && initialData._id && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Account Items ({items.length} total, {formData.available} available)</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddItemModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-gray-900 rounded-lg hover:bg-[#B8973C]"
              >
                <Plus size={16} /> Add Item
              </button>
              <button
                type="button"
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Upload size={16} /> Bulk Upload
              </button>
            </div>
          </div>

          {itemsLoading ? (
            <div className="text-center py-8">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border rounded-lg">
              No items added yet. Add credentials for this account.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Password</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map(item => (
                    <tr key={item._id}>
                      <td className="px-4 py-2 text-sm">{item.credentials.email}</td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{showPassword[item._id] ? item.credentials.password : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(item._id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showPassword[item._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'available' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            setItemToDelete(item._id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                          disabled={item.status === 'sold'} // optionally disable delete for sold items
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => navigate('/accounts')}
          className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-[#C9A84C] text-gray-900 rounded-lg hover:bg-[#B8973C] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          <span>{loading ? 'Saving...' : isEdit ? 'Update Account' : 'Create Account'}</span>
        </button>
      </div>

      {/* Add Single Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Account Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newItem.email}
                  onChange={(e) => setNewItem({...newItem, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="text"
                  value={newItem.password}
                  onChange={(e) => setNewItem({...newItem, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSingleItem}
                className="px-4 py-2 bg-[#C9A84C] text-gray-900 rounded-lg hover:bg-[#B8973C]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium mb-4">Bulk Upload Items</h3>
            <p className="text-sm text-gray-500 mb-2">Enter one item per line in format: email:password</p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm"
              placeholder="user1@example.com:pass123&#10;user2@example.com:secret456"
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAdd}
                className="px-4 py-2 bg-[#C9A84C] text-gray-900 rounded-lg hover:bg-[#B8973C]"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteItem}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
      />
    </form>
  );
};

export default AccountForm;