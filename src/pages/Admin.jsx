// src/pages/Admin.jsx
// Full admin panel powered by Supabase: Login -> Orders | Products | Settings

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
const COLORS = {
  bg: '#0d0d0d', panel: '#171717', border: '#2a2a2a',
  text: '#f5f5f5', muted: '#999', accent: '#e63946',
};

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) return null;
  if (!session) return <Login />;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.text, fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>New Shoe Zone — Admin</h1>
        <button onClick={() => supabase.auth.signOut()} style={ghostBtn}>Log out</button>
      </header>

      <nav style={{ display: 'flex', gap: 8, padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
        {['orders', 'products', 'settings'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...tabBtn, background: tab === t ? COLORS.accent : 'transparent', color: tab === t ? '#fff' : COLORS.muted }}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <main style={{ padding: 24 }}>
        {tab === 'orders' && <OrdersTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}

// ---------- Login ----------
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={submit} style={{ background: COLORS.panel, padding: 32, borderRadius: 12, width: 320, border: `1px solid ${COLORS.border}` }}>
        <h2 style={{ color: COLORS.text, marginTop: 0, fontFamily: 'sans-serif' }}>Admin Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, width: '100%', marginBottom: 10 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, width: '100%', marginBottom: 12 }} />
        {error && <p style={{ color: COLORS.accent, fontSize: 14 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ ...primaryBtn, width: '100%' }}>
          {loading ? 'Checking...' : 'Log in'}
        </button>
      </form>
    </div>
  );
}

// ---------- Orders Tab ----------
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  if (loading) return <p style={{ color: COLORS.muted }}>Loading orders...</p>;

  return (
    <div>
      <h2>Orders ({orders.length})</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadRow}>
              {['Order ID', 'Customer', 'Phone', 'Address', 'Product', 'Size/Color', 'Qty', 'Price', 'Status'].map((h) => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={td}>{o.order_id}</td>
                <td style={td}>{o.customer_name}<br /><small style={{ color: COLORS.muted }}>{o.email}</small></td>
                <td style={td}>{o.phone}</td>
                <td style={td}>{o.address}</td>
                <td style={td}>{o.product}</td>
                <td style={td}>{o.size} / {o.color}</td>
                <td style={td}>{o.quantity}</td>
                <td style={td}>{o.price}</td>
                <td style={td}>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} style={selectStyle}>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Products Tab ----------
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyProduct());

  function emptyProduct() {
    return { name: '', price: '', colors: '', sizes: '', stock: '', image_url: '', description: '' };
  }

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    await supabase.from('products').insert([{ ...form, price: Number(form.price), stock: Number(form.stock) || 0 }]);
    setForm(emptyProduct());
    setShowForm(false);
    fetchProducts();
  };

  const toggleActive = async (p) => {
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id);
    fetchProducts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Products ({products.length})</h2>
        <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>{showForm ? 'Cancel' : '+ Add Product'}</button>
      </div>

      {showForm && (
        <form onSubmit={addProduct} style={{ background: COLORS.panel, padding: 20, borderRadius: 10, marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, border: `1px solid ${COLORS.border}` }}>
          <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
          <input placeholder="Price (e.g. 2999)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} required />
          <input placeholder="Colors (comma separated)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} style={inputStyle} />
          <input placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} style={inputStyle} />
          <input placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={inputStyle} />
          <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} style={inputStyle} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / -1', minHeight: 60 }} />
          <button type="submit" style={{ ...primaryBtn, gridColumn: '1 / -1' }}>Save Product</button>
        </form>
      )}

      {loading ? <p style={{ color: COLORS.muted }}>Loading...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadRow}>{['Name', 'Price', 'Colors', 'Sizes', 'Stock', 'Active'].map((h) => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={td}>{p.name}</td>
                  <td style={td}>Rs. {p.price}</td>
                  <td style={td}>{p.colors}</td>
                  <td style={td}>{p.sizes}</td>
                  <td style={td}>{p.stock}</td>
                  <td style={td}>
                    <button onClick={() => toggleActive(p)} style={p.active ? primaryBtn : ghostBtn}>
                      {p.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- Settings Tab ----------
function SettingsTab() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const labels = {
    promo_banner_text: 'Promo Banner Text (top of site)',
    contact_email: 'Contact Email',
    contact_phone: 'Contact Phone',
    store_address: 'Store Address',
    whatsapp_number: 'WhatsApp Number',
    free_shipping_threshold: 'Free Shipping Above (Rs.)',
  };

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('settings').select('*');
    const map = {};
    (data || []).forEach((row) => { map[row.key] = row.value; });
    setSettings(map);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const save = async () => {
    setSaving(true);
    for (const key of Object.keys(labels)) {
      await supabase.from('settings').update({ value: settings[key] || '' }).eq('key', key);
    }
    setSaving(false);
    fetchSettings();
  };

  if (loading) return <p style={{ color: COLORS.muted }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Site Settings</h2>
      {Object.keys(labels).map((key) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, color: COLORS.muted, fontSize: 14 }}>{labels[key]}</label>
          <input value={settings[key] || ''} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} style={{ ...inputStyle, width: '100%' }} />
        </div>
      ))}
      <button onClick={save} disabled={saving} style={primaryBtn}>{saving ? 'Saving...' : 'Save Settings'}</button>
    </div>
  );
}

// ---------- Shared styles ----------
const primaryBtn = { background: COLORS.accent, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 14 };
const ghostBtn = { background: 'transparent', color: COLORS.text, border: `1px solid ${COLORS.border}`, padding: '10px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 14 };
const tabBtn = { border: 'none', padding: '8px 18px', borderRadius: 20, cursor: 'pointer', fontSize: 14 };
const inputStyle = { padding: 10, borderRadius: 6, border: `1px solid ${COLORS.border}`, background: '#0d0d0d', color: '#fff', boxSizing: 'border-box' };
const selectStyle = { padding: 6, borderRadius: 6, border: `1px solid ${COLORS.border}`, background: '#0d0d0d', color: '#fff' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 12 };
const theadRow = { background: COLORS.panel, textAlign: 'left' };
const th = { padding: '10px 12px', fontSize: 13, color: COLORS.muted };
const td = { padding: '10px 12px', fontSize: 14 };
