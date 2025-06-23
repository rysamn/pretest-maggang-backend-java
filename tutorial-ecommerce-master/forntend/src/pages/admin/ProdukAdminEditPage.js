import React, { useEffect, useState, useRef } from "react";
import MainPage from "../../components/MainPage";
import { useNavigate, useParams } from "react-router-dom";
import { findAllKategori } from "../../services/KategoriService";
import { findProdukById, updateProduk } from "../../services/ProdukService";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { APP_BASE_URL } from "../../configs/constants";

const ProdukAdminEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toastRef = useRef();

    const [produk, setProduk] = useState({
        id: null,
        nama: "",
        gambar: "",
        kategori: { id: null },
        deskripsi: "",
        stok: 0,
        harga: 0
    });
    const [kategoris, setKategoris] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load categories
                const kategoriResponse = await findAllKategori();
                setKategoris(kategoriResponse.data);

                // Load product data
                const produkResponse = await findProdukById(id);
                const productData = produkResponse.data;
                setProduk(productData);

                // Load product image if exists
                if (productData.gambar) {
                    fetchImage(productData.gambar);
                }
            } catch (error) {
                showError("Gagal memuat data produk");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
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

    const handleInputChange = (field, value) => {
        setProduk(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleKategoriChange = (value) => {
        setProduk(prev => ({
            ...prev,
            kategori: { id: value }
        }));
    };

    const onUpload = (event) => {
        const [file] = event.files;
        const imageObjectURL = URL.createObjectURL(file);
        setImagePreview(imageObjectURL);
        const response = JSON.parse(event.xhr.response);
        handleInputChange('gambar', response.fileName);
    };

    const onBeforeSend = (event) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.token) {
            event.xhr.setRequestHeader("Authorization", "Bearer " + user.token);
        }
    };

    const validateForm = () => {
        return (
            produk.nama &&
            produk.kategori.id &&
            produk.harga > 0 &&
            produk.stok >= 0
        );
    };

    const saveProduk = async () => {
        setSubmitted(true);
        
        if (!validateForm()) {
            showError("Harap lengkapi semua field yang wajib diisi");
            return;
        }

        try {
            await updateProduk(produk);
            showSuccess("Produk berhasil diperbarui");
            navigate(`/admin/produk/detail/${produk.id}`);
        } catch (error) {
            showError("Gagal memperbarui produk");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <MainPage>
                <div className="loading-container">
                    <p>Memuat data produk...</p>
                </div>
            </MainPage>
        );
    }

    return (
        <MainPage>
            <Toast ref={toastRef} />
            <div className="admin-content">
                <div className="content-header">
                    <h1>Edit Produk</h1>
                    <Button
                        label="Kembali"
                        icon="pi pi-arrow-left"
                        className="p-button-text"
                        onClick={() => navigate('/admin/produk')}
                    />
                </div>

                <div className="content-body">
                    <div className="card">
                        <div className="form-container">
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="nama">Nama Produk*</label>
                                    <InputText
                                        id="nama"
                                        value={produk.nama}
                                        onChange={(e) => handleInputChange('nama', e.target.value)}
                                        className={submitted && !produk.nama ? 'p-invalid' : ''}
                                    />
                                    {submitted && !produk.nama && (
                                        <small className="p-error">Nama produk wajib diisi</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="kategori">Kategori*</label>
                                    <Dropdown
                                        id="kategori"
                                        value={produk.kategori.id}
                                        options={kategoris}
                                        optionLabel="nama"
                                        optionValue="id"
                                        onChange={(e) => handleKategoriChange(e.value)}
                                        placeholder="Pilih Kategori"
                                        className={submitted && !produk.kategori.id ? 'p-invalid' : ''}
                                    />
                                    {submitted && !produk.kategori.id && (
                                        <small className="p-error">Kategori wajib dipilih</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="harga">Harga (Rp)*</label>
                                    <InputNumber
                                        id="harga"
                                        value={produk.harga}
                                        onValueChange={(e) => handleInputChange('harga', e.value)}
                                        mode="currency"
                                        currency="IDR"
                                        locale="id-ID"
                                        className={submitted && produk.harga <= 0 ? 'p-invalid' : ''}
                                    />
                                    {submitted && produk.harga <= 0 && (
                                        <small className="p-error">Harga harus lebih dari 0</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stok">Stok*</label>
                                    <InputNumber
                                        id="stok"
                                        value={produk.stok}
                                        onValueChange={(e) => handleInputChange('stok', e.value)}
                                        min={0}
                                        className={submitted && produk.stok < 0 ? 'p-invalid' : ''}
                                    />
                                    {submitted && produk.stok < 0 && (
                                        <small className="p-error">Stok tidak boleh negatif</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="deskripsi">Deskripsi</label>
                                    <InputText
                                        id="deskripsi"
                                        value={produk.deskripsi}
                                        onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="image-column">
                                <div className="image-upload-container">
                                    <div className="image-preview">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview Produk" />
                                        ) : (
                                            <div className="image-placeholder">
                                                <i className="pi pi-image"></i>
                                                <span>Gambar Produk</span>
                                            </div>
                                        )}
                                    </div>
                                    <FileUpload
                                        name="file"
                                        url={`${APP_BASE_URL}/api/uploadImage`}
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        onUpload={onUpload}
                                        onBeforeSend={onBeforeSend}
                                        chooseLabel="Pilih Gambar"
                                        mode="basic"
                                        auto
                                    />
                                    {submitted && !produk.gambar && (
                                        <small className="p-error">Gambar produk wajib diupload</small>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <Button
                                label="Simpan Perubahan"
                                icon="pi pi-check"
                                onClick={saveProduk}
                            />
                            <Button
                                label="Batal"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={() => navigate('/admin/produk')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainPage>
    );
};

export default ProdukAdminEditPage;