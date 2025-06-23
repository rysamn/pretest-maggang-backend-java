import React, { useEffect, useState } from "react";
import MainPage from "../../components/MainPage";
import { createKategori, deleteKategoriById, findAllKategori, updateKategori } from "../../services/KategoriService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";


const KategoriAdminPage = () => {
    const [kategoris, setKategoris] = useState([]);
    const [kategoriDialog, setKategoriDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInsertMode, setIsInsertMode] = useState(false);
    const toastRef = React.useRef();

    const emptyKategori = {
        id: null,
        nama: ""
    };

    const [kategori, setKategori] = useState(emptyKategori);

    useEffect(() => {
        loadKategoris();
    }, []);

    const loadKategoris = async () => {
        setIsLoading(true);
        try {
            const response = await findAllKategori();
            setKategoris(response.data);
        } catch (error) {
            showError("Gagal memuat data kategori");
        } finally {
            setIsLoading(false);
        }
    };

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

    const openNew = () => {
        setKategori(emptyKategori);
        setIsInsertMode(true);
        setKategoriDialog(true);
        setSubmitted(false);
    };

    const hideDialog = () => {
        setKategoriDialog(false);
        setSubmitted(false);
    };

    const editKategori = (kategori) => {
        setKategori({...kategori});
        setIsInsertMode(false);
        setKategoriDialog(true);
        setSubmitted(false);
    };

    const confirmDelete = (kategori) => {
        confirmDialog({
            message: `Apakah anda yakin akan menghapus kategori ${kategori.nama}?`,
            header: 'Konfirmasi Penghapusan',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Hapus',
            rejectLabel: 'Batal',
            accept: () => deleteKategori(kategori.id),
            acceptClassName: 'p-button-danger'
        });
    };

    const saveKategori = async () => {
        setSubmitted(true);
        
        if (!kategori.nama.trim()) {
            return;
        }

        try {
            if (isInsertMode) {
                await createKategori(kategori);
                showSuccess('Kategori berhasil ditambahkan');
            } else {
                await updateKategori(kategori);
                showSuccess('Kategori berhasil diperbarui');
            }
            
            loadKategoris();
            hideDialog();
        } catch (error) {
            showError(`Gagal ${isInsertMode ? 'menambahkan' : 'memperbarui'} kategori`);
        }
    };

    const deleteKategori = async (id) => {
        try {
            await deleteKategoriById(id);
            showSuccess('Kategori berhasil dihapus');
            loadKategoris();
        } catch (error) {
            showError('Gagal menghapus kategori');
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="action-buttons">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-plain edit-button"
                    onClick={() => editKategori(rowData)}
                    tooltip="Edit"
                    tooltipOptions={{position: 'top'}}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-plain delete-button"
                    onClick={() => confirmDelete(rowData)}
                    tooltip="Hapus"
                    tooltipOptions={{position: 'top'}}
                />
            </div>
        );
    };

    return (
        <MainPage>
            <Toast ref={toastRef} />
            <ConfirmDialog />
            
            <div className="admin-content">
                <div className="content-header">
                    <h1>Kategori</h1>
                    <Button
                        label="Tambah Kategori"
                        icon="pi pi-plus"
                        className="add-button"
                        onClick={openNew}
                    />
                </div>

                <div className="content-body">
                    <div className="card">
                        <DataTable
                            value={kategoris}
                            loading={isLoading}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            emptyMessage="Tidak ada data kategori"
                        >
                            <Column field="nama" header="Nama Kategori" sortable />
                            <Column 
                                body={actionBodyTemplate}
                                header="Aksi"
                                style={{ width: '120px' }}
                                exportable={false}
                            />
                        </DataTable>
                    </div>
                </div>

                <Dialog
                    visible={kategoriDialog}
                    style={{ width: '450px' }}
                    header={isInsertMode ? 'Tambah Kategori' : 'Edit Kategori'}
                    modal
                    className="p-fluid"
                    onHide={hideDialog}
                    footer={
                        <div>
                            <Button
                                label="Batal"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={hideDialog}
                            />
                            <Button
                                label="Simpan"
                                icon="pi pi-check"
                                className="p-button-text"
                                onClick={saveKategori}
                            />
                        </div>
                    }
                >
                    <div className="p-field">
                        <label htmlFor="nama">Nama Kategori</label>
                        <InputText
                            id="nama"
                            value={kategori.nama}
                            onChange={(e) => setKategori({...kategori, nama: e.target.value})}
                            required
                            autoFocus
                            className={submitted && !kategori.nama ? 'p-invalid' : ''}
                        />
                        {submitted && !kategori.nama && (
                            <small className="p-error">Nama kategori harus diisi</small>
                        )}
                    </div>
                </Dialog>
            </div>
        </MainPage>
    );
};

export default KategoriAdminPage;