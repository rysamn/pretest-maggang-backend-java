import React, { useEffect, useState } from "react";
import MainPage from "../../components/MainPage";
import { useNavigate } from "react-router-dom";
import { findAllKategori } from "../../services/KategoriService";
import { createProduk } from "../../services/ProdukService";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { APP_BASE_URL } from "../../configs/constants";


const ProdukAdminCreatePage = () => {
    const [produk, setProduk] = useState({
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
    const navigate = useNavigate();
    const toastRef = React.useRef();

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await findAllKategori();
                setKategoris(response.data);
            } catch (error) {
                showError("Gagal memuat data kategori");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

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
            produk.stok >= 0 &&
            produk.gambar
        );
    };

    const saveProduk = async () => {
        setSubmitted(true);
        
        if (!validateForm()) {
            showError("Harap lengkapi semua field yang wajib diisi");
            return;
        }

        try {
            const response = await createProduk(produk);
            showSuccess("Produk berhasil ditambahkan");
            navigate(`/admin/produk/detail/${response.data.id}`);
        } catch (error) {
            showError("Gagal menambahkan produk");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <MainPage>
                <div className="loading-container">
                    <p>Memuat data...</p>
                </div>
            </MainPage>
        );
    }

    return (
        <MainPage>
            <Toast ref={toastRef} />
            <div className="admin-content">
                <div className="content-header">
                    <h1>Tambah Produk Baru</h1>
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
                                                <span>Preview Gambar</span>
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
                                        className={submitted && !produk.gambar ? 'p-invalid' : ''}
                                    />
                                    {submitted && !produk.gambar && (
                                        <small className="p-error">Gambar produk wajib diupload</small>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <Button
                                label="Simpan Produk"
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

export default ProdukAdminCreatePage;