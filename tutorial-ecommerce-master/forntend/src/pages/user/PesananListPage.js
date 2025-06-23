import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPesananByUser, batalkanPesanan, konfirmasiPesanan, terimaPesanan } from '../../services/PesananService';

const PesananListPage = () => {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const response = await getPesananByUser();
        setPesanan(response.data);
      } catch (err) {
        setError('Gagal memuat pesanan. Silakan coba lagi.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPesanan();
  }, []);

  const handleBatalkan = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      try {
        await batalkanPesanan(id);
        setPesanan(pesanan.map(p => p.id === id ? {...p, status: 'dibatalkan'} : p));
      } catch (error) {
        alert('Gagal membatalkan pesanan');
      }
    }
  };

  const handleKonfirmasi = async (id) => {
    try {
      await konfirmasiPesanan(id);
      setPesanan(pesanan.map(p => p.id === id ? {...p, status: 'dikonfirmasi'} : p));
    } catch (error) {
      alert('Gagal mengkonfirmasi pembayaran');
    }
  };

  const handleTerima = async (id) => {
    try {
      await terimaPesanan(id);
      setPesanan(pesanan.map(p => p.id === id ? {...p, status: 'selesai'} : p));
    } catch (error) {
      alert('Gagal mengonfirmasi penerimaan pesanan');
    }
  };

  if (loading) return <div className="loading-container">Memuat pesanan...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="pesanan-container">
      <h1 className="page-title">Daftar Pesanan</h1>
      
      {pesanan.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">Anda belum memiliki pesanan</p>
          <Link to="/user/produk" className="shop-button">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="pesanan-table">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pesanan.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {new Date(order.tanggal).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td>Rp {order.total.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <Link to={`/user/pesanan/${order.id}`} className="detail-button">
                      Detail
                    </Link>
                    
                    {order.status === 'menunggu_pembayaran' && (
                      <button
                        onClick={() => handleKonfirmasi(order.id)}
                        className="confirm-button"
                      >
                        Konfirmasi
                      </button>
                    )}
                    
                    {order.status === 'dikirim' && (
                      <button
                        onClick={() => handleTerima(order.id)}
                        className="receive-button"
                      >
                        Terima
                      </button>
                    )}
                    
                    {['menunggu_pembayaran', 'diproses'].includes(order.status) && (
                      <button
                        onClick={() => handleBatalkan(order.id)}
                        className="cancel-button"
                      >
                        Batalkan
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
  );
};

export default PesananListPage;