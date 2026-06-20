'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  
  // Modals / Details states
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [trackOrderID, setTrackOrderID] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  // Premium Dialog Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Notification');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogConfirmCallback, setDialogConfirmCallback] = useState(null);
  const [dialogType, setDialogType] = useState('info'); // 'success' | 'danger' | 'warning' | 'info'

  const showModalAlert = (message, title = 'Notification', type = 'info') => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogConfirmCallback(null);
    setDialogType(type);
    setDialogOpen(true);
  };

  const showModalConfirm = (message, onConfirm, title = 'Confirmation Required', type = 'warning') => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogConfirmCallback(() => onConfirm);
    setDialogType(type);
    setDialogOpen(true);
  };

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    avatar: ''
  });

  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    customerName: '',
    phone: '',
    district: 'Dhaka',
    shippingAddress: '',
    isDefault: false
  });

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: ''
  });

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  // Load auth details on mount
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      window.location.href = '/login?redirect=/account';
      return;
    }
    setToken(userToken);
    
    // Set initial profile name from localStorage
    const storedName = localStorage.getItem('userName') || 'Customer';
    const storedEmail = localStorage.getItem('userEmail') || '';
    setProfileForm(prev => ({
      ...prev,
      name: storedName,
      email: storedEmail
    }));
  }, []);

  // Fetch profile and orders when token is ready
  useEffect(() => {
    if (!token) return;
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    
    async function loadAccountData() {
      try {
        setLoading(true);
        // 1. Fetch user profile detail
        const profileRes = await fetch(`${apiUrl}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
          setProfileForm({
            name: localStorage.getItem('userName') || 'Customer',
            phone: profileData.phone || '',
            dob: profileData.dob || '',
            gender: profileData.gender || '',
            avatar: profileData.avatar || ''
          });
        }

        // 2. Fetch customer order history
        const ordersRes = await fetch(`${apiUrl}/api/orders/my-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (error) {
        console.error('Failed to load user account portal data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, [token]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userUID');
    window.location.href = '/';
  };

  // Profile Update Form Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        localStorage.setItem('userName', profileForm.name);
        showModalAlert('Profile updated successfully!', 'Success', 'success');
      } else {
        showModalAlert('Failed to update profile.', 'Error', 'danger');
      }
    } catch (error) {
      console.error(error);
      showModalAlert('Failed to update profile due to connection error.', 'Error', 'danger');
    }
  };

  // Add or Edit Address
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const payload = editingAddress ? { ...addressForm, id: editingAddress } : addressForm;
      
      const res = await fetch(`${apiUrl}/api/user/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({
          label: 'Home',
          customerName: '',
          phone: '',
          district: 'Dhaka',
          shippingAddress: '',
          isDefault: false
        });
        showModalAlert('Address saved successfully!', 'Success', 'success');
      } else {
        showModalAlert('Failed to save address.', 'Error', 'danger');
      }
    } catch (error) {
      console.error(error);
      showModalAlert('Failed to save address due to connection error.', 'Error', 'danger');
    }
  };

  // Delete Address
  const deleteAddress = (addrId) => {
    showModalConfirm('Are you sure you want to delete this address?', async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/user/addresses/${addrId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const updatedProfile = await res.json();
          setProfile(updatedProfile);
          showModalAlert('Address deleted successfully!', 'Success', 'success');
        } else {
          showModalAlert('Failed to delete address.', 'Error', 'danger');
        }
      } catch (error) {
        console.error(error);
        showModalAlert('Failed to delete address due to connection error.', 'Error', 'danger');
      }
    }, 'Delete Address', 'danger');
  };

  // Toggle Wishlist item
  const toggleWishlist = async (productId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/user/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Create Support Ticket
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/user/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ticketForm)
      });
      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setShowTicketForm(false);
        setTicketForm({ subject: '', description: '' });
        showModalAlert('Support Ticket opened successfully! Our team will contact you soon.', 'Success', 'success');
      } else {
        showModalAlert('Failed to submit support ticket.', 'Error', 'danger');
      }
    } catch (error) {
      console.error(error);
      showModalAlert('Connection error, failed to submit ticket.', 'Error', 'danger');
    }
  };

  // Cancel order (status PATCH to Cancelled)
  const cancelOrder = (orderID, mongoID) => {
    showModalConfirm('Are you sure you want to cancel this order?', async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/orders/${mongoID}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'Cancelled' })
        });
        if (res.ok) {
          showModalAlert('Order Cancelled successfully!', 'Success', 'success');
          // Refresh orders list
          const ordersRes = await fetch(`${apiUrl}/api/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (ordersRes.ok) {
            setOrders(await ordersRes.json());
          }
        } else {
          showModalAlert('Unable to cancel this order. Please contact support.', 'Error', 'danger');
        }
      } catch (error) {
        console.error(error);
        showModalAlert('Connection error, failed to cancel order.', 'Error', 'danger');
      }
    }, 'Cancel Order', 'danger');
  };

  // Submit Review Form
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    showModalAlert('Thank you for rating our product! Your review has been submitted successfully.', 'Success', 'success');
    setShowReviewForm(false);
    setReviewProduct(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  // Track specific order
  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackOrderID.trim()) return;
    try {
      setTrackingResult(null);
      setTrackingError('');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/orders/track/${trackOrderID.trim()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setTrackingResult(data[0]);
        } else {
          setTrackingError('No order found matching this tracking ID.');
        }
      } else {
        setTrackingError('Order not found. Check ID format (e.g. AM-XXXXX).');
      }
    } catch (error) {
      setTrackingError('Failed to fetch tracking updates.');
    }
  };

  // Toggles notifications channels
  const toggleNotificationChannel = async (channel, val) => {
    try {
      const settings = {
        email: channel === 'email' ? val : profile?.notificationSettings?.email,
        sms: channel === 'sms' ? val : profile?.notificationSettings?.sms,
        push: channel === 'push' ? val : profile?.notificationSettings?.push
      };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/user/notifications/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setProfile(await res.json());
      }
    } catch (error) {}
  };

  // Copy wishlist link to clipboard
  const shareWishlist = () => {
    navigator.clipboard.writeText(`${window.location.origin}/shop?wishlist=${profile?.customerUID}`);
    showModalAlert('Wishlist share link copied to clipboard!', 'Success', 'success');
  };

  // Tab items array
  const TABS = [
    { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'Profile', icon: '👤', label: 'Profile' },
    { id: 'Orders', icon: '🛍️', label: 'Orders' },
    { id: 'Track Order', icon: '🚚', label: 'Track Order' },
    { id: 'Wishlist', icon: '❤️', label: 'Wishlist' },
    { id: 'Addresses', icon: '📍', label: 'Addresses' },
    { id: 'Payments', icon: '💳', label: 'Payments' },
    { id: 'Reviews', icon: '⭐', label: 'Reviews' },
    { id: 'Coupons & Rewards', icon: '🎟️', label: 'Coupons' },
    { id: 'Returns & Refunds', icon: '🔄', label: 'Returns' },
    { id: 'Notifications', icon: '🔔', label: 'Notifications' },
    { id: 'Support', icon: '💬', label: 'Support' },
    { id: 'Security', icon: '🔒', label: 'Security' }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
        Loading account details...
      </div>
    );
  }

  // Count order status types
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  return (
    <section className="section-padding" style={{ minHeight: '85vh', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--primary)', fontWeight: '800' }}>My Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage your profiles, order logs, wishlists, and wallet settings.</p>
        </div>

        <div className="account-container">
          
          {/* Navigation Sidebar */}
          <aside className="account-sidebar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`account-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'Track Order') {
                    setTrackingResult(null);
                    setTrackingError('');
                  }
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
            <button
              className="account-tab-btn"
              onClick={handleLogout}
              style={{ color: '#e62c2c', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '1rem' }}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </aside>

          {/* Active Tab Panel Content */}
          <main className="account-content">
            
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'Dashboard' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>👋</span>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)', fontWeight: '800' }}>
                      Welcome Back, {profileForm.name || 'Customer'}!
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Here is a quick summary of your account activity.</p>
                  </div>
                </div>

                <div className="account-stats-grid">
                  <div className="account-stat-card">
                    <span className="account-stat-icon">🛍️</span>
                    <div className="account-stat-info">
                      <span className="account-stat-val">{orders.length}</span>
                      <span className="account-stat-lbl">Total Orders</span>
                    </div>
                  </div>
                  <div className="account-stat-card">
                    <span className="account-stat-icon">⏳</span>
                    <div className="account-stat-info">
                      <span className="account-stat-val">{pendingOrdersCount}</span>
                      <span className="account-stat-lbl">Pending</span>
                    </div>
                  </div>
                  <div className="account-stat-card">
                    <span className="account-stat-icon">✅</span>
                    <div className="account-stat-info">
                      <span className="account-stat-val">{completedOrdersCount}</span>
                      <span className="account-stat-lbl">Completed</span>
                    </div>
                  </div>
                  <div className="account-stat-card">
                    <span className="account-stat-icon">❤️</span>
                    <div className="account-stat-info">
                      <span className="account-stat-val">{profile?.wishlist?.length || 0}</span>
                      <span className="account-stat-lbl">Wishlist</span>
                    </div>
                  </div>
                  <div className="account-stat-card">
                    <span className="account-stat-icon">💰</span>
                    <div className="account-stat-info">
                      <span className="account-stat-val">{profile?.loyaltyPoints || 150}</span>
                      <span className="account-stat-lbl">Loyalty Points</span>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Primary Shipping Location</h3>
                    {profile?.addresses?.find(a => a.isDefault) ? (
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{profile.addresses.find(a => a.isDefault).customerName}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                          {profile.addresses.find(a => a.isDefault).shippingAddress}, {profile.addresses.find(a => a.isDefault).district}
                        </p>
                        <p style={{ fontSize: '0.85rem' }}>📞 {profile.addresses.find(a => a.isDefault).phone}</p>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No shipping address saved yet.</p>
                    )}
                    <button className="btn btn-outline" onClick={() => setActiveTab('Addresses')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginTop: '1.25rem' }}>
                      Manage Addresses
                    </button>
                  </div>

                  <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Recent Order Status</h3>
                    {orders.length > 0 ? (
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>Order ID: {orders[0].orderID}</p>
                        <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>Placed: {new Date(orders[0].createdAt).toLocaleDateString()}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Status:</span>
                          <span className={`ticket-badge ${orders[0].orderStatus === 'Delivered' ? 'resolved' : 'open'}`}>
                            {orders[0].orderStatus}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No orders placed yet.</p>
                    )}
                    <button className="btn btn-primary" onClick={() => setActiveTab('Orders')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginTop: '1.25rem' }}>
                      View Order Logs
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PERSONAL INFORMATION */}
            {activeTab === 'Profile' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Profile Information</h2>
                
                {/* Avatar Display */}
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar-container">
                    {profileForm.avatar ? (
                      <img src={profileForm.avatar} alt="Avatar profile" />
                    ) : (
                      <span>👤</span>
                    )}
                    <div className="avatar-upload-overlay" onClick={() => {
                      const url = prompt('Enter image URL for avatar:', profileForm.avatar);
                      if (url !== null) {
                        setProfileForm(prev => ({ ...prev, avatar: url }));
                      }
                    }}>
                      Change
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click photo circle to insert dynamic image URL</span>
                </div>

                <form onSubmit={handleProfileSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Read-only)</label>
                    <input
                      type="email"
                      className="form-input"
                      value={profileForm.email || ''}
                      disabled
                      style={{ backgroundColor: 'var(--bg-main)', cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 01740414134"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-input"
                        value={profileForm.dob}
                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-input"
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem', padding: '0.75rem 2rem' }}>
                    Save Changes
                  </button>
                </form>

                {/* Password reset link */}
                <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#e62c2c' }}>Account Security Actions</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    Need to change your credentials? Trigger a password reset link to your registered email address.
                  </p>
                   <button 
                    onClick={() => {
                      showModalAlert('A password reset link has been dispatched to: ' + profileForm.email + '. Check your spam directory if not received.', 'Dispatched', 'success');
                    }} 
                    className="btn btn-outline" 
                    style={{ color: '#e62c2c', borderColor: '#e62c2c' }}
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            )}

            {/* 3. ORDER HISTORY */}
            {activeTab === 'Orders' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Records</h2>
                
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
                    <Link href="/shop" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--primary)' }}>
                          <th style={{ padding: '0.75rem' }}>ID</th>
                          <th style={{ padding: '0.75rem' }}>Date</th>
                          <th style={{ padding: '0.75rem' }}>Items</th>
                          <th style={{ padding: '0.75rem' }}>Total</th>
                          <th style={{ padding: '0.75rem' }}>Status</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{order.orderID}</td>
                            <td style={{ padding: '0.75rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '0.75rem' }}>
                              {order.productTitle} ({order.variant}) x {order.quantity}
                            </td>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>৳{order.totalAmount}</td>
                            <td style={{ padding: '0.75rem' }}>
                              <span className={`ticket-badge ${
                                order.orderStatus === 'Delivered' ? 'resolved' : 
                                order.orderStatus === 'Cancelled' ? 'open' : ''
                              }`} style={{ 
                                backgroundColor: order.orderStatus === 'Cancelled' ? '#f8d7da' : undefined,
                                color: order.orderStatus === 'Cancelled' ? '#721c24' : undefined 
                              }}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                              <button onClick={() => setSelectedInvoice(order)} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                                Invoice
                              </button>
                              
                              <Link href={`/product/${order.product?.slug || 'combo'}`} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', display: 'inline-block' }}>
                                Reorder
                              </Link>

                              {['Pending', 'Confirmed'].includes(order.orderStatus) && (
                                <button onClick={() => cancelOrder(order.orderID, order._id)} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#e62c2c', borderColor: '#e62c2c' }}>
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. TRACK ORDER */}
            {activeTab === 'Track Order' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Visual Shipment Tracker</h2>
                <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', maxWidth: '500px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter Tracking ID (e.g. AM-XXXXX)"
                    value={trackOrderID}
                    onChange={(e) => setTrackOrderID(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Track Order
                  </button>
                </form>

                {trackingError && (
                  <p style={{ color: '#e62c2c', fontSize: '0.95rem' }}>⚠️ {trackingError}</p>
                )}

                {trackingResult && (
                  <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: 'var(--bg-main)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>ID: {trackingResult.orderID}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Est. Arrival: Within 48-72 Hours</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="ticket-badge resolved" style={{ fontSize: '0.9rem' }}>{trackingResult.orderStatus}</span>
                      </div>
                    </div>

                    {/* Progress tracker timeline */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '2rem', marginBottom: '1rem' }}>
                      <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '3px', backgroundColor: 'var(--border-color)', zIndex: 1 }}></div>
                      
                      {/* Timeline steps */}
                      {[
                        { label: 'Pending', icon: '📝', status: 'Pending' },
                        { label: 'Confirmed', icon: '👍', status: 'Confirmed' },
                        { label: 'Shipped', icon: '🚚', status: 'Shipped' },
                        { label: 'Delivered', icon: '🎁', status: 'Delivered' }
                      ].map((step, idx) => {
                        const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
                        const currentIdx = statuses.indexOf(trackingResult.orderStatus);
                        const stepIdx = statuses.indexOf(step.status);
                        const isCompleted = stepIdx <= currentIdx && trackingResult.orderStatus !== 'Cancelled';

                        return (
                          <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative', width: '20%' }}>
                            <div style={{ 
                              width: '2.25rem', 
                              height: '2.25rem', 
                              borderRadius: '50%', 
                              backgroundColor: isCompleted ? 'var(--primary)' : '#ffffff', 
                              color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                              border: '2px solid var(--border-color)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1rem'
                            }}>
                              {step.icon}
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.5rem', color: isCompleted ? 'var(--primary)' : 'var(--text-muted)' }}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. WISHLIST */}
            {activeTab === 'Wishlist' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>My Favorites Wishlist</h2>
                  {profile?.wishlist?.length > 0 && (
                    <button onClick={shareWishlist} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Share Wishlist Link 🔗
                    </button>
                  )}
                </div>

                {!profile?.wishlist || profile.wishlist.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Your wishlist is currently empty.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    {profile.wishlist.map(product => (
                      <div key={product._id} style={{ border: '1px solid var(--border-color)', borderRadius: '1rem', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>
                        <div style={{ aspectRatio: '1/1', position: 'relative', backgroundColor: 'var(--secondary)' }}>
                          <img src={product.images[0] || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300'} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            onClick={() => toggleWishlist(product._id)} 
                            style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: '#ffffff', border: 'none', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                            title="Remove from favorites"
                          >
                            ❌
                          </button>
                        </div>
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', height: '2.5rem', overflow: 'hidden' }}>{product.title}</h4>
                          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>৳{product.pricePerKg || product.price_per_kg || product.basePrice}</span>
                          <Link href={`/product/${product.slug}`} className="btn btn-primary" style={{ padding: '0.4rem', fontSize: '0.8rem', textAlign: 'center', display: 'block', marginTop: '0.5rem' }}>
                            View Product
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. ADDRESS BOOK */}
            {activeTab === 'Addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Address Book</h2>
                  {!showAddressForm && (
                    <button onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({ label: 'Home', customerName: '', phone: '', district: 'Dhaka', shippingAddress: '', isDefault: false });
                      setShowAddressForm(true);
                    }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Add New Address
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddressSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="grid grid-2" style={{ gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Address Type Label</label>
                        <select
                          className="form-input"
                          value={addressForm.label}
                          onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Billing">Billing</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Customer Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={addressForm.customerName}
                          onChange={(e) => setAddressForm({ ...addressForm, customerName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-2" style={{ gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">District</label>
                        <select
                          className="form-input"
                          value={addressForm.district}
                          onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barisal">Barisal</option>
                          <option value="Rangpur">Rangpur</option>
                          <option value="Mymensingh">Mymensingh</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Detailed Street Address</label>
                      <textarea
                        className="form-input"
                        rows="3"
                        value={addressForm.shippingAddress}
                        onChange={(e) => setAddressForm({ ...addressForm, shippingAddress: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      />
                      <label htmlFor="isDefault" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Set as default shipping address</label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                        Save Address
                      </button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-outline" style={{ padding: '0.6rem 1.5rem' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="address-grid">
                    {profile?.addresses?.map(addr => (
                      <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                        {addr.isDefault && <span className="address-badge">DEFAULT</span>}
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{addr.label}</h4>
                        <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{addr.customerName}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                          {addr.shippingAddress}, {addr.district}
                        </p>
                        <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>📞 {addr.phone}</p>
                        
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button onClick={() => {
                            setEditingAddress(addr.id);
                            setAddressForm({
                              label: addr.label,
                              customerName: addr.customerName,
                              phone: addr.phone,
                              district: addr.district,
                              shippingAddress: addr.shippingAddress,
                              isDefault: addr.isDefault
                            });
                            setShowAddressForm(true);
                          }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Edit
                          </button>
                          <button onClick={() => deleteAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#e62c2c', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!profile?.addresses || profile.addresses.length === 0) && (
                      <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>No addresses found. Click Add New Address to add one.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 7. PAYMENTS */}
            {activeTab === 'Payments' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Payment Methods</h2>
                
                {/* Save details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                  <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: 'var(--bg-main)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>📱</span>
                      <span className="ticket-badge resolved">Linked</span>
                    </div>
                    <h4 style={{ fontWeight: 'bold' }}>bKash Wallet</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Number: 017****134</p>
                    <button className="btn btn-outline" style={{ marginTop: '1.25rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => showModalAlert('Mock wallet unlink initiated.', 'Information', 'info')}>
                      Unlink Wallet
                    </button>
                  </div>

                  <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', borderStyle: 'dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => showModalAlert('Mobile banking linkage is mocked.', 'Information', 'info')}>
                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>➕</span>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Add Card or Mobile Wallet</span>
                  </div>
                </div>

                {/* Ledger Transactions */}
                <h3>Transaction History</h3>
                <div style={{ marginTop: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    <span>Details</span>
                    <span>Amount</span>
                  </div>
                  <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Welcome Loyalty Bonus</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>16 June 2026</p>
                    </div>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>+150 Points</span>
                  </div>
                  {orders.map(order => (
                    <div key={order._id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Paid for Order {order.orderID}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span style={{ color: '#e62c2c', fontWeight: 'bold' }}>-৳{order.totalAmount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. REVIEWS */}
            {activeTab === 'Reviews' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Reviews & Ratings</h2>
                
                {orders.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>Purchase fruits to leave ratings and reviews.</p>
                ) : showReviewForm ? (
                  <form onSubmit={handleReviewSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3>Review for {reviewProduct}</h3>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <select 
                        className="form-input" 
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Review Details</label>
                      <textarea
                        className="form-input"
                        rows="4"
                        placeholder="Share your experience with the taste, freshness, and packaging..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary">Submit Review</button>
                      <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-outline">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Write a review for your recently purchased seasonal fruits:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {orders.map(order => (
                        <div key={order._id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <h4 style={{ fontWeight: 'bold' }}>{order.productTitle}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ordered: {new Date(order.createdAt).toLocaleDateString()} ({order.variant})</p>
                          </div>
                          <button onClick={() => {
                            setReviewProduct(order.productTitle);
                            setShowReviewForm(true);
                          }} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                            Rate & Review
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 9. COUPONS & REWARDS */}
            {activeTab === 'Coupons & Rewards' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Coupons & Loyalty Rewards</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                  <div className="coupon-card">
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>৳50 Flat Off</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>On combos. Valid till July 2026</p>
                    </div>
                    <span className="coupon-code">WELCOME50</span>
                  </div>

                  <div className="coupon-card">
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Free Shipping</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Min order ৳1000</p>
                    </div>
                    <span className="coupon-code">FREESHIP</span>
                  </div>
                </div>

                <h3>Referral Program</h3>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: 'var(--bg-main)', marginTop: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold' }}>Refer a Friend & Get 100 Points!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.5rem 0 1.25rem 0', lineHeight: '1.5' }}>
                    Share your unique referral URL. When your friends place their first order, they get ৳50 off, and you earn 100 loyalty points!
                  </p>
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${profile?.customerUID || 'amaira'}`);
                    showModalAlert('Referral URL copied to clipboard!', 'Success', 'success');
                  }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Copy Referral Link
                  </button>
                </div>
              </div>
            )}

            {/* 10. RETURNS & REFUNDS */}
            {activeTab === 'Returns & Refunds' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Returns & Refunds Policy</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                  Amaira Fruits offers a 100% replacement guarantee if your fruits arrive bruised, damaged, or of compromised quality. Please submit a request within 24 hours of delivery.
                </p>

                <h3>Create Return/Exchange Request</h3>
                {orders.filter(o => o.orderStatus === 'Delivered').length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
                    No delivered orders eligible for returns at this time.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {orders.filter(o => o.orderStatus === 'Delivered').map(order => (
                      <div key={order._id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <h4 style={{ fontWeight: 'bold' }}>Order {order.orderID}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => {
                          showModalAlert(`Return request for Order ${order.orderID} has been successfully logged. Please send pictures of the fruits to our WhatsApp: 01740414134.`, 'Return Requested', 'success');
                        }} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                          Request Return/Refund
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 11. NOTIFICATIONS */}
            {activeTab === 'Notifications' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Notification Alerts</h2>
                  {profile?.notifications?.some(n => !n.read) && (
                    <button onClick={async () => {
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                      const res = await fetch(`${apiUrl}/api/user/notifications/read`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                      if (res.ok) {
                        setProfile(await res.json());
                      }
                    }} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Mark all as read
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
                  {profile?.notifications?.map(notif => (
                    <div key={notif.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: notif.read ? 'var(--bg-card)' : 'var(--bg-main)', position: 'relative' }}>
                      {!notif.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', position: 'absolute', top: '1.25rem', right: '1.25rem' }}></div>}
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{notif.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{notif.body}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {(!profile?.notifications || profile.notifications.length === 0) && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No new notifications.</p>
                  )}
                </div>

                <h3>Alert Channels</h3>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Email Notifications</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Send billing reports and seasonal pre-order alerts</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={profile?.notificationSettings?.email ?? true} 
                      onChange={(e) => toggleNotificationChannel('email', e.target.checked)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>SMS Alerts</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dispatch shipping statuses and courier information to your mobile phone</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={profile?.notificationSettings?.sms ?? true} 
                      onChange={(e) => toggleNotificationChannel('sms', e.target.checked)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Push Notifications</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive live browser notification alerts</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={profile?.notificationSettings?.push ?? false} 
                      onChange={(e) => toggleNotificationChannel('push', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 12. SUPPORT CENTER */}
            {activeTab === 'Support' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Support Desk</h2>
                  {!showTicketForm && (
                    <button onClick={() => setShowTicketForm(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Open Support Ticket
                    </button>
                  )}
                </div>

                {showTicketForm ? (
                  <form onSubmit={handleTicketSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3>Create New Support Ticket</h3>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Order Delivery Status, Bruised Fruits replacement"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Details / Description</label>
                      <textarea
                        className="form-input"
                        rows="5"
                        placeholder="Describe your issue or question in detail..."
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary">Submit Ticket</button>
                      <button type="button" onClick={() => setShowTicketForm(false)} className="btn btn-outline">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {/* Active tickets */}
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Your Support Tickets</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                      {profile?.tickets?.map(ticket => (
                        <div key={ticket.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: 'var(--bg-main)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold' }}>{ticket.id}: {ticket.subject}</span>
                            <span className={`ticket-badge ${ticket.status === 'Open' ? 'open' : 'resolved'}`}>{ticket.status}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.description}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                            Opened: {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {(!profile?.tickets || profile.tickets.length === 0) && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No support tickets created yet.</p>
                      )}
                    </div>

                    {/* Quick Contacts */}
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: 'var(--bg-main)' }}>
                      <h4 style={{ fontWeight: 'bold' }}>Urgent Support?</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 1rem 0' }}>Call or WhatsApp our support line directly for immediate assistance.</p>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href="https://wa.me/8801740414134" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                          💬 WhatsApp: 01740414134
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 13. SECURITY SETTINGS */}
            {activeTab === 'Security' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Security Settings</h2>
                
                {/* Active Sessions */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3>Active Login Devices</h3>
                  <div style={{ marginTop: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyBetween: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', justifyContent: 'space-between' }}>
                      <span>Device / Location</span>
                      <span>Status</span>
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>MacBook Pro (macOS Big Sur)</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IP: 103.118.44.120 · Dhaka, Bangladesh</p>
                      </div>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}>Active Now</span>
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>iPhone 14 (Mobile Browser)</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IP: 103.118.44.120 · Dhaka, Bangladesh</p>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Logged out</span>
                    </div>
                  </div>
                </div>

                {/* Account Deactivation */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                  <h3 style={{ color: '#e62c2c', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Danger Zone</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Permanently delete or deactivate your account data. This action is irreversible. All loyalty points will be cleared.
                  </p>
                  <button onClick={() => {
                    showModalConfirm('Are you absolutely sure you want to deactivate your account? This will delete all order records.', () => {
                      showModalAlert('Account deactivation is blocked in demo mode.', 'Deactivation Blocked', 'warning');
                    }, 'Deactivate Account', 'danger');
                  }} className="btn btn-outline" style={{ color: '#e62c2c', borderColor: '#e62c2c' }}>
                    Deactivate Account
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* DETAILED INVOICE PRINTABLE MODAL */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2rem', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            
            {/* Printable Area */}
            <div className="invoice-print-area" style={{ padding: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>🍏 Amaira Fruits</h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Premium safe chemical-free fruits chain</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>INVOICE</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID: {selectedInvoice.orderID}</p>
                </div>
              </div>

              <div className="grid grid-2" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Customer Details:</h4>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.25rem' }}>{selectedInvoice.customerName}</p>
                  <p style={{ color: 'var(--text-muted)' }}>{selectedInvoice.shippingAddress}, {selectedInvoice.district}</p>
                  <p>Phone: {selectedInvoice.phone}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Invoice Summary:</h4>
                  <p style={{ marginTop: '0.25rem' }}>Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  <p>Method: {selectedInvoice.paymentMethod || 'COD'}</p>
                  <p style={{ fontWeight: 'bold' }}>Status: {selectedInvoice.orderStatus}</p>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', textAlign: 'left', backgroundColor: 'var(--bg-main)' }}>
                    <th style={{ padding: '0.5rem' }}>Product Title</th>
                    <th style={{ padding: '0.5rem' }}>Variant</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem' }}>{selectedInvoice.productTitle}</td>
                    <td style={{ padding: '0.5rem' }}>{selectedInvoice.variant}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>{selectedInvoice.quantity}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                      ৳{selectedInvoice.totalAmount - selectedInvoice.shippingFee}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Price calculations */}
              <div style={{ width: '50%', marginLeft: '50%', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>৳{selectedInvoice.totalAmount - selectedInvoice.shippingFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Fee:</span>
                  <span>৳{selectedInvoice.shippingFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--primary)', paddingTop: '0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  <span>Grand Total:</span>
                  <span>৳{selectedInvoice.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Print Invoice 🖨️
              </button>
              <button onClick={() => setSelectedInvoice(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PREMIUM CUSTOM DIALOG MODAL */}
      {dialogOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '450px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            position: 'relative',
            border: '1px solid var(--border-color)',
            animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden'
          }}>
            {/* Top status bar/indicator */}
            <div style={{
              height: '5px',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: dialogType === 'success' ? '#135d27' :
                               dialogType === 'danger' ? '#e62c2c' :
                               dialogType === 'warning' ? '#e67e22' : '#3498db'
            }} />

            {/* Close button at corner */}
            <button 
              onClick={() => setDialogOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '0.25rem',
                transition: 'color 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.target.style.color = '#e62c2c'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              aria-label="Close Dialog"
            >
              &times;
            </button>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
              <span style={{
                fontSize: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}>
                {dialogType === 'success' && '✅'}
                {dialogType === 'danger' && '❌'}
                {dialogType === 'warning' && '⚠️'}
                {dialogType === 'info' && '🔔'}
              </span>
              <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.25rem', fontWeight: '800' }}>
                {dialogTitle}
              </h3>
            </div>
            
            <p style={{ margin: '0 0 2rem 0', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {dialogMessage}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              {dialogConfirmCallback ? (
                <>
                  <button 
                    onClick={() => setDialogOpen(false)}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setDialogOpen(false);
                      if (dialogConfirmCallback) dialogConfirmCallback();
                    }}
                    className="btn btn-primary"
                    style={{ 
                      padding: '0.5rem 1.25rem', 
                      fontSize: '0.85rem', 
                      backgroundColor: dialogType === 'danger' ? '#e62c2c' : dialogType === 'success' ? '#135d27' : '#135d27', 
                      borderColor: dialogType === 'danger' ? '#e62c2c' : dialogType === 'success' ? '#135d27' : '#135d27' 
                    }}
                  >
                    Confirm Action
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setDialogOpen(false)}
                  className="btn btn-primary"
                  style={{ 
                    padding: '0.5rem 1.5rem', 
                    fontSize: '0.85rem',
                    backgroundColor: '#135d27',
                    borderColor: '#135d27'
                  }}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
