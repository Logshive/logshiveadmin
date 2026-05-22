import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Shield, 
  Mail, 
  Bell, 
  Globe, 
  CreditCard,
  Users,
  Package,
  RefreshCw,
  Lock,
  Server
} from 'lucide-react';
import { settingsService } from '../services/settingsService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  const newValue = type === 'checkbox' ? checked : value;

  // Support nested fields like "payment.korapaySecretKey"
  if (name.includes('.')) {
    const keys = name.split('.');
    setSettings(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = newValue;
      return updated;
    });
  } else {
    setSettings(prev => ({ ...prev, [name]: newValue }));
  }
};

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      // Optionally show success message
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'accounts', label: 'Accounts', icon: Package },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-[#C9A84C]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your platform settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#C9A84C] text-[#C9A84C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    name="siteDescription"
                    rows={3}
                    value={settings.siteDescription || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="twoFactorEnabled"
                      checked={settings.twoFactorEnabled || false}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                  </div>
                  <select
                    name="sessionTimeout"
                    value={settings.sessionTimeout || '30 minutes'}
                    onChange={handleChange}
                    className="px-3 py-1 border border-gray-200 rounded-lg"
                  >
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Account Badge
                  </label>
                  <select
                    name="defaultBadge"
                    value={settings.defaultBadge || 'BASIC'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option>BASIC</option>
                    <option>PURE</option>
                    <option>NEW</option>
                    <option>HOT</option>
                    <option>DATING</option>
                    <option>AGED</option>
                    <option>PREMIUM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Price (₦)
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={settings.minPrice || 1000}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-approve Accounts
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="autoApproveAccounts"
                        value="true"
                        checked={settings.autoApproveAccounts === true}
                        onChange={() => setSettings(prev => ({ ...prev, autoApproveAccounts: true }))}
                        className="text-[#C9A84C]"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="autoApproveAccounts"
                        value="false"
                        checked={settings.autoApproveAccounts === false}
                        onChange={() => setSettings(prev => ({ ...prev, autoApproveAccounts: false }))}
                        className="text-[#C9A84C]"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
  <div className="space-y-6">
    <h3 className="text-lg font-serif font-bold mb-4">Payment Settings (Korapay)</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Korapay Public Key
        </label>
        <input
          type="text"
          name="payment.korapayPublicKey"
          value={settings.payment?.korapayPublicKey || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          placeholder="pk_test_..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Korapay Secret Key
        </label>
        <input
          type="password"
          name="payment.korapaySecretKey"
          value={settings.payment?.korapaySecretKey || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          placeholder="sk_test_..."
        />
      </div>
      <p className="text-xs text-gray-500">
        You can find your API keys in your Korapay dashboard.
      </p>
    </div>
  </div>
)}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold mb-4">Email Settings (SMTP)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={settings.smtpHost || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Port
                    </label>
                    <input
                      type="number"
                      name="smtpPort"
                      value={settings.smtpPort || 587}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security
                    </label>
                    <select
                      name="smtpSecure"
                      value={settings.smtpSecure ? 'true' : 'false'}
                      onChange={(e) => setSettings(prev => ({ ...prev, smtpSecure: e.target.value === 'true' }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="false">TLS (587)</option>
                      <option value="true">SSL (465)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="smtpUser"
                    value={settings.smtpUser || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="smtpPass"
                    value={settings.smtpPass || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    name="smtpFromEmail"
                    value={settings.smtpFromEmail || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="noreply@logsplace.com"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold mb-4">User Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Allow Registration</p>
                    <p className="text-sm text-gray-500">Enable new users to sign up</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowRegistration"
                      checked={settings.allowRegistration !== false}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default User Role
                  </label>
                  <select
                    name="defaultUserRole"
                    value={settings.defaultUserRole || 'user'}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive email alerts for new orders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={settings.emailNotifications || false}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#C9A84C] text-gray-900 rounded-lg hover:bg-[#B8973C] transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;