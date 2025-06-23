import api from "./api";

export const createPesanan = async (data) => {
  return await api.post("/api/pesanans", data);
};

export const getPesananByUser = async () => {
  return await api.get("/api/pesanans"); // endpoint user
};

export const getPesananById = async (id) => {
  return await api.get(`/api/pesanans/${id}`);
};

export const konfirmasiPesanan = async (id) => {
  return await api.patch(`/api/pesanans/${id}/konfirmasi`);
};

export const batalkanPesanan = async (id) => {  // Changed parameter name to be consistent
  return await api.patch(`/api/pesanans/${id}/cancel`);
};

export const terimaPesanan = async (id) => {    // Changed parameter name to be consistent
  return await api.patch(`/api/pesanans/${id}/terima`);
};

export const packingPesanan = async (id) => {
  return await api.patch(`/api/pesanans/${id}/packing`);
};

export const kirimPesanan = async (id) => {
  return await api.patch(`/api/pesanans/${id}/kirim`);
};