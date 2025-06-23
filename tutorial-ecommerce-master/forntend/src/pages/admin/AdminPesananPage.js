import React, { useEffect, useState } from "react";
import {
  konfirmasiPesanan,
  packingPesanan,
  kirimPesanan,
} from "../../services/PesananService";
import api from "../../services/api";


const AdminPesananPage = () => {
  const [pesanans, setPesanans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPesanans();
  }, []);

  const fetchPesanans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/pesanans/admin");
      setPesanans(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan admin", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAksi = async (aksi, id) => {
    try {
      if (aksi === "konfirmasi") await konfirmasiPesanan(id);
      else if (aksi === "packing") await packingPesanan(id);
      else if (aksi === "kirim") await kirimPesanan(id);

      fetchPesanans(); // Refresh data setelah aksi
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-pesanan-container">
        <div className="loading-indicator">Memuat data pesanan...</div>
      </div>
    );
  }

  return (
    <div className="admin-pesanan-container">
      <h1 className="admin-pesanan-title">Daftar Semua Pesanan</h1>
      
      <div className="table-responsive">
        <table className="pesanan-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tanggal</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pesanans.length > 0 ? (
              pesanans.map((p) => (
                <tr key={p.id}>
                  <td className="truncate">{p.id}</td>
                  <td>{formatDate(p.tanggal)}</td>
                  <td>{formatCurrency(p.total)}</td>
                  <td>
                    <span className={`status-badge ${p.statusPesanan.toLowerCase()}`}>
                      {p.statusPesanan}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {p.statusPesanan === "DRAFT" && (
                      <button
                        onClick={() => handleAksi("konfirmasi", p.id)}
                        className="btn-konfirmasi"
                      >
                        Konfirmasi
                      </button>
                    )}
                    {p.statusPesanan === "PEMBAYARAN" && (
                      <button
                        onClick={() => handleAksi("packing", p.id)}
                        className="btn-packing"
                      >
                        Packing
                      </button>
                    )}
                    {p.statusPesanan === "PACKING" && (
                      <button
                        onClick={() => handleAksi("kirim", p.id)}
                        className="btn-kirim"
                      >
                        Kirim
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  Tidak ada data pesanan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPesananPage;