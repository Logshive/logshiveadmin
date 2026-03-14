import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';

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
      await onSubmit(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
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
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
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
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Price and Availability */}
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
          {errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Quantity
          </label>
          <input
            type="number"
            value={formData.available}
            onChange={(e) => setFormData({...formData, available: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            placeholder="10"
            min="0"
          />
        </div>
      </div>

      {/* Platform and Country */}
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
            {platforms.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.platform && (
            <p className="mt-1 text-xs text-red-500">{errors.platform}</p>
          )}
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
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-xs text-red-500">{errors.country}</p>
          )}
        </div>
      </div>

      {/* Friend Range and Year Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Friend Range
          </label>
          <input
            type="text"
            value={formData.friendRange}
            onChange={(e) => setFormData({...formData, friendRange: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            placeholder="e.g., 30-1k"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Range
          </label>
          <input
            type="text"
            value={formData.yearRange}
            onChange={(e) => setFormData({...formData, yearRange: e.target.value})}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            placeholder="e.g., 2009-2022"
          />
        </div>
      </div>

      {/* Badge */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Badge
        </label>
        <select
          value={formData.badge}
          onChange={(e) => setFormData({...formData, badge: e.target.value})}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
        >
          {badges.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            placeholder="Add a feature..."
          />
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feat, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {feat}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

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
    </form>
  );
};

export default AccountForm;