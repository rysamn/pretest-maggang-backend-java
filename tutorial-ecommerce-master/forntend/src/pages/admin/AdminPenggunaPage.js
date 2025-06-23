import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminPenggunaPage = () => {
  const [penggunas, setPenggunas] = useState([]);

  useEffect(() => {
    fetchPenggunas();
  }, []);

  const fetchPenggunas = async () => {
    try {
      const response = await api.get("/api/penggunas");
      console.log(response.data);
      setPenggunas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna", error);
    }
  };

  return (
    <div className="admin-pengguna-container">
      <h1 className="admin-pengguna-title">Daftar Pengguna</h1>
      <table className="admin-pengguna-table">
        <thead>
          <tr className="admin-pengguna-table-header">
            <th>ID</th>
            <th>Nama</th> 
          </tr>
        </thead>
        <tbody>
          {penggunas.map((p) => (
            <tr key={p.id} className="admin-pengguna-table-row">
              <td>{p.id}</td>
              <td>{p.nama}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPenggunaPage;