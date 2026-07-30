'use client';

import React, { useState } from 'react';
import { PengeluaranItem } from '@/types/kas';

interface PengeluaranSectionProps {
  dataPengeluaranCloud: Record<string, PengeluaranItem>;
  statusAdmin: boolean;
  bukaLihatBukti: (url: string) => void;
  tambahPengeluaranCloud: (keperluan: string, kategori: string, nominal: number, fileBukti: File | null) => Promise<void>;
  editPengeluaranCloud: (id: string, keperluan: string, kategori: string, nominal: number, fileBukti: File | null, notaLama: string) => Promise<void>;
  hapusPengeluaranCloud: (id: string) => Promise<void>;
}

export default function PengeluaranSection({
  dataPengeluaranCloud,
  statusAdmin,
  bukaLihatBukti,
  tambahPengeluaranCloud,
  editPengeluaranCloud,
  hapusPengeluaranCloud
}: PengeluaranSectionProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [keperluan, setKeperluan] = useState('');
  const [kategori, setKategori] = useState('Operasional Kelas');
  const [nominal, setNominal] = useState('');
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const [notaLama, setNotaLama] = useState<string>('#');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEditId(null);
    setKeperluan('');
    setKategori('Operasional Kelas');
    setNominal('');
    setFileBukti(null);
    setNotaLama('#');
  };

  const handleEditClick = (item: PengeluaranItem) => {
    if (!item.id) return;
    setEditId(item.id);
    setKeperluan(item.keperluan);
    setKategori(item.kategori || 'Operasional Kelas');
    setNominal(item.nominal.toString());
    setNotaLama(item.nota || '#');
    setFileBukti(null);

    // Scroll smoothly to form
    const formEl = document.getElementById('admin-form-pengeluaran');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keperluan || !nominal) return;
    setLoading(true);
    try {
      if (editId) {
        await editPengeluaranCloud(editId, keperluan, kategori, parseInt(nominal) || 0, fileBukti, notaLama);
      } else {
        await tambahPengeluaranCloud(keperluan, kategori, parseInt(nominal) || 0, fileBukti);
      }
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="halaman-pengeluaran">
      {statusAdmin && (
        <div id="admin-form-pengeluaran" className="form-box">
          <h3>
            <i className={`fa-solid ${editId ? 'fa-pen-to-square' : 'fa-money-bill-transfer'}`}></i>{' '}
            {editId ? 'Edit Data Pengeluaran Kas (Bendahara)' : 'Input Pengeluaran Kas Baru (Bendahara)'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label className="form-label">Keperluan / Alokasi Belanja</label>
                <input
                  type="text"
                  placeholder="Contoh: Beli Spidol & Penghapus"
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Kategori Pengeluaran</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                >
                  <option value="Operasional Kelas">📚 Operasional Kelas</option>
                  <option value="Event & Lomba">🏆 Event & Lomba</option>
                  <option value="Kebersihan & Dekorasi">🧹 Kebersihan & Dekorasi</option>
                  <option value="Dana Darurat / Lainnya">🆘 Dana Darurat / Lainnya</option>
                </select>
              </div>
              <div>
                <label className="form-label">Nominal (Rupiah)</label>
                <input
                  type="number"
                  placeholder="Nominal (Rupiah)"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">
                  {editId ? 'Foto Nota Baru (Opsional, Ganti Nota)' : 'Foto Bukti Nota (Opsional)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileBukti(e.target.files ? e.target.files[0] : null)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '15px' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-success btn-auto"
              >
                {loading ? 'Memproses...' : editId ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-danger btn-auto"
                  style={{ background: 'var(--text-muted)' }}
                >
                  <i className="fa-solid fa-xmark"></i> Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="wrapper-tabel">
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Keperluan & Kategori</th>
              <th>Nominal</th>
              <th>Bukti</th>
              {statusAdmin && <th style={{ textAlign: 'center' }}>Aksi Admin</th>}
            </tr>
          </thead>
          <tbody>
            {Object.keys(dataPengeluaranCloud || {}).length === 0 ? (
              <tr>
                <td colSpan={statusAdmin ? 5 : 4} style={{ color: 'var(--text-muted)' }}>Belum ada riwayat pengeluaran kas kelas.</td>
              </tr>
            ) : (
              Object.keys(dataPengeluaranCloud).map(k => {
                let item = dataPengeluaranCloud[k];
                let itemId = item.id || k;
                let kat = item.kategori || "Operasional Kelas";
                return (
                  <tr key={itemId}>
                    <td data-label="Tanggal">{item.tanggal}</td>
                    <td className="kolom-nama" data-label="Keperluan">
                      {item.keperluan} <span className="badge-kategori">{kat}</span>
                    </td>
                    <td className="total-keluar" data-label="Nominal" style={{ fontWeight: 700 }}>
                      Rp {Number(item.nominal).toLocaleString('id-ID')}
                    </td>
                    <td data-label="Bukti">
                      {item.nota && item.nota !== '#' ? (
                        <button
                          className="btn-lihat-bukti"
                          onClick={() => bukaLihatBukti(item.nota!)}
                        >
                          <i className="fa-solid fa-chevron-right"></i> Lihat Bukti
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>–</span>
                      )}
                    </td>
                    {statusAdmin && (
                      <td data-label="Aksi Admin" style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            className="btn btn-sm btn-warning"
                            title="Edit Pengeluaran & Nota"
                            onClick={() => handleEditClick({ ...item, id: itemId })}
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              borderRadius: '6px',
                              background: '#f59e0b',
                              color: '#fff',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fa-solid fa-pen"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            title="Hapus Pengeluaran"
                            onClick={() => hapusPengeluaranCloud(itemId)}
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              borderRadius: '6px',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fa-solid fa-trash"></i> Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
