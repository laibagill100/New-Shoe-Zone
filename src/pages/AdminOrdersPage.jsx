import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, Package } from 'lucide-react';

const STATUS_STYLES = {
  pending: 'bg-yellow-500/15 text-yellow-500',
  confirmed: 'bg-green-500/15 text-green-500',
  delivered: 'bg-blue-500/15 text-blue-500',
  cancelled: 'bg-destructive/15 text-destructive',
};

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      setOrders(JSON.parse(localStorage.getItem('nsz-orders') || '[]'));
    } catch {
      setOrders([]);
    }
  }, []);

  const deleteOrder = useCallback((id) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== id);
      localStorage.setItem('nsz-orders', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    if (!window.confirm('Delete all captured orders? This cannot be undone.')) return;
    setOrders([]);
    localStorage.setItem('nsz-orders', '[]');
  }, []);

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <Helmet>
        <title>Orders — New Shoe Zone Admin</title>
        <meta name="description" content="Captured customer orders for New Shoe Zone." />
      </Helmet>

      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={14} /> Back to Store
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">Orders</h1>
          <p className="mt-3 text-sm text-muted-foreground">Captured delivery details from checkout (with Mobile 1 &amp; Mobile 2).</p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={clearAll}
            className="border border-destructive px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            Clear All
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="font-display text-xl uppercase">No orders yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Customer orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Mobile 1</th>
                <th className="px-3 py-3">Mobile 2</th>
                <th className="px-3 py-3">City</th>
                <th className="px-3 py-3">Items</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border align-top">
                  <td className="px-3 py-4 font-mono text-xs text-foreground">{o.id}</td>
                  <td className="px-3 py-4 text-xs text-muted-foreground">{fmtDate(o.date)}</td>
                  <td className="px-3 py-4">
                    <p className="font-bold text-foreground">{o.name}</p>
                    {o.email && <p className="text-xs text-muted-foreground">{o.email}</p>}
                    <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">{o.address}</p>
                  </td>
                  <td className="px-3 py-4 font-semibold text-foreground">{o.phone1}</td>
                  <td className="px-3 py-4 text-foreground">{o.phone2 || '—'}</td>
                  <td className="px-3 py-4 text-foreground">{o.city}</td>
                  <td className="px-3 py-4">
                    <ul className="space-y-1">
                      {o.items.map((it, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">{it.title}</span>
                          {it.size && <span> · Size {it.size}</span>}
                          <span> × {it.quantity}</span>
                          <span className="block text-gold">{it.price}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-3 py-4 font-display text-base text-gold">{o.total}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-block rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[o.status] || STATUS_STYLES.pending}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <button
                      onClick={() => deleteOrder(o.id)}
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Delete order ${o.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
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

export default AdminOrdersPage;
