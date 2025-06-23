import React, { useEffect, useState, useRef } from "react";
import MainPage from "../../components/MainPage";
import { useParams, useNavigate } from "react-router-dom";
import { deleteProdukById, findProdukById } from "../../services/ProdukService";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { APP_BASE_URL } from "../../configs/constants";


const ProdukAdminDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toastRef = useRef();

    const [produk, setProduk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const loadProduk = async () => {
            try {
                const response = await findProdukById(id);
                const productData = response.data;
                setProduk(productData);
                
                if (productData.gambar) {
                    fetchImage(productData.gambar);
                }
            } catch (error) {
                showError("Gagal memuat detail produk");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadProduk();
    }, [id]);

    const showError = (message) => {
        toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        });
    };

    const showSuccess = (message) => {
        toastRef.current.show({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000
        });
    };

    const fetchImage = async (gambar) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(`${APP_BASE_URL}/api/images/${gambar}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });
            const imageBlob = await res.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setImagePreview(imageObjectURL);
        } catch (error) {
            console.error("Error loading image:", error);
        }
    };

    const confirmDelete = () => {
        confirmDialog({
            message: 'Apakah anda yakin akan menghapus produk ini?',
            header: 'Konfirmasi Penghapusan',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: handleDelete,
            rejectLabel: 'Batal',
            acceptLabel: 'Hapus'
        });
    };

    const handleDelete = async () => {
        try {
            await deleteProdukById(id);
            showSuccess('Produk berhasil dihapus');
            navigate("/admin/produk");
        } catch (error) {
            showError('Gagal menghapus produk');
            console.error(error);
        }
    };

    const hargaBodyTemplate = (harga) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(harga);
    };

    const stokBodyTemplate = (stok) => {
        const severity = stok > 5 ? 'success' : stok > 0 ? 'warning' : 'danger';
        return <Tag value={stok} severity={severity} />;
    };

    if (loading) {
        return (
            <MainPage>
                <div className="loading-container">
                    <p>Memuat detail produk...</p>
                </div>
            </MainPage>
        );
    }

    if (!produk) {
        return (
            <MainPage>
                <div className="error-container">
                    <p>Produk tidak ditemukan</p>
                </div>
            </MainPage>
        );
    }

    return (
        <MainPage>
            <Toast ref={toastRef} />
            <ConfirmDialog />
            
            <div className="admin-content">
                <div className="content-header">
                    <h1>Detail Produk</h1>
                    <div className="action-buttons">
                        <Button
                            label="Kembali"
                            icon="pi pi-arrow-left"
                            className="p-button-text"
                            onClick={() => navigate('/admin/produk')}
                        />
                        <Button
                            label="Edit"
                            icon="pi pi-pencil"
                            onClick={() => navigate(`/admin/produk/edit/${id}`)}
                        />
                        <Button
                            label="Hapus"
                            icon="pi pi-trash"
                            className="p-button-danger"
                            onClick={confirmDelete}
                        />
                    </div>
                </div>

                <div className="content-body">
                    <div className="card">
                        <div className="product-detail-container">
                            <div className="product-info">
                                <div className="detail-row">
                                    <span className="detail-label">Nama Produk:</span>
                                    <span className="detail-value">{produk.nama}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Kategori:</span>
                                    <span className="detail-value">
                                        <Tag value={produk.kategori.nama} className="kategori-badge" />
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Deskripsi:</span>
                                    <span className="detail-value">{produk.deskripsi}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Harga:</span>
                                    <span className="detail-value">{hargaBodyTemplate(produk.harga)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Stok:</span>
                                    <span className="detail-value">{stokBodyTemplate(produk.stok)}</span>
                                </div>
                            </div>

                            <div className="product-image">
                                {imagePreview ? (
                                    <img src={imagePreview} alt={produk.nama} className="image-preview" />
                                ) : (
                                    <div className="image-placeholder">
                                        <i className="pi pi-image"></i>
                                        <span>Gambar Produk</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainPage>
    );
};

export default ProdukAdminDetailPage;