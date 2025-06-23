import React, { useEffect, useState } from 'react';
import { getPesananByUser } from '../../services/PesananService';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getPesananByUser();
        // Add default status if missing
        const processedOrders = response.data.map(order => ({
          ...order,
          statusPesanan: order.statusPesanan || 'Menunggu Konfirmasi'
        }));
        setOrders(processedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Gagal memuat riwayat pesanan. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Menunggu Konfirmasi': 'bg-yellow-100 text-yellow-800',
      'Diproses': 'bg-blue-100 text-blue-800',
      'Dikirim': 'bg-purple-100 text-purple-800',
      'Selesai': 'bg-green-100 text-green-800',
      'Dibatalkan': 'bg-red-100 text-red-800'
    };
    
    const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
    const statusClass = statusClasses[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`${baseClass} ${statusClass}`}>
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>
        <p className="text-gray-600 mt-2">Daftar semua pesanan yang pernah Anda buat</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada pesanan</h3>
          <p className="mt-1 text-gray-500">Pesanan yang Anda buat akan muncul di sini.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center">
                      <p className="text-lg font-medium text-blue-600">#{order.nomor}</p>
                      <div className="ml-3">
                        {getStatusBadge(order.statusPesanan)}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(order.waktuPesan)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      Rp {order.total.toLocaleString('id-ID')}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 truncate max-w-xs">
                      {order.alamatPengiriman}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;