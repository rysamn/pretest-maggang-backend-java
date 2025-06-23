import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { findAllProduk } from "../../services/ProdukService";

const ProdukListPage = () => {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await findAllProduk();
        setProduk(response.data);
      } catch (err) {
        setError('Gagal memuat produk. Silakan coba lagi.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, []);

  const handleAddToCart = (produk) => {
    try {
      addToCart({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        gambar: produk.gambar,
        deskripsi: produk.deskripsi,
        kategori: produk.kategori,
        stok: produk.stok
      });
      alert('Produk berhasil ditambahkan ke keranjang');
    } catch (error) {
      alert('Gagal menambahkan produk ke keranjang');
    }
  };

  if (loading) return <div className="loading-container">Memuat produk...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="produk-list-container">
      <h1 className="produk-list-title">Daftar Produk</h1>
      
      <div className="produk-grid">
        {produk.map((item) => (
          <div key={item.id} className="produk-card">
            <Link to={`/user/produk/${item.id}`} className="produk-link">
              <img 
                src={`/api/images/${item.gambar}` || '/placeholder.jpg'} 
                alt={item.nama}
                className="produk-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.jpg';
                }}
              />
              <div className="produk-info">
                <h3 className="produk-name">{item.nama}</h3>
                <p className="produk-price">Rp {item.harga.toLocaleString('id-ID')}</p>
              </div>
            </Link>
            <button
              onClick={() => handleAddToCart(item)}
              className="add-to-cart-button"
            >
              + Keranjang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProdukListPage;