import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainPage from "../../components/MainPage";
import { findAllProduk } from "../../services/ProdukService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";


const ProdukAdminListPage = () => {
    const [produks, setProduks] = useState([]);
    const [loading, setLoading] = useState(true);
    const toastRef = React.useRef();

    useEffect(() => {
        const loadProduks = async () => {
            try {
                const response = await findAllProduk();
                setProduks(response.data);
            } catch (error) {
                showError("Gagal memuat data produk");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadProduks();
    }, []);

    const showError = (message) => {
        toastRef.current.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        });
    };

    const namaBodyTemplate = (rowData) => {
        return (
            <Link to={`/admin/produk/detail/${rowData.id}`} className="product-link">
                {rowData.nama}
            </Link>
        );
    };

    const kategoriBodyTemplate = (rowData) => {
        return (
            <Tag value={rowData.kategori.nama} className="kategori-badge" />
        );
    };

    const hargaBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(rowData.harga);
    };

    const stokBodyTemplate = (rowData) => {
        const severity = rowData.stok > 5 ? 'success' : rowData.stok > 0 ? 'warning' : 'danger';
        return (
            <Tag value={rowData.stok} severity={severity} />
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="action-buttons">
                <Link to={`/admin/produk/edit/${rowData.id}`}>
                    <Button 
                        icon="pi pi-pencil" 
                        className="p-button-rounded p-button-text edit-button"
                        tooltip="Edit"
                        tooltipOptions={{position: 'top'}}
                    />
                </Link>
                <Link to={`/admin/produk/detail/${rowData.id}`}>
                    <Button 
                        icon="pi pi-eye" 
                        className="p-button-rounded p-button-text view-button"
                        tooltip="Detail"
                        tooltipOptions={{position: 'top'}}
                    />
                </Link>
            </div>
        );
    };

    return (
        <MainPage>
            <Toast ref={toastRef} />
            <div className="admin-content">
                <div className="content-header">
                    <h1>Daftar Produk</h1>
                    <Link to="/admin/produk/create">
                        <Button 
                            label="Tambah Produk" 
                            icon="pi pi-plus" 
                            className="add-button"
                        />
                    </Link>
                </div>

                <div className="content-body">
                    <div className="card">
                        <DataTable
                            value={produks}
                            loading={loading}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            emptyMessage="Tidak ada data produk"
                            className="p-datatable-sm"
                        >
                            <Column 
                                field="nama" 
                                header="Nama Produk" 
                                body={namaBodyTemplate}
                                sortable
                            />
                            <Column 
                                field="kategori.nama" 
                                header="Kategori" 
                                body={kategoriBodyTemplate}
                                sortable
                            />
                            <Column 
                                field="harga" 
                                header="Harga" 
                                body={hargaBodyTemplate}
                                style={{ width: '150px' }}
                                sortable
                            />
                            <Column 
                                field="stok" 
                                header="Stok" 
                                body={stokBodyTemplate}
                                style={{ width: '120px' }}
                                sortable
                            />
                            <Column 
                                body={actionBodyTemplate}
                                header="Aksi"
                                style={{ width: '120px' }}
                                exportable={false}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </MainPage>
    );
};

export default ProdukAdminListPage;