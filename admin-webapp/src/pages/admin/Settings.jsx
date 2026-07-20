import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Globe, Shield, 
  CreditCard, Bell, Database, Mail, Smartphone,
  Save, CheckCircle
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states (simplified for demo)
  const [general, setGeneral] = useState({
    siteName: 'A-yos Platform',
    supportEmail: 'support@a-yos.com',
    currency: 'USD',
    timezone: 'UTC-05:00 Eastern Time'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'booking', label: 'Booking Rules', icon: <SettingsIcon size={18} /> },
    { id: 'security', label: 'Security & Auth', icon: <Shield size={18} /> },
    { id: 'payments', label: 'Payments & Fees', icon: <CreditCard size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'ai', label: 'AI Matching', icon: <Database size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 mt-1">Configure global application settings and integrations</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={`mr-3 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label} Configuration
            </h2>
            {saveSuccess && (
              <span className="text-sm text-green-600 flex items-center font-medium transition-opacity duration-300">
                <CheckCircle size={16} className="mr-1" /> Settings saved successfully
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="p-6">
            
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                    <input 
                      type="text" 
                      value={general.siteName}
                      onChange={(e) => setGeneral({...general, siteName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <input 
                      type="email" 
                      value={general.supportEmail}
                      onChange={(e) => setGeneral({...general, supportEmail: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                    <select 
                      value={general.currency}
                      onChange={(e) => setGeneral({...general, currency: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Timezone</label>
                    <select 
                      value={general.timezone}
                      onChange={(e) => setGeneral({...general, timezone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>UTC-08:00 Pacific Time</option>
                      <option>UTC-05:00 Eastern Time</option>
                      <option>UTC+00:00 GMT</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Maintenance Mode</h3>
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Enable Maintenance Mode</p>
                      <p className="text-sm text-gray-500 mt-1">Disables customer and worker apps for updates.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Admin Authentication</h3>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Require Two-Factor Auth (2FA)</p>
                    <p className="text-sm text-gray-500">Force all admins to use 2FA via authenticator app.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Session Timeout</p>
                    <p className="text-sm text-gray-500">Automatically logout inactive admins.</p>
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-blue-500 text-sm">
                    <option>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Platform Fees</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Global Commission Rate (%)</label>
                    <input type="number" defaultValue={15} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-xs text-gray-500 mt-1">Percentage deducted from worker payouts.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Booking Fee ($)</label>
                    <input type="number" defaultValue={2.50} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-xs text-gray-500 mt-1">Flat fee added to customer checkout.</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Payout Schedule</h3>
                  <select className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Daily</option>
                    <option>Weekly (Every Monday)</option>
                    <option>Bi-weekly</option>
                    <option>Manual Only</option>
                  </select>
                </div>
              </div>
            )}

            {/* Other tabs would go here, omitting for brevity in demo */}
            {activeTab === 'booking' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Rules</label>
                  <textarea rows={4} defaultValue="Bookings require confirmation within 15 minutes, and cancellations within 2 hours are eligible for refunds." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                  <textarea rows={4} defaultValue="Customers can cancel up to 2 hours before a scheduled service. Same-day cancellations may incur a fee." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Notifications</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500">
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Push Notifications</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500">
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Matching Threshold</label>
                  <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation Strategy</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500">
                    <option>Balanced</option>
                    <option>Speed First</option>
                    <option>Quality First</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branding</label>
                  <textarea rows={4} defaultValue="A-yos Admin • Professional service operations dashboard" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
                </div>
              </div>
            )}

            {(activeTab !== 'general' && activeTab !== 'booking' && activeTab !== 'security' && activeTab !== 'payments' && activeTab !== 'notifications' && activeTab !== 'ai' && activeTab !== 'appearance') && (
              <div className="py-12 text-center text-gray-500">
                <SettingsIcon size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Configuration options for {activeTab} will appear here.</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center disabled:opacity-70"
              >
                {isSaving ? (
                  <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</span>
                ) : (
                  <span className="flex items-center"><Save size={18} className="mr-2" /> Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
