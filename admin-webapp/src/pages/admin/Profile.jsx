import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Shield, Key,
  Camera, CheckCircle, Clock, Monitor, Smartphone
} from 'lucide-react';

import { useToast } from '../../context/ToastContext';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const [profile, setProfile] = useState({
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@a-yos.com',
    phone: '+1 (555) 123-4567',
    role: 'Super Administrator',
    location: 'New York, USA',
    bio: 'Lead system administrator for the A-yos platform. Responsible for overall system health, security, and high-level operations.',
    joined: 'Jan 15, 2024'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile Updated', 'Your profile information has been saved successfully.');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and security preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl mx-auto border-4 border-white shadow-sm">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm text-gray-500 hover:text-blue-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-blue-600 font-medium text-sm mt-1">{profile.role}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm text-left">
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-3 text-gray-400" /> {profile.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="mr-3 text-gray-400" /> {profile.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-3 text-gray-400" /> {profile.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-3 text-gray-400" /> Joined {profile.joined}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Shield size={18} className="mr-2 text-blue-500" /> Security
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Password</p>
                <p className="text-xs text-gray-500 mb-2">Last changed 45 days ago</p>
                <button className="w-full text-sm bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-green-600 font-medium mb-2 flex items-center mt-1">
                  <CheckCircle size={12} className="mr-1" /> Enabled via Authenticator
                </p>
                <button className="w-full text-sm bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Manage 2FA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input 
                        type="text" 
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input 
                        type="text" 
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea 
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 resize-none" 
                      ></textarea>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-sm font-medium text-gray-500">First Name</p>
                      <p className="mt-1 text-base text-gray-900">{profile.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Name</p>
                      <p className="mt-1 text-base text-gray-900">{profile.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="mt-1 text-base text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="mt-1 text-base text-gray-900">{profile.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="mt-1 text-base text-gray-900">{profile.location}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Bio</p>
                      <p className="mt-1 text-base text-gray-900 leading-relaxed">{profile.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Active Sessions */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Active Sessions</h2>
              <p className="text-sm text-gray-500 mt-1">Devices currently logged into your account</p>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                    <Monitor size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">MacBook Pro - Chrome</p>
                    <p className="text-xs text-gray-500">New York, USA • 192.168.1.1</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Current Session
                </span>
              </div>
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mr-4">
                    <Smartphone size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">iPhone 13 - Safari</p>
                    <p className="text-xs text-gray-500">New York, USA • 192.168.1.45</p>
                  </div>
                </div>
                <button className="text-sm text-red-600 font-medium hover:underline">Revoke</button>
              </div>
            </div>
          </div>

          {/* Login History */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Login History</h2>
                <p className="text-sm text-gray-500 mt-1">Recent authentication activity</p>
              </div>
              <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location & IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm">
                <tr>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-900 font-medium">Today, 09:41 AM</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-500">New York, USA • 192.168.1.1</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-500">MacBook Pro (Chrome)</td>
                  <td className="px-6 py-3 whitespace-nowrap text-right"><span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-0.5 rounded">Success</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-900 font-medium">Yesterday, 04:20 PM</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-500">New York, USA • 192.168.1.45</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-500">iPhone 13 (Safari)</td>
                  <td className="px-6 py-3 whitespace-nowrap text-right"><span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-0.5 rounded">Success</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-900 font-medium">Oct 12, 11:05 AM</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-500">Unknown • 10.0.0.99</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-500">Windows PC (Firefox)</td>
                  <td className="px-6 py-3 whitespace-nowrap text-right"><span className="text-red-600 font-medium text-xs bg-red-50 px-2 py-0.5 rounded">Failed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
