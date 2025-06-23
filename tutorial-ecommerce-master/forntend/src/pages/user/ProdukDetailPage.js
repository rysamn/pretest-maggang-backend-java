import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ProdukDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await api.get(`/api/produk/${id}`);
        setProduk(response.data);
      } catch (err) {
        setError('Produk tidak ditemukan.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, [id]);

  const tambahKeKeranjang = async () => {
    try {
      await api.post('/api/keranjangs', {
        produkId: produk.id,
        kuantitas: quantity
      });
      alert('Berhasil ditambahkan ke keranjang');
    } catch (err) {
      console.error('Gagal menambahkan:', err);
      alert('Gagal menambahkan ke keranjang');
    }
  };

  const handleBeliLangsung = async () => {
    await tambahKeKeranjang();
    navigate('/user/checkout');
  };

  if (loading) return <div className="text-center py-8">Memuat detail produk...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!produk) return <div className="text-center py-8">Produk tidak ditemukan.</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            src={produk.gambar || '/placeholder.jpg'} 
            alt={produk.nama}
            className="w-full rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{produk.nama}</h1>
          <p className="text-2xl text-blue-600 mb-4">Rp {produk.harga.toLocaleString('id-ID')}</p>
          <p className="text-gray-700 mb-6">{produk.deskripsi}</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={tambahKeKeranjang}
              className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
            >
              + Keranjang
            </button>
            <button
              onClick={handleBeliLangsung}
              className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdukDetailPage;
