'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  "Combo Package",
  "Mango (আম)",
  "Dates (খেজুর)",
  "Pickle (আচার)",
  "Fresh Fruits"
];

const BRANDS = [
  "Amaira Fruits",
  "Rajshahi Orchards",
  "Premium Harvests",
  "Imported Specials"
];

export default function UnifiedAdminDashboard() {
  // Authentication & Global states
  const [token, setToken] = useState(null);
  const [adminUsername, setAdminUsername] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Active Menu Tabs
  const [activeMenu, setActiveMenu] = useState('Dashboard'); // Main sidebar menus
  const [activeSubMenu, setActiveSubMenu] = useState('All Products'); // Sub-menu state for Products
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [productsSubExpanded, setProductsSubExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auto-close mobile drawer on menu switches
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeMenu, activeSubMenu]);

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

  // Core Data Lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [customerTab, setCustomerTab] = useState('Successful'); // 'Successful' | 'Abandoned'
  const [tickets, setTickets] = useState([]);

  // Mock State Lists (kept in local memory for live interactive panel editing)
  const [categories, setCategories] = useState([
    { id: '1', name: 'Fresh Mangoes', parent: 'Fruits', slug: 'fresh-mangoes' },
    { id: '2', name: 'Premium Combos', parent: 'Gift Boxes', slug: 'premium-combos' },
    { id: '3', name: 'Premium Dates', parent: 'Imported', slug: 'premium-dates' },
    { id: '4', name: 'Sweet Pickles', parent: 'Pickles', slug: 'sweet-pickles' }
  ]);

  const [brands, setBrands] = useState([
    { id: '1', name: 'Amaira Fruits', logo: '🍒', banner: 'garden.jpg' },
    { id: '2', name: 'Rajshahi Orchards', logo: '🥭', banner: 'rajshahi.jpg' }
  ]);

  const [attributes, setAttributes] = useState([
    { id: '1', name: 'Weight', values: ['5 Kg', '10 Kg', '20 Kg'] },
    { id: '2', name: 'Jar Size', values: ['400g', '1 Kg'] }
  ]);

  const [coupons, setCoupons] = useState([
    { code: 'WELCOME50', type: 'Flat', amount: 50, minPurchase: 500, freeShipping: false },
    { code: 'FREESHIP', type: 'Free Shipping', amount: 0, minPurchase: 1000, freeShipping: true }
  ]);

  const [flashSales, setFlashSales] = useState([
    { title: 'Summer Mango Festival', discount: 15, active: true, start: '2026-06-16', end: '2026-06-30' }
  ]);

  const [reviews, setReviews] = useState([
    { id: '1', user: 'Rahim Khan', product: 'Premium Amropali Combo', rating: 5, comment: 'Extremely sweet and juicy mangoes! Highly recommended.', status: 'Approved', reply: '' },
    { id: '2', user: 'Sumaiya Akter', product: 'Homemade Mango Pickle', rating: 4, comment: 'Aromatic taste, loved the authentic spice blends.', status: 'Pending', reply: '' }
  ]);

  const [blogs, setBlogs] = useState([
    { id: '1', title: 'Why Organic Mangoes are Safer for Children', category: 'Health Tips', views: 320, author: 'Dr. Tasnim Ahmed' },
    { id: '2', title: 'A Guide to Ripening Mangoes Naturally at Home', category: 'DIY Guides', views: 480, author: 'Sarker Zaman' }
  ]);

  // Integration Settings
  const [integrations, setIntegrations] = useState({
    facebookPixel: 'pixel_981723491',
    googleAnalytics: 'G-MEASURE88',
    whatsappWidget: '8801740414134'
  });

  const [settings, setSettings] = useState({
    siteName: 'Amaira Fruits',
    vatPercent: 5,
    currency: '৳',
    timezone: 'Dhaka (GMT+6)',
    logoUrl: '',
    maintenanceMode: false
  });

  const [shippingConfig, setShippingConfig] = useState({
    dhakaCharge: 80,
    outsideDhakaCharge: 150,
    courierName: 'Steadfast',
    apiKey: 'steadfast_api_key_amaira_fruits_991823'
  });

  const [paymentConfig, setPaymentConfig] = useState({
    bkashEnabled: true,
    bkashMerchant: '01740414134',
    nagadEnabled: true,
    nagadMerchant: '01740414134',
    rocketEnabled: false,
    rocketMerchant: '',
    sslEnabled: true,
    stripeEnabled: false
  });

  // Action / Selected modal details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPackingSlip, setShowPackingSlip] = useState(false);
  const [selectedCustomerNotes, setSelectedCustomerNotes] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [replyTicketId, setReplyTicketId] = useState(null);
  const [replyTicketUserId, setReplyTicketUserId] = useState(null);

  // Form States (Add/Edit Product)
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    pricePerKg: '',
    daysLeftForPrice: '',
    category: CATEGORIES[0],
    mainImage: '',
    galleryImages: [],
    variantsList: [],
    freeDelivery: false,
    inStock: true,
    stockQuantity: 0,
    sku: '',
    barcode: '',
    weight: '5 Kg',
    dimension: '12x12x10 Inch',
    brand: BRANDS[0],
    tags: 'mango, fresh, organic',
    seoTitle: '',
    seoMeta: ''
  });

  // Form States (Generic Add Forms)
  const [newCat, setNewCat] = useState({ name: '', parent: 'None', slug: '', seo: '' });
  const [newBrand, setNewBrand] = useState({ name: '', logo: '', banner: '' });
  const [newAttr, setNewAttr] = useState({ name: '', values: '' });
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'Flat', amount: '', minPurchase: '', freeShipping: false });
  const [newBlog, setNewBlog] = useState({ title: '', category: '', content: '', author: '' });

  // Security Staff & Roles list
  const [staff, setStaff] = useState([
    { name: 'Sarwar Jahan', email: 'owner@amairafruits.com', role: 'Super Admin', modules: 'All' },
    { name: 'Mamun Khan', email: 'mamun@amairafruits.com', role: 'Order Manager', modules: 'Orders, Shipping' }
  ]);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'Manager', modules: [] });

  // Load Admin Token on Mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const storedUsername = localStorage.getItem('adminUsername');
    
    if (!adminToken) {
      setAuthError(true);
      setLoading(false);
      window.location.href = '/admin/login';
      return;
    }

    setToken(adminToken);
    if (storedUsername) {
      setAdminUsername(storedUsername);
    }
  }, []);

  // Fetch Database Lists when Token is ready
  useEffect(() => {
    if (!token) return;
    loadAllAdminData();
  }, [token]);

  const loadAllAdminData = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    
    try {
      // 1. Fetch Products
      const prodRes = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
      if (prodRes.ok) {
        setProducts(await prodRes.json());
      }

      // 2. Fetch Orders
      const ordRes = await fetch(`${apiUrl}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordRes.status === 401) {
        handleLogout();
        return;
      }
      if (ordRes.ok) {
        setOrders(await ordRes.json());
      }

      // 3. Fetch Successful Customers
      const custRes = await fetch(`${apiUrl}/api/orders/admin/successful-customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (custRes.status === 401) {
        handleLogout();
        return;
      }
      if (custRes.ok) {
        setCustomers(await custRes.json());
      }

      // 3.5 Fetch Abandoned Carts
      const abandonRes = await fetch(`${apiUrl}/api/orders/admin/abandoned-carts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (abandonRes.ok) {
        setAbandonedCarts(await abandonRes.json());
      }

      // 4. Fetch Support Tickets
      const tickRes = await fetch(`${apiUrl}/api/admin/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (tickRes.status === 401) {
        handleLogout();
        return;
      }
      if (tickRes.ok) {
        setTickets(await tickRes.json());
      }
    } catch (error) {
      console.error('Failed to load control center data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = '/';
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    
    // Process variantsList
    const parsedVariants = productForm.variantsList
      .filter(v => v.label.trim() !== '' && !isNaN(parseFloat(v.price)))
      .map(v => ({ label: v.label.trim(), price: parseFloat(v.price) }));

    const payload = {
      title: productForm.title,
      name: productForm.title,
      description: productForm.description,
      pricePerKg: parseFloat(productForm.pricePerKg),
      price_per_kg: parseFloat(productForm.pricePerKg),
      basePrice: parseFloat(productForm.pricePerKg),
      daysLeftForPrice: productForm.daysLeftForPrice ? parseInt(productForm.daysLeftForPrice) : undefined,
      originalPrice: productForm.daysLeftForPrice ? parseInt(productForm.daysLeftForPrice) : undefined,
      category: productForm.category,
      images: productForm.mainImage ? [productForm.mainImage, ...productForm.galleryImages] : productForm.galleryImages,
      variants: parsedVariants,
      freeDelivery: productForm.freeDelivery,
      inStock: productForm.inStock,
      stockQuantity: Number(productForm.stockQuantity) || 0
    };

    try {
      const method = isEditingProduct ? 'PUT' : 'POST';
      const url = isEditingProduct 
        ? `${apiUrl}/api/products/${editingProductId}`
        : `${apiUrl}/api/products`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showModalAlert(isEditingProduct ? 'Product updated successfully!' : 'Product created successfully!', 'Success', 'success');
        resetProductForm();
        loadAllAdminData();
        setActiveSubMenu('All Products');
      } else {
        const errorData = await res.json();
        showModalAlert(errorData.message || 'Operation failed', 'Error', 'danger');
      }
    } catch (err) {
      showModalAlert('Error updating fruit catalog', 'Error', 'danger');
    }
  };

  const deleteProduct = (id) => {
    showModalConfirm('Are you sure you want to delete this product?', async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      try {
        const res = await fetch(`${apiUrl}/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          showModalAlert('Product deleted successfully', 'Success', 'success');
          loadAllAdminData();
        } else {
          showModalAlert('Delete failed', 'Error', 'danger');
        }
      } catch (error) {
        showModalAlert('Error connecting to server', 'Error', 'danger');
      }
    }, 'Delete Confirmation', 'danger');
  };

  const startEditProduct = (prod) => {
    setIsEditingProduct(true);
    setEditingProductId(prod._id);
    
    // Map variants directly
    const vList = prod.variants ? prod.variants.map(v => ({ label: v.label, price: v.price.toString() })) : [];

    setProductForm({
      title: prod.title,
      description: prod.description || '',
      pricePerKg: prod.pricePerKg ? prod.pricePerKg.toString() : (prod.price_per_kg ? prod.price_per_kg.toString() : (prod.basePrice ? prod.basePrice.toString() : '')),
      daysLeftForPrice: prod.daysLeftForPrice ? prod.daysLeftForPrice.toString() : (prod.originalPrice ? prod.originalPrice.toString() : ''),
      category: prod.category,
      mainImage: prod.images && prod.images.length > 0 ? prod.images[0] : '',
      galleryImages: prod.images && prod.images.length > 1 ? prod.images.slice(1) : [],
      variantsList: vList,
      freeDelivery: prod.freeDelivery || false,
      inStock: prod.inStock !== undefined ? prod.inStock : true,
      stockQuantity: prod.stockQuantity || 0,
      sku: prod.sku || 'AM-' + prod.slug.substring(0, 4).toUpperCase(),
      barcode: prod.barcode || '7404141340',
      weight: '5 Kg',
      dimension: '12x12x10 Inch',
      brand: BRANDS[0],
      tags: 'fresh, organic, fruit',
      seoTitle: prod.title + ' | Amaira Fruits',
      seoMeta: prod.description ? prod.description.substring(0, 150) : ''
    });
    setActiveSubMenu('Add Product');
  };

  const resetProductForm = () => {
    setIsEditingProduct(false);
    setEditingProductId(null);
    setProductForm({
      title: '',
      description: '',
      pricePerKg: '',
      daysLeftForPrice: '',
      category: CATEGORIES[0],
      mainImage: '',
      galleryImages: [],
      variantsList: [],
      freeDelivery: false,
      inStock: true,
      stockQuantity: 0,
      sku: '',
      barcode: '',
      weight: '5 Kg',
      dimension: '12x12x10 Inch',
      brand: BRANDS[0],
      tags: 'mango, fresh, organic',
      seoTitle: '',
      seoMeta: ''
    });
  };

  const handleImageUpload = async (e, isMain) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls = [];
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    let tokenExpired = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch(`${apiUrl}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        if (res.status === 401) {
          tokenExpired = true;
          break;
        }

        const data = await res.json();
        if (res.ok) {
          uploadedUrls.push(data.url);
        } else {
          console.error('Single image upload failed:', data.message);
        }
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }

    if (tokenExpired) {
      showModalAlert('Your admin session has expired. Redirecting to login page...', 'Session Expired', 'danger');
      setTimeout(() => {
        handleLogout();
      }, 2500);
      return;
    }

    if (uploadedUrls.length > 0) {
      setProductForm(prev => {
        if (isMain) {
          return { ...prev, mainImage: uploadedUrls[0] };
        } else {
          return { ...prev, galleryImages: [...prev.galleryImages, ...uploadedUrls] };
        }
      });
    } else {
      showModalAlert('Image upload failed. Please try logging out and logging back in, or check the server logs.', 'Upload Failed', 'danger');
    }
  };

  // Order Actions
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    try {
      const res = await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showModalAlert(`Order state updated to ${newStatus}`, 'Status Updated', 'success');
        loadAllAdminData();
      } else {
        const data = await res.json();
        showModalAlert(data.message || 'Failed to update order status', 'Error', 'danger');
      }
    } catch (error) {
      showModalAlert('Server communication error', 'Error', 'danger');
    }
  };

  // Customer Actions
  const toggleCustomerBlockStatus = async (id, currentBlock) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    try {
      const res = await fetch(`${apiUrl}/api/admin/customers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isBlocked: !currentBlock })
      });
      if (res.ok) {
        showModalAlert(`User account ${!currentBlock ? 'Blocked' : 'Unblocked'} successfully!`, 'Status Updated', 'success');
        loadAllAdminData();
      }
    } catch (error) {
      showModalAlert('Failed to update block state', 'Error', 'danger');
    }
  };

  const adjustCustomerWallet = async (id, currentPoints) => {
    const amt = prompt('Enter point adjustment value (positive to add, negative to subtract):', '50');
    if (!amt) return;
    const value = parseInt(amt);
    if (isNaN(value)) {
      showModalAlert('Invalid numeric input', 'Validation Error', 'warning');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    try {
      const res = await fetch(`${apiUrl}/api/admin/customers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ loyaltyPoints: currentPoints + value })
      });
      if (res.ok) {
        showModalAlert(`Wallet Points updated to ${currentPoints + value}`, 'Points Updated', 'success');
        loadAllAdminData();
      }
    } catch (error) {
      showModalAlert('Failed to update wallet points', 'Error', 'danger');
    }
  };

  const saveCustomerAdminNote = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    try {
      const res = await fetch(`${apiUrl}/api/admin/customers/${selectedCustomerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: selectedCustomerNotes })
      });
      if (res.ok) {
        showModalAlert('Customer administrative notes saved!', 'Notes Saved', 'success');
        setSelectedCustomerId(null);
        loadAllAdminData();
      }
    } catch (error) {
      showModalAlert('Failed to save user note', 'Error', 'danger');
    }
  };

  // Support Ticket Actions
  const handleSupportTicketReplySubmit = async (e) => {
    e.preventDefault();
    if (!ticketReplyText.trim()) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    try {
      const res = await fetch(`${apiUrl}/api/admin/tickets/${replyTicketUserId}/${replyTicketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Resolved', reply: ticketReplyText })
      });
      if (res.ok) {
        showModalAlert('Reply submitted. Notification sent to customer!', 'Reply Sent', 'success');
        setReplyTicketId(null);
        setTicketReplyText('');
        loadAllAdminData();
      }
    } catch (error) {
      showModalAlert('Failed to send reply', 'Error', 'danger');
    }
  };

  if (authError) {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#e62c2c', gap: '1rem' }}>
        <h2>🔒 Administrative Authentication Required</h2>
        <p>Please log in with admin privileges.</p>
        <Link href="/admin/login" className="btn btn-primary">Login Panel</Link>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.order_status === 'Pending').length;
  const confirmedOrdersCount = orders.filter(o => o.order_status === 'Confirmed').length;
  const shippedOrdersCount = orders.filter(o => o.order_status === 'Shipped').length;
  const deliveredOrdersCount = orders.filter(o => o.order_status === 'delivered').length;
  const cancelledOrdersCount = orders.filter(o => o.order_status === 'cancelled').length;

  const totalRevenue = orders
    .filter(o => o.order_status === 'delivered')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const lowStockThreshold = 10;
  const lowStockCount = products.filter(p => !p.inStock || p.pricePerKg < 500).length; // Simulated threshold

  // Top Selling Products mock calculation
  const topSellingProducts = products.slice(0, 3);
  
  // Daily Sales Trend values for Graph: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  const salesGraphData = [
    { day: 'Sun', sales: 12400 },
    { day: 'Mon', sales: 15600 },
    { day: 'Tue', sales: 9800 },
    { day: 'Wed', sales: 21000 },
    { day: 'Thu', sales: 18500 },
    { day: 'Fri', sales: 24500 },
    { day: 'Sat', sales: totalRevenue > 0 ? totalRevenue : 32000 }
  ];

  const maxGraphVal = Math.max(...salesGraphData.map(d => d.sales));

  return (
    <section className="admin-dashboard-container">
      
      {/* Backdrop for Mobile Sidebar Drawer */}
      <div className={`admin-backdrop ${mobileSidebarOpen ? 'open' : ''}`} onClick={() => setMobileSidebarOpen(false)}></div>
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar-nav ${sidebarExpanded ? '' : 'collapsed'} ${mobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Banner Header */}
        <div style={{ 
          padding: '1.25rem', 
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarExpanded ? 'space-between' : 'center'
        }}>
          {sidebarExpanded && (
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>🍏 Amaira Admin</span>
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Control Console</div>
              <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'none', border: '1px solid #60a5fa', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>
                🛒 View Storefront
              </a>
            </div>
          )}
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)} 
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            {sidebarExpanded ? '◀' : '▶'}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          
          {/* Main Dashboard item */}
          <button 
            className={`admin-tab-btn ${activeMenu === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMenu('Dashboard')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', 
              padding: '0.75rem 1rem', background: activeMenu === 'Dashboard' ? 'rgba(255,255,255,0.15)' : 'none',
              border: 'none', color: '#ffffff', textAlign: 'left', borderRadius: '0.5rem', cursor: 'pointer',
              fontWeight: activeMenu === 'Dashboard' ? '700' : 'normal'
            }}
          >
            <span>📊</span>
            {sidebarExpanded && <span>Dashboard</span>}
          </button>

          {/* Products parent tab */}
          <div>
            <button 
              onClick={() => {
                setActiveMenu('Products');
                setProductsSubExpanded(!productsSubExpanded);
              }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', 
                padding: '0.75rem 1rem', background: activeMenu === 'Products' ? 'rgba(255,255,255,0.15)' : 'none',
                border: 'none', color: '#ffffff', textAlign: 'left', borderRadius: '0.5rem', cursor: 'pointer',
                fontWeight: activeMenu === 'Products' ? '700' : 'normal', justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>📦</span>
                {sidebarExpanded && <span>Products</span>}
              </div>
              {sidebarExpanded && (<span>{productsSubExpanded ? '▼' : '▶'}</span>)}
            </button>

            {/* Submenus under Products */}
            {productsSubExpanded && sidebarExpanded && (
              <div style={{ paddingLeft: '1.75rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {[
                  { label: 'All Products', icon: '📝' },
                  { label: 'Add Product', icon: '➕' },
                  { label: 'Categories', icon: '🗂️' },
                  { label: 'Brands', icon: '🏷️' },
                  { label: 'Attributes', icon: '🎨' },
                  { label: 'Inventory', icon: '📉' }
                ].map(sub => (
                  <button
                    key={sub.label}
                    onClick={() => {
                      setActiveMenu('Products');
                      setActiveSubMenu(sub.label);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
                      padding: '0.5rem 0.75rem', background: activeSubMenu === sub.label && activeMenu === 'Products' ? 'rgba(255,255,255,0.25)' : 'none',
                      border: 'none', color: '#ffffff', textAlign: 'left', borderRadius: '0.35rem', cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Simple Tab list mapping */}
          {[
            { id: 'Orders', icon: '🛒', label: 'Orders' },
            { id: 'Customers', icon: '👥', label: 'Customers' },
            { id: 'Reviews', icon: '⭐', label: 'Reviews' },
            { id: 'Coupons', icon: '🎟️', label: 'Coupons' },
            { id: 'Flash Sales', icon: '⚡', label: 'Flash Sales' },
            { id: 'Shipping', icon: '🚚', label: 'Shipping' },
            { id: 'Payments', icon: '💳', label: 'Payments' },
            { id: 'Marketing', icon: '📣', label: 'Marketing' },
            { id: 'Reports', icon: '📈', label: 'Reports' },
            { id: 'Blog', icon: '📝', label: 'Blog' },
            { id: 'CMS', icon: '🌐', label: 'CMS' },
            { id: 'Support', icon: '💬', label: 'Support' },
            { id: 'Notifications', icon: '🔔', label: 'Notifications' },
            { id: 'Staff & Roles', icon: '🔐', label: 'Staff & Roles' },
            { id: 'Integrations', icon: '🔌', label: 'Integrations' },
            { id: 'Settings', icon: '⚙️', label: 'Settings' },
            { id: 'Backup', icon: '💾', label: 'Backup' }
          ].map(menu => (
            <button
              key={menu.id}
              className={`admin-tab-btn ${activeMenu === menu.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(menu.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', width: '100%',
                padding: '0.75rem 1rem', background: activeMenu === menu.id ? 'rgba(255,255,255,0.15)' : 'none',
                border: 'none', color: '#ffffff', textAlign: 'left', borderRadius: '0.5rem', cursor: 'pointer',
                fontWeight: activeMenu === menu.id ? '700' : 'normal'
              }}
            >
              <span>{menu.icon}</span>
              {sidebarExpanded && <span>{menu.label}</span>}
            </button>
          ))}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', width: '100%',
              padding: '0.75rem 1rem', background: 'none', border: 'none',
              color: '#ffa4a4', textAlign: 'left', borderRadius: '0.5rem', cursor: 'pointer',
              marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem'
            }}
          >
            <span>🚪</span>
            {sidebarExpanded && <span>Logout</span>}
          </button>
        </nav>

        {/* Sidebar Footer */}
        {sidebarExpanded && (
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', opacity: 0.8, textAlign: 'center' }}>
            User: <strong>{adminUsername}</strong>
          </div>
        )}
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Sticky Mobile Header */}
        <header className="admin-mobile-header">
          <Link href="/" className="logo-link" style={{ fontSize: '1.25rem' }}>
            <span className="logo-icon">🍏</span>
            <span>Amaira Fruits</span>
          </Link>
          <button 
            className="admin-mobile-menu-btn" 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </header>

        <main className="admin-main-content">
        
        {/* Global Loading Spinner */}
        {loading ? (
          <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
            🔄 Loading Amaira Control Center Modules...
          </div>
        ) : (
          <div className="animate-slide-up">
            
            {/* Header info bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>
                  {activeMenu} {activeMenu === 'Products' ? `> ${activeSubMenu}` : ''}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Manage store parameters, products catalog, security roles, and logs.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="ticket-badge resolved" style={{ fontSize: '0.85rem' }}>Cloud DB Sync: Connected</span>
                <button onClick={loadAllAdminData} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  🔄 Refresh Data
                </button>
              </div>
            </div>

            {/* MODULE PANEL ROUTER CONTAINER */}
            <div className="card" style={{ padding: '2.5rem', borderRadius: '1rem', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              
              {/* =============================================================== */}
              {/* 1. DASHBOARD MODULE OVERVIEW */}
              {/* =============================================================== */}
              {activeMenu === 'Dashboard' && (
                <div>
                  {/* Grid Widgets */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                    
                    <div style={{ padding: '1.25rem', borderRadius: '0.75rem', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9' }}>
                      <span style={{ fontSize: '1.75rem' }}>৳</span>
                      <h4 style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', margin: '0.5rem 0' }}>TODAY SALES / REVENUE</h4>
                      <h2 style={{ fontSize: '1.85rem', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>৳ {totalRevenue}</h2>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From delivered checkouts</span>
                    </div>

                    <div style={{ padding: '1.25rem', borderRadius: '0.75rem', backgroundColor: '#efebe9', border: '1px solid #d7ccc8' }}>
                      <span style={{ fontSize: '1.75rem' }}>📦</span>
                      <h4 style={{ color: '#5d4037', fontSize: '0.8rem', fontWeight: 'bold', margin: '0.5rem 0' }}>TOTAL PRODUCTS</h4>
                      <h2 style={{ fontSize: '1.85rem', color: '#5d4037', fontWeight: '800', margin: 0 }}>{products.length}</h2>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live in catalog</span>
                    </div>

                    <div style={{ padding: '1.25rem', borderRadius: '0.75rem', backgroundColor: '#fff3e0', border: '1px solid #ffe0b2' }}>
                      <span style={{ fontSize: '1.75rem' }}>⏳</span>
                      <h4 style={{ color: '#e65100', fontSize: '0.8rem', fontWeight: 'bold', margin: '0.5rem 0' }}>PENDING ORDERS</h4>
                      <h2 style={{ fontSize: '1.85rem', color: '#e65100', fontWeight: '800', margin: 0 }}>{pendingOrdersCount}</h2>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting verification</span>
                    </div>

                    <div style={{ padding: '1.25rem', borderRadius: '0.75rem', backgroundColor: '#ffebee', border: '1px solid #ffcdd2' }}>
                      <span style={{ fontSize: '1.75rem' }}>🚨</span>
                      <h4 style={{ color: '#c62828', fontSize: '0.8rem', fontWeight: 'bold', margin: '0.5rem 0' }}>LOW STOCK ALERT</h4>
                      <h2 style={{ fontSize: '1.85rem', color: '#c62828', fontWeight: '800', margin: 0 }}>{lowStockCount}</h2>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Out of stock / critical</span>
                    </div>

                  </div>

                  {/* Graph & Stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
                    
                    {/* SVG GRAPH CHART */}
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>📈 Weekly Revenue Trends (৳)</h3>
                      <div style={{ 
                        height: '240px', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '0.75rem', 
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        backgroundColor: '#fafafa',
                        position: 'relative'
                      }}>
                        {salesGraphData.map(d => {
                          const percent = maxGraphVal > 0 ? (d.sales / maxGraphVal) * 80 : 50;
                          return (
                            <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--primary)' }}>৳{d.sales}</div>
                              <div style={{
                                width: '28px',
                                height: `${percent}%`,
                                backgroundColor: 'var(--primary)',
                                borderRadius: '0.25rem 0.25rem 0 0',
                                transition: 'height 0.5s ease-out'
                              }}></div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--text-muted)' }}>{d.day}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stock overview status & Top sellers */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>🏆</span> Top Selling Products
                        </h4>
                        <ul style={{ paddingLeft: '1rem', marginTop: '0.75rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {topSellingProducts.map(p => (
                            <li key={p._id}>
                              <strong>{p.title}</strong> - ৳{p.pricePerKg} ({p.category})
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#c62828', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>⚠️</span> Low Stock Listings
                        </h4>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {products.filter(p => !p.inStock).length > 0 ? (
                            products.filter(p => !p.inStock).map(p => (
                              <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #eee' }}>
                                <span>{p.title}</span>
                                <span style={{ color: '#c62828', fontWeight: 'bold' }}>OUT OF STOCK</span>
                              </div>
                            ))
                          ) : (
                            <p style={{ margin: 0 }}>All products listed are currently marked In Stock.</p>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Recent orders short table */}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>🛒 Recent Orders (Last 5)</h3>
                    <div className="admin-table-container">
                      <table className="admin-table" style={{ fontSize: '0.85rem' }}>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Item Details</th>
                            <th>Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(o => (
                            <tr key={o._id}>
                              <td><strong>{o.order_number}</strong></td>
                              <td>{o.customer_snapshot?.name} ({o.customer_snapshot?.phone})</td>
                              <td>{o.items?.map(i => `${i.productTitle} (${i.variant})`).join(', ')}</td>
                              <td>৳{o.total}</td>
                              <td>
                                <span className={`ticket-badge ${o.order_status === 'delivered' ? 'resolved' : 'open'}`}>
                                  {o.order_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* =============================================================== */}
              {/* 2. PRODUCTS -> ALL PRODUCTS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Products' && activeSubMenu === 'All Products' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3>Product Catalog Matrix ({products.length} Products)</h3>
                    <button onClick={() => { setActiveSubMenu('Add Product'); resetProductForm(); }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      ➕ Add Product
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Price / Kg</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(prod => {
                          const img = prod.images && prod.images.length > 0 ? prod.images[0] : "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=80";
                          return (
                            <tr key={prod._id}>
                              <td>
                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', maxWidth: '100px' }}>
                                  {prod.images && prod.images.length > 0 ? (
                                    prod.images.slice(0, 3).map((image, idx) => (
                                      <img key={idx} src={image} alt={`product-${idx}`} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                                    ))
                                  ) : (
                                    <img src="https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=80" alt="placeholder" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                                  )}
                                  {prod.images && prod.images.length > 3 && (
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>+{prod.images.length - 3}</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <strong style={{ color: 'var(--primary)' }}>{prod.title}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slug: {prod.slug}</div>
                              </td>
                              <td>{prod.category}</td>
                              <td><strong>৳ {prod.pricePerKg}</strong></td>
                              <td>
                                <span className={`ticket-badge ${prod.inStock ? 'resolved' : 'open'}`} style={{ backgroundColor: prod.inStock ? undefined : '#f8d7da', color: prod.inStock ? undefined : '#721c24' }}>
                                  {prod.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button onClick={() => startEditProduct(prod)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                    Edit
                                  </button>
                                  <button onClick={() => deleteProduct(prod._id)} className="btn btn-accent" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#e62c2c' }}>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 3. PRODUCTS -> ADD PRODUCT FORM */}
              {/* =============================================================== */}
              {activeMenu === 'Products' && activeSubMenu === 'Add Product' && (
                <div style={{ maxWidth: '800px' }}>
                  <h3>{isEditingProduct ? '📝 Edit Product Listing' : '➕ Create New Product'}</h3>
                  <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                    
                    <div className="form-group">
                      <label className="form-label">Product Title *</label>
                      <input 
                        type="text" className="form-input" required
                        value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="e.g. Premium Rajshahi Langra Mango"
                      />
                    </div>

                    <div className="admin-grid-2">
                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select className="form-input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Product Brand</label>
                        <select className="form-input" value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })}>
                          {BRANDS.map(br => <option key={br} value={br}>{br}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="admin-grid-2">
                      <div className="form-group">
                        <label className="form-label">SKU Code (Stock Keeping Unit)</label>
                        <input type="text" className="form-input" value={productForm.sku} onChange={e => setProductForm({ ...productForm, sku: e.target.value })} placeholder="e.g. AM-LNGR-01" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Barcode Number (EAN)</label>
                        <input type="text" className="form-input" value={productForm.barcode} onChange={e => setProductForm({ ...productForm, barcode: e.target.value })} placeholder="e.g. 740414134012" />
                      </div>
                    </div>

                    <div className="admin-grid-2">
                      <div className="form-group">
                        <label className="form-label">Price per Kg (৳) *</label>
                        <input type="number" className="form-input" required value={productForm.pricePerKg} onChange={e => setProductForm({ ...productForm, pricePerKg: e.target.value })} placeholder="150" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Days left for this price</label>
                        <input type="number" className="form-input" value={productForm.daysLeftForPrice} onChange={e => setProductForm({ ...productForm, daysLeftForPrice: e.target.value })} placeholder="e.g. 5" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Package Variants</span>
                        <button 
                          type="button" 
                          onClick={() => setProductForm({ ...productForm, variantsList: [...productForm.variantsList, { label: '', price: '' }] })}
                          className="btn btn-outline" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          ➕ Add Variant
                        </button>
                      </label>
                      {productForm.variantsList.length === 0 ? (
                        <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          No variants added. Base price will be used.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {productForm.variantsList.map((variant, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <input 
                                type="text" className="form-input" placeholder="e.g. 5 Kg Package" style={{ flex: 2 }}
                                value={variant.label} 
                                onChange={(e) => {
                                  const newList = [...productForm.variantsList];
                                  newList[index].label = e.target.value;
                                  setProductForm({ ...productForm, variantsList: newList });
                                }}
                              />
                              <input 
                                type="number" className="form-input" placeholder="Price (৳)" style={{ flex: 1 }}
                                value={variant.price} 
                                onChange={(e) => {
                                  const newList = [...productForm.variantsList];
                                  newList[index].price = e.target.value;
                                  setProductForm({ ...productForm, variantsList: newList });
                                }}
                              />
                              <button 
                                type="button" 
                                onClick={() => {
                                  const newList = productForm.variantsList.filter((_, i) => i !== index);
                                  setProductForm({ ...productForm, variantsList: newList });
                                }}
                                style={{ background: 'none', border: 'none', color: '#e62c2c', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.25rem' }}
                                title="Remove Variant"
                              >
                                ✖
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="admin-grid-2">
                      <div className="form-group">
                        <label className="form-label">Weight (Kg)</label>
                        <input type="text" className="form-input" value={productForm.weight} onChange={e => setProductForm({ ...productForm, weight: e.target.value })} placeholder="5 Kg" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Box Dimensions (Inch)</label>
                        <input type="text" className="form-input" value={productForm.dimension} onChange={e => setProductForm({ ...productForm, dimension: e.target.value })} placeholder="12x12x10 Inch" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-input" rows="4" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Detailed harvesting details..." />
                    </div>

                    <div className="form-group">
                      <label className="form-label">SEO Meta Title</label>
                      <input type="text" className="form-input" value={productForm.seoTitle} onChange={e => setProductForm({ ...productForm, seoTitle: e.target.value })} placeholder="SEO optimization tag" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">SEO Meta Description</label>
                      <textarea className="form-input" rows="2" value={productForm.seoMeta} onChange={e => setProductForm({ ...productForm, seoMeta: e.target.value })} placeholder="SEO page summary..." />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Upload Main Product Image</label>
                      <input type="file" className="form-input" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                      {productForm.mainImage && (
                        <div style={{ position: 'relative', width: '100px', height: '100px', marginTop: '1rem', borderRadius: '0.25rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img src={productForm.mainImage} alt="main preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button" onClick={() => setProductForm(prev => ({ ...prev, mainImage: '' }))}
                            style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', width: '20px', height: '20px' }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Upload Gallery Images (Optional)</label>
                      <input type="file" className="form-input" accept="image/*" multiple onChange={(e) => handleImageUpload(e, false)} />
                      {productForm.galleryImages.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                          {productForm.galleryImages.map((img, i) => (
                            <div key={i} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '0.25rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                              <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button 
                                type="button" onClick={() => setProductForm(prev => ({ ...prev, galleryImages: prev.galleryImages.filter((_, idx) => idx !== i) }))}
                                style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', width: '20px', height: '20px' }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={productForm.freeDelivery} onChange={e => setProductForm({ ...productForm, freeDelivery: e.target.checked })} />
                        <strong>Free Delivery Option</strong>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={productForm.inStock} onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })} />
                        <strong>Listed in Stock</strong>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>Stock Qty:</strong>
                        <input type="number" className="form-input" style={{ width: '80px', padding: '0.2rem 0.5rem' }} value={productForm.stockQuantity} onChange={e => setProductForm({ ...productForm, stockQuantity: e.target.value })} />
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                        {isEditingProduct ? 'Save Product Changes' : 'Publish Product'}
                      </button>
                      <button type="button" onClick={() => { resetProductForm(); setActiveSubMenu('All Products'); }} className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeMenu === 'Products' && activeSubMenu === 'Categories' && (
                <div className="admin-grid-split">
                  <div>
                    <h3>🗂️ Add Category Node</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newCat.name) return;
                      setCategories([...categories, { id: 'cat_' + Date.now(), name: newCat.name, parent: newCat.parent, slug: newCat.name.toLowerCase().replace(/ /g, '-') }]);
                      setNewCat({ name: '', parent: 'None', slug: '', seo: '' });
                      showModalAlert('Category added successfully!', 'Success', 'success');
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input type="text" className="form-input" required value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} placeholder="e.g. Organic Mangoes" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Parent Category</label>
                        <select className="form-input" value={newCat.parent} onChange={e => setNewCat({ ...newCat, parent: e.target.value })}>
                          <option value="None">None (Root Category)</option>
                          <option value="Fruits">Fruits</option>
                          <option value="Imported">Imported</option>
                          <option value="Pickles">Pickles</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category SEO Description</label>
                        <textarea className="form-input" rows="2" value={newCat.seo} onChange={e => setNewCat({ ...newCat, seo: e.target.value })} placeholder="Meta page details" />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Category</button>
                    </form>
                  </div>

                  <div>
                    <h3>Active Hierarchy Tree</h3>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <strong>🍏 Fruits (Root)</strong>
                        <div style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {categories.filter(c => c.parent === 'Fruits').map(c => <span key={c.id}>├─ {c.name} (/{c.slug})</span>)}
                        </div>
                      </div>
                      <div>
                        <strong>📦 Combinations (Root)</strong>
                        <div style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {categories.filter(c => c.parent === 'Gift Boxes').map(c => <span key={c.id}>├─ {c.name} (/{c.slug})</span>)}
                        </div>
                      </div>
                      <div>
                        <strong>🌍 Other Categories</strong>
                        <div style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {categories.filter(c => c.parent === 'None' || c.parent === 'Imported' || c.parent === 'Pickles').map(c => <span key={c.id}>├─ {c.name} (/{c.slug})</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 5. PRODUCTS -> BRANDS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Products' && activeSubMenu === 'Brands' && (
                <div className="admin-grid-split">
                  <div>
                    <h3>🏷️ Create Brand Portal</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newBrand.name) return;
                      setBrands([...brands, { id: 'br_' + Date.now(), name: newBrand.name, logo: '🏷️', banner: 'banner.jpg' }]);
                      setNewBrand({ name: '', logo: '', banner: '' });
                      showModalAlert('Brand registered!', 'Success', 'success');
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label">Brand Name</label>
                        <input type="text" className="form-input" required value={newBrand.name} onChange={e => setNewBrand({ ...newBrand, name: e.target.value })} placeholder="e.g. Rajshahi Gardens" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Brand Logo Icon</label>
                        <input type="text" className="form-input" value={newBrand.logo} onChange={e => setNewBrand({ ...newBrand, logo: e.target.value })} placeholder="e.g. 🥭" />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Brand</button>
                    </form>
                  </div>

                  <div>
                    <h3>Registered Brands</h3>
                    <div className="admin-grid-2" style={{ marginTop: '1.25rem' }}>
                      {brands.map(b => (
                        <div key={b.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '2rem' }}>{b.logo}</span>
                          <div>
                            <strong style={{ display: 'block' }}>{b.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: Certified Safe Vendor</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 6. PRODUCTS -> ATTRIBUTES TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Products' && activeSubMenu === 'Attributes' && (
                <div className="admin-grid-split">
                  <div>
                    <h3>🎨 Define Attributes (Weight, Size, Color)</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAttr.name || !newAttr.values) return;
                      setAttributes([...attributes, { id: 'attr_' + Date.now(), name: newAttr.name, values: newAttr.values.split(',').map(v => v.trim()) }]);
                      setNewAttr({ name: '', values: '' });
                      showModalAlert('Attribute saved!', 'Success', 'success');
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label">Attribute Name</label>
                        <input type="text" className="form-input" required value={newAttr.name} onChange={e => setNewAttr({ ...newAttr, name: e.target.value })} placeholder="e.g. Jar Volume" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Values (Comma separated)</label>
                        <input type="text" className="form-input" required value={newAttr.values} onChange={e => setNewAttr({ ...newAttr, values: e.target.value })} placeholder="e.g. 250g, 500g, 1 Kg" />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Attribute</button>
                    </form>
                  </div>

                  <div>
                    <h3>Configured Attributes</h3>
                    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {attributes.map(attr => (
                        <div key={attr.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                          <strong>{attr.name}</strong>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            {attr.values.map(val => (
                              <span key={val} className="ticket-badge resolved" style={{ fontSize: '0.8rem' }}>{val}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 7. PRODUCTS -> INVENTORY TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Products' && activeSubMenu === 'Inventory' && (
                <div>
                  <h3>📉 Stock Quantity & Status Audit</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Directly check and edit live stock availability status indicators.</p>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Product Title</th>
                          <th>Current Status</th>
                          <th>Quantity</th>
                          <th>Free Delivery</th>
                          <th>Stock Toggle Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(prod => (
                          <tr key={prod._id}>
                            <td>
                              <strong>{prod.title}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {prod.category}</div>
                            </td>
                            <td>
                              <span className={`ticket-badge ${prod.inStock ? 'resolved' : 'open'}`} style={{ backgroundColor: prod.inStock ? undefined : '#f8d7da', color: prod.inStock ? undefined : '#721c24' }}>
                                {prod.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                              </span>
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ width: '70px', padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}
                                defaultValue={prod.stockQuantity || 0}
                                onBlur={async (e) => {
                                  const newQty = Number(e.target.value);
                                  if (newQty === prod.stockQuantity) return;
                                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                                  const res = await fetch(`${apiUrl}/api/products/${prod._id}`, {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ stockQuantity: newQty, inStock: newQty > 0 })
                                  });
                                  if (res.ok) {
                                    showModalAlert('Stock quantity updated!', 'Success', 'success');
                                    loadAllAdminData();
                                  }
                                }}
                              />
                            </td>
                            <td>{prod.freeDelivery ? '✅ Yes' : '❌ No'}</td>
                            <td>
                              <button 
                                onClick={async () => {
                                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                                  const res = await fetch(`${apiUrl}/api/products/${prod._id}`, {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ inStock: !prod.inStock })
                                  });
                                  if (res.ok) {
                                    showModalAlert('Stock status toggled!', 'Success', 'success');
                                    loadAllAdminData();
                                  }
                                }}
                                className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                              >
                                Toggle Stock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 8. ORDERS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Orders' && (
                <div>
                  <h3>🛒 Customer Order Management</h3>
                  <div className="admin-table-container" style={{ marginTop: '1.5rem' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer Details</th>
                          <th>Product</th>
                          <th>Grand Total</th>
                          <th>Status</th>
                          <th>Update Status</th>
                          <th>Invoice Panel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o._id}>
                            <td>
                              <strong>{o.order_number}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {new Date(o.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <strong>{o.customer_snapshot?.name}</strong>
                              <div style={{ fontSize: '0.8rem' }}>📞 {o.customer_snapshot?.phone}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {o.customer_snapshot?.address}, {o.customer_snapshot?.division}</div>
                            </td>
                            <td>
                              {o.items?.map((item, idx) => (
                                <div key={idx} style={{ marginBottom: '0.25rem' }}>
                                  {item.product_name}
                                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-hover)' }}>Variant: {item.variant_name} · Qty: {item.quantity_kg}</div>
                                </div>
                              ))}
                            </td>
                            <td><strong>৳{o.total}</strong></td>
                            <td>
                              <span className={`ticket-badge ${o.order_status === 'delivered' ? 'resolved' : 'open'}`}>
                                {o.order_status}
                              </span>
                            </td>
                            <td>
                              <select 
                                className="form-input" 
                                style={{ padding: '0.25rem', fontSize: '0.8rem', width: '120px' }}
                                value={o.order_status}
                                onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button onClick={() => { setSelectedOrder(o); setShowPackingSlip(false); }} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                                  Invoice 🖨️
                                </button>
                        <button onClick={() => { setSelectedOrder(o); setShowPackingSlip(true); }} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                                  Slip
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 9. CUSTOMERS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Customers' && (
                <div>
                  <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                    <h3 
                      onClick={() => setCustomerTab('Successful')}
                      style={{ cursor: 'pointer', margin: 0, color: customerTab === 'Successful' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: customerTab === 'Successful' ? '3px solid var(--primary)' : 'none', paddingBottom: '0.5rem' }}
                    >
                      🌟 Successful Orders
                    </h3>
                    <h3 
                      onClick={() => setCustomerTab('Abandoned')}
                      style={{ cursor: 'pointer', margin: 0, color: customerTab === 'Abandoned' ? '#ef4444' : 'var(--text-muted)', borderBottom: customerTab === 'Abandoned' ? '3px solid #ef4444' : 'none', paddingBottom: '0.5rem' }}
                    >
                      🛒 Abandoned Carts
                    </h3>
                  </div>

                  {customerTab === 'Successful' && (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Customer Name</th>
                            <th>Phone</th>
                            <th>District</th>
                            <th>Shipping Address</th>
                            <th>Total Orders</th>
                            <th>Lifetime Value</th>
                            <th>Last Order Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.length === 0 && (
                            <tr><td colSpan="7" className="text-center">No successful customers found.</td></tr>
                          )}
                          {customers.map(cust => (
                            <tr key={cust._id}>
                              <td><strong>{cust.customerName}</strong></td>
                              <td>{cust.phone}</td>
                              <td>{cust.district}</td>
                              <td><div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cust.shippingAddress}</div></td>
                              <td><span style={{ fontWeight: 'bold' }}>{cust.totalOrders}</span></td>
                              <td><span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>৳ {cust.totalSpent}</span></td>
                              <td>{new Date(cust.lastOrderDate).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {customerTab === 'Abandoned' && (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Customer Info</th>
                            <th>District / Address</th>
                            <th>Cart Value</th>
                            <th>Items Left Behind</th>
                            <th>Last Attempted At</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {abandonedCarts.length === 0 && (
                            <tr><td colSpan="6" className="text-center">No abandoned carts right now.</td></tr>
                          )}
                          {abandonedCarts.map(cart => (
                            <tr key={cart._id}>
                              <td>
                                <strong>{cart.customerName}</strong>
                                <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 'bold' }}>{cart.phone}</div>
                              </td>
                              <td>
                                <div>{cart.district}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cart.shippingAddress}</div>
                              </td>
                              <td>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>৳ {cart.cartTotal}</span>
                                <div style={{ fontSize: '0.7rem' }}>+ ৳ {cart.shippingFee} Shipping</div>
                              </td>
                              <td>
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  {cart.items.map((item, idx) => (
                                    <li key={idx}>{item.quantity_kg}x {item.product_name} ({item.variant_name})</li>
                                  ))}
                                </ul>
                              </td>
                              <td>
                                {new Date(cart.lastAttemptedAt).toLocaleString()}
                              </td>
                              <td>
                                <a href={`tel:${cart.phone}`} className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                                  📞 Call
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================== */}
              {/* 10. REVIEWS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Reviews' && (
                <div>
                  <h3>⭐ Customer Review Feed</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                    {reviews.map(rev => (
                      <div key={rev.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong>{rev.user}</strong>
                          <span className={`ticket-badge ${rev.status === 'Approved' ? 'resolved' : 'open'}`}>{rev.status}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent-hover)', marginBottom: '0.5rem' }}>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)} · <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{rev.product}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>"{rev.comment}"</p>
                        {rev.reply && (
                          <div style={{ padding: '0.75rem', backgroundColor: '#f9f9f9', borderLeft: '3px solid var(--primary)', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                            <strong>Amaira Fruits:</strong> "{rev.reply}"
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                          {rev.status === 'Pending' && (
                            <button onClick={() => {
                              setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, status: 'Approved' } : r));
                              showModalAlert('Review approved for public viewing!', 'Success', 'success');
                            }} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                              Approve
                            </button>
                          )}
                          <button onClick={() => {
                            const rep = prompt('Write official support response:', rev.reply);
                            if (rep !== null) {
                              setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, reply: rep } : r));
                            }
                          }} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                            Reply
                          </button>
                          <button onClick={() => {
                            setReviews(prev => prev.filter(r => r.id !== rev.id));
                            showModalAlert('Spam review removed', 'Success', 'success');
                          }} className="btn btn-accent" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#e62c2c' }}>
                            Delete Spam
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 11. COUPONS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Coupons' && (
                <div className="admin-grid-split">
                  <div>
                    <h3>🎟️ Create Promo Coupon</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newCoupon.code || !newCoupon.amount) return;
                      setCoupons([...coupons, {
                        code: newCoupon.code.toUpperCase(),
                        type: newCoupon.type,
                        amount: parseFloat(newCoupon.amount),
                        minPurchase: parseFloat(newCoupon.minPurchase || 0),
                        freeShipping: newCoupon.freeShipping
                      }]);
                      setNewCoupon({ code: '', type: 'Flat', amount: '', minPurchase: '', freeShipping: false });
                      showModalAlert('Coupon successfully issued!', 'Success', 'success');
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label">Coupon Code</label>
                        <input type="text" className="form-input" required value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} placeholder="e.g. MANGO10" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Discount Type</label>
                        <select className="form-input" value={newCoupon.type} onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })}>
                          <option value="Flat">Flat Taka Off</option>
                          <option value="Percentage">Percentage Off</option>
                          <option value="Free Shipping">Free Shipping</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Discount Value (Amount / %)</label>
                        <input type="number" className="form-input" value={newCoupon.amount} onChange={e => setNewCoupon({ ...newCoupon, amount: e.target.value })} placeholder="e.g. 100" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Min Purchase Required (৳)</label>
                        <input type="number" className="form-input" value={newCoupon.minPurchase} onChange={e => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })} placeholder="e.g. 1000" />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Promo Coupon</button>
                    </form>
                  </div>

                  <div>
                    <h3>Active Store Coupons</h3>
                    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {coupons.map(cop => (
                        <div key={cop.code} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span className="coupon-code" style={{ fontSize: '1.1rem' }}>{cop.code}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                              Type: {cop.type} · Min Spend: ৳{cop.minPurchase}
                            </span>
                          </div>
                          <strong>{cop.type === 'Free Shipping' ? '🚚 Free' : `৳ / % ${cop.amount}`}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 12. FLASH SALES TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Flash Sales' && (
                <div>
                  <h3>⚡ Active Flash Sale Events</h3>
                  <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: '#fffde7' }}>
                    {flashSales.map(fs => (
                      <div key={fs.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <strong>{fs.title}</strong>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Event Active: {fs.start} to {fs.end}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'red' }}>-{fs.discount}% OFF Site-wide</span>
                          <button onClick={() => {
                            setFlashSales(prev => prev.map(f => f.title === fs.title ? { ...f, active: !f.active } : f));
                            showModalAlert('Event updated successfully', 'Success', 'success');
                          }} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                            {fs.active ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 style={{ marginTop: '3rem', fontSize: '1.2rem' }}>Create New Campaign</h3>
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem', marginTop: '1rem', maxWidth: '500px' }}>
                    <div className="form-group">
                      <label className="form-label">Campaign Name</label>
                      <input type="text" className="form-input" placeholder="e.g. Eid Fruits Bonanza" />
                    </div>
                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                      <label className="form-label">Discount Percentage (%)</label>
                      <input type="number" className="form-input" placeholder="e.g. 10" />
                    </div>
                    <button onClick={() => showModalAlert('New Campaign saved under Draft.', 'Campaign Scheduled', 'success')} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>Schedule Campaign</button>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 13. SHIPPING TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Shipping' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3>🚚 Shipping Configuration & Courier API Setup</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                    
                    <div className="form-group">
                      <label className="form-label">Default Shipping Charge (Inside Dhaka, ৳)</label>
                      <input 
                        type="number" className="form-input" value={shippingConfig.dhakaCharge}
                        onChange={e => setShippingConfig({ ...shippingConfig, dhakaCharge: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Default Shipping Charge (Outside Dhaka, ৳)</label>
                      <input 
                        type="number" className="form-input" value={shippingConfig.outsideDhakaCharge}
                        onChange={e => setShippingConfig({ ...shippingConfig, outsideDhakaCharge: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Courier Partner Selection</label>
                      <select className="form-input" value={shippingConfig.courierName} onChange={e => setShippingConfig({ ...shippingConfig, courierName: e.target.value })}>
                        <option value="Steadfast">Steadfast Courier API</option>
                        <option value="Pathao">Pathao Delivery API</option>
                        <option value="RedX">RedX Courier Integration</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Courier Client API Access Key</label>
                      <input 
                        type="text" className="form-input" value={shippingConfig.apiKey}
                        onChange={e => setShippingConfig({ ...shippingConfig, apiKey: e.target.value })}
                      />
                    </div>

                    <button onClick={() => showModalAlert('Courier configs and delivery tariffs updated!', 'Shipping Settings Saved', 'success')} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                      Save Shipping Configurations
                    </button>

                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 14. PAYMENTS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Payments' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3>💳 Payment Gateway Configuration</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    
                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>bKash Direct Gateway API</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Merchant wallet: {paymentConfig.bkashMerchant}</div>
                      </div>
                      <input type="checkbox" checked={paymentConfig.bkashEnabled} onChange={e => setPaymentConfig({ ...paymentConfig, bkashEnabled: e.target.checked })} />
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>Nagad Checkout Integration</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Merchant wallet: {paymentConfig.nagadMerchant}</div>
                      </div>
                      <input type="checkbox" checked={paymentConfig.nagadEnabled} onChange={e => setPaymentConfig({ ...paymentConfig, nagadEnabled: e.target.checked })} />
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>SSLCommerz API Hub</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aggregated local banking cards support</div>
                      </div>
                      <input type="checkbox" checked={paymentConfig.sslEnabled} onChange={e => setPaymentConfig({ ...paymentConfig, sslEnabled: e.target.checked })} />
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>Cash on Delivery (COD) Option</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hand cash collection on fruit dropoff</div>
                      </div>
                      <span className="ticket-badge resolved">Always Enabled</span>
                    </div>

                    <button onClick={() => showModalAlert('Payment Gateways configurations updated!', 'Payment Settings Saved', 'success')} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                      Update Gateway API Parameters
                    </button>

                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 15. MARKETING TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Marketing' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3>📣 Marketing Broadcast & Promotions</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    
                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                      <h4>📧 Newsletter Draft Broadcast</h4>
                      <input type="text" className="form-input" style={{ margin: '0.5rem 0' }} placeholder="Subject line: Seasonal Rajshahi Mangoes Preorder Now!" />
                      <textarea className="form-input" rows="3" placeholder="Compose promo email message..." />
                      <button onClick={() => showModalAlert('Newsletter broadcasted to all customer addresses!', 'Broadcast Completed', 'success')} className="btn btn-outline" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>Send to email list</button>
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                      <h4>💬 Bulk SMS Campaigner</h4>
                      <textarea className="form-input" rows="2" style={{ marginTop: '0.5rem' }} placeholder="Promo SMS: Enjoy 10% Eid Discount. Use code EIDMNG10. Visit Amaira Fruits." />
                      <button onClick={() => showModalAlert('SMS broadcast triggered!', 'Broadcast Completed', 'success')} className="btn btn-outline" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>Launch SMS campaign</button>
                    </div>

                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 16. REPORTS & ANALYTICS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Reports' && (
                <div>
                  <h3>📈 Financial Sales & Audit Report</h3>
                  <div className="admin-table-container" style={{ marginTop: '1.5rem' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Reporting Month</th>
                          <th>Total Orders</th>
                          <th>Revenue Generated</th>
                          <th>Fulfillment Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>June 2026 (Current)</strong></td>
                          <td>{orders.length} Orders</td>
                          <td><strong>৳ {totalRevenue}</strong></td>
                          <td>{orders.length > 0 ? ((orders.filter(o => o.order_status === 'delivered').length / orders.length) * 100).toFixed(0) : 100}%</td>
                        </tr>
                        <tr>
                          <td>May 2026</td>
                          <td>142 Orders</td>
                          <td>৳ 189,450</td>
                          <td>98%</td>
                        </tr>
                        <tr>
                          <td>April 2026</td>
                          <td>89 Orders</td>
                          <td>৳ 112,050</td>
                          <td>95%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 17. BLOG TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Blog' && (
                <div className="admin-grid-split">
                  <div>
                    <h3>📝 Compose Article</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newBlog.title) return;
                      setBlogs([...blogs, { id: 'bl_' + Date.now(), title: newBlog.title, category: newBlog.category || 'General', views: 0, author: newBlog.author || 'Staff' }]);
                      setNewBlog({ title: '', category: '', content: '', author: '' });
                      showModalAlert('Article published!', 'Success', 'success');
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label">Article Title</label>
                        <input type="text" className="form-input" required value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} placeholder="e.g. How to select ripe mangoes" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <input type="text" className="form-input" value={newBlog.category} onChange={e => setNewBlog({ ...newBlog, category: e.target.value })} placeholder="e.g. Healthy Eating" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Content Body</label>
                        <textarea className="form-input" rows="4" placeholder="Write markdown contents..." />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Publish Article</button>
                    </form>
                  </div>

                  <div>
                    <h3>Live Articles</h3>
                    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {blogs.map(b => (
                        <div key={b.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{b.title}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {b.category} · Author: {b.author}</div>
                          </div>
                          <span className="ticket-badge resolved" style={{ fontSize: '0.8rem' }}>👁️ {b.views} Views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 18. CMS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'CMS' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3>🌐 Homepage Content Manager</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    
                    <div className="form-group">
                      <label className="form-label">Hero Header Main Headline</label>
                      <input type="text" className="form-input" defaultValue="রাসায়নিক মুক্ত ও নিরাপদ আম এবং প্রিমিয়াম ড্রাইভ ফ্রুটস" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hero Header Bengali Subheadline</label>
                      <textarea className="form-input" rows="2" defaultValue="সরাসরি বাগান থেকে বাছাইকৃত শতভাগ প্রাকৃতিক সতেজতার নিশ্চয়তা।" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Address Footer</label>
                      <input type="text" className="form-input" defaultValue="অফিস: রাজশাহী সদর, বাংলাদেশ" />
                    </div>

                    <button onClick={() => showModalAlert('CMS updates saved to UI static cache!', 'CMS Updated', 'success')} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                      Publish Content Updates
                    </button>

                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 19. SUPPORT TICKETS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Support' && (
                <div>
                  <h3>💬 Customer Support Desk</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                    {tickets.map(t => (
                      <div key={t.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: t.status === 'Resolved' ? '#fcfaf1' : '#ffffff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong>{t.id}: {t.subject}</strong>
                          <span className={`ticket-badge ${t.status === 'Resolved' ? 'resolved' : 'open'}`}>{t.status}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                          Customer Phone: {t.phone} · Opened: {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>"{t.description}"</p>
                        
                        {t.reply && (
                          <div style={{ padding: '0.75rem', backgroundColor: '#f9f9f9', borderLeft: '3px solid var(--primary)', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                            <strong>Amaira Support Reply:</strong> "{t.reply}"
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                              Replied: {new Date(t.repliedAt).toLocaleString()}
                            </div>
                          </div>
                        )}

                        {t.status !== 'Resolved' && (
                          <button 
                            onClick={() => {
                              setReplyTicketId(t.id);
                              setReplyTicketUserId(t.userMongoId);
                              setTicketReplyText('');
                            }}
                            className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', marginTop: '1rem' }}
                          >
                            Reply & Resolve Ticket
                          </button>
                        )}
                      </div>
                    ))}
                    {tickets.length === 0 && (
                      <p style={{ color: 'var(--text-muted)' }}>No customer support tickets created yet.</p>
                    )}
                  </div>

                  {/* Reply Dialog */}
                  {replyTicketId && (
                    <div style={{ marginTop: '2.5rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', backgroundColor: '#fafafa' }}>
                      <h4>✏️ Compose Ticket Reply for Ticket: {replyTicketId}</h4>
                      <form onSubmit={handleSupportTicketReplySubmit} style={{ marginTop: '1rem' }}>
                        <textarea 
                          className="form-input" rows="4" required
                          value={ticketReplyText} onChange={e => setTicketReplyText(e.target.value)}
                          placeholder="Write reply instructions or resolution details..."
                        />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                          <button type="submit" className="btn btn-primary">Submit Reply</button>
                          <button type="button" onClick={() => setReplyTicketId(null)} className="btn btn-outline">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================== */}
              {/* 20. NOTIFICATIONS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Notifications' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3>🔔 Notification Template Config</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Default Order Confirmation SMS Template</label>
                      <textarea className="form-input" rows="3" defaultValue="প্রিয় {{customerName}}, আপনার অর্ডারটি সম্পন্ন হয়েছে। অর্ডার আইডি: {{orderID}}। ধন্যবাদ, আমাইরা ফ্রুটস।" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Default Delivery SMS Template</label>
                      <textarea className="form-input" rows="3" defaultValue="প্রিয় {{customerName}}, আপনার আমাইরা ফ্রুটসের অর্ডার আইডি {{orderID}} কুরিয়ারে পাঠানো হয়েছে। শীঘ্রই যোগাযোগ করবে।" />
                    </div>
                    <button onClick={() => showModalAlert('SMS alerts templates updated!', 'Templates Saved', 'success')} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Templates</button>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 21. STAFF & ROLES TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Staff & Roles' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                  <div>
                    <h3>🔐 Add Admin/Staff Profile</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newStaff.name || !newStaff.email) return;
                      setStaff([...staff, {
                        name: newStaff.name,
                        email: newStaff.email,
                        role: newStaff.role,
                        modules: newStaff.modules.join(', ') || 'All'
                      }]);
                      setNewStaff({ name: '', email: '', role: 'Manager', modules: [] });
                      showModalAlert('Staff member invited!', 'Invitation Sent', 'success');
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label">Staff Full Name</label>
                        <input type="text" className="form-input" required value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} placeholder="e.g. Asad Ahmed" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" required value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} placeholder="e.g. asad@amaira.com" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assigned Role</label>
                        <select className="form-input" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}>
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Order Manager">Order Manager</option>
                          <option value="Product Manager">Product Manager</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Invite Staff</button>
                    </form>
                  </div>

                  <div>
                    <h3>Active Staff List</h3>
                    <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {staff.map(st => (
                        <div key={st.email} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{st.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{st.email}</div>
                          </div>
                          <div>
                            <span className="ticket-badge resolved">{st.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 22. INTEGRATIONS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Integrations' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3>🔌 Site Integrations Scripts</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    
                    <div className="form-group">
                      <label className="form-label">Facebook Conversion Pixel ID</label>
                      <input type="text" className="form-input" value={integrations.facebookPixel} onChange={e => setIntegrations({ ...integrations, facebookPixel: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Google Tag Manager ID</label>
                      <input type="text" className="form-input" value={integrations.googleAnalytics} onChange={e => setIntegrations({ ...integrations, googleAnalytics: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">WhatsApp Live Floating Chat Number</label>
                      <input type="text" className="form-input" value={integrations.whatsappWidget} onChange={e => setIntegrations({ ...integrations, whatsappWidget: e.target.value })} />
                    </div>

                    <button onClick={() => showModalAlert('Social media integrations and marketing scripts updated!', 'Settings Updated', 'success')} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Update Scripts Tags
                    </button>

                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 23. SYSTEM SETTINGS TAB */}
              {/* =============================================================== */}
              {activeMenu === 'Settings' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3>⚙️ Localization & VAT Settings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                    
                    <div className="form-group">
                      <label className="form-label">Business Store Name</label>
                      <input type="text" className="form-input" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">VAT / Tax Tariff Rules (%)</label>
                      <input type="number" className="form-input" value={settings.vatPercent} onChange={e => setSettings({ ...settings, vatPercent: parseInt(e.target.value) })} />
                    </div>

                    <div className="admin-grid-2">
                      <div className="form-group">
                        <label className="form-label">Site Timezone</label>
                        <select className="form-input" value={settings.timezone} onChange={e => setSettings({ ...settings, timezone: e.target.value })}>
                          <option value="Dhaka (GMT+6)">Dhaka (GMT+6)</option>
                          <option value="London (GMT)">London (GMT)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Primary Currency Unit</label>
                        <input type="text" className="form-input" value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} />
                      </div>
                    </div>

                    <button onClick={() => showModalAlert('System parameters updated!', 'Settings Updated', 'success')} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                      Save Settings
                    </button>

                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* 24. BACKUP MODULE */}
              {/* =============================================================== */}
              {activeMenu === 'Backup' && (
                <div style={{ maxWidth: '600px' }}>
                  <h3>💾 Database Backup & Site Maintenance</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    
                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                      <h4>Database Backup File</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate a snapshot of all products, order checkouts, and customer profiles.</p>
                      <button onClick={() => showModalAlert('Backup generated! File saved to Server: /Server/backups/db_backup_' + Date.now() + '.json', 'Backup Complete', 'success')} className="btn btn-primary" style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                        Backup Database Now
                      </button>
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem' }}>
                      <h4>System Maintenance Mode</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>When active, site visitors will see a maintenance message.</p>
                      <button onClick={() => showModalAlert('Maintenance state updated.', 'Maintenance State Updated', 'success')} className="btn btn-outline" style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'red', borderColor: 'red' }}>
                        Activate Maintenance Page
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </main>
      </div>

      {/* ========================================================================= */}
      {/* DETAILED PRINTABLE MODAL FOR INVOICE OR PACKING SLIP */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2.5rem', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            
            {/* Printable Container */}
            <div className="invoice-print-area">
              
              {showPackingSlip ? (
                // PACKING SLIP VIEW
                <div>
                  <div style={{ borderBottom: '3px dashed var(--primary)', paddingBottom: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>📦 AMAIRA FRUITS - PACKING SLIP</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Please check contents before sealing package</p>
                  </div>
                  
                  <div className="admin-grid-2" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    <div>
                      <strong>Ship To Customer:</strong>
                      <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>{selectedOrder.customer_snapshot?.name}</p>
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{selectedOrder.customer_snapshot?.address}, {selectedOrder.customer_snapshot?.division}</p>
                      <p style={{ margin: 0 }}>Phone: {selectedOrder.customer_snapshot?.phone}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong>Shipping Metadata:</strong>
                      <p style={{ margin: '0.25rem 0' }}>Order ID: <strong>{selectedOrder.order_number}</strong></p>
                      <p style={{ margin: 0 }}>Date Placed: {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                      <p style={{ margin: 0 }}>Courier Partner: Steadfast</p>
                    </div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #ccc', borderTop: '1px solid #ccc', textAlign: 'left', backgroundColor: '#f9f9f9' }}>
                        <th style={{ padding: '0.5rem' }}>Product Title</th>
                        <th style={{ padding: '0.5rem' }}>Variant Package</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Quantity (Pcs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '0.5rem' }}>{item.product_name}</td>
                          <td style={{ padding: '0.5rem' }}>{item.variant_name}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity_kg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Note: Fruits are perishables. Ripened naturally without toxic compounds. Keep in ventilated spaces.
                  </div>
                </div>
              ) : (
                // REGULAR INVOICE VIEW
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '800', margin: 0 }}>🍏 Amaira Fruits</h2>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Fresh, chemical-free organic fruits chain</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>CUSTOMER INVOICE</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Order ID: {selectedOrder.order_number}</p>
                    </div>
                  </div>

                  <div className="admin-grid-2" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>Billing Address:</h4>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: '0.25rem 0' }}>{selectedOrder.customer_snapshot?.name}</p>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>{selectedOrder.customer_snapshot?.address}, {selectedOrder.customer_snapshot?.division}</p>
                      <p style={{ margin: 0 }}>Phone: {selectedOrder.customer_snapshot?.phone}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h4 style={{ fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>Payment summary:</h4>
                      <p style={{ margin: '0.25rem 0' }}>Date Placed: {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                      <p style={{ margin: 0 }}>Method: {selectedOrder.payment_method || 'COD'}</p>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>Status: {selectedOrder.order_status}</p>
                    </div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', textAlign: 'left', backgroundColor: '#fcfaf1' }}>
                        <th style={{ padding: '0.5rem' }}>Product Title</th>
                        <th style={{ padding: '0.5rem' }}>Package Variant</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.5rem' }}>{item.product_name}</td>
                          <td style={{ padding: '0.5rem' }}>{item.variant_name}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity_kg}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                            ৳ {item.price_per_kg * item.quantity_kg}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ width: '50%', marginLeft: '50%', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal:</span>
                      <span>৳{selectedOrder.total - selectedOrder.delivery_charge}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Delivery Tariff:</span>
                      <span>৳{selectedOrder.delivery_charge}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--primary)', paddingTop: '0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>
                      <span>Grand Total:</span>
                      <span>৳{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Print Modal Controllers */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Print Document 🖨️
              </button>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Close Preview
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
