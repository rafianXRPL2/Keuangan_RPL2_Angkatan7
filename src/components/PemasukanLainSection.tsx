'use client';

import React, { useState } from 'react';
import { PemasukanLainItem } from '@/types/kas';

interface PemasukanLainSectionProps {
  dataPemasukanLainCloud: Record<string, PemasukanLainItem>;
  statusAdmin: boolean;
  bukaLihatBukti: (url: string) => void;
  tambahPemasukanLainCloud: (sumber: string, nominal: number, fileBukti: File | null) => Promise<void>;
  hapusPemasukanLain: (key: string) => void;
}

export default function PemasukanLainSection({
  dataPemasukanLainCloud,
  statusAdmin,
  bukaLihatBukti,
  tambahPemasukanLainCloud,
  hapusPemasukanLain
}: PemasukanLainSectionProps) {
  const [sumber, setSumber] = useState('');
  const [nominal, setNominal] = useState('');
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sumber || !nominal) return;
    setLoading(true);
    try {
      await tambahPemasukanLainCloud(sumber, parseInt(nominal) || 0, fileBukti);
      setSumber('');
      setNominal('');
      setFileBukti(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="halaman-pemasukan-lain">
      {statusAdmin && (
        <div id="admin-form-pemasukan-lain" className="form-box">
          <h3>
            <i className="fa-solid fa-circle-dollar-to-slot"></i> Input Pemasukan Tak Terduga / Lain-lain (Bendahara)
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label className="form-label">Sumber / Detail Pemasukan</label>
                <input
                  type="text"
                  placeholder="Contoh: Hadiah Juara Futsal / Sisa Dana Dana Usaha"
                  value={sumber}
                  onChange={(e) => setSumber(e.target.value)}
                  required
                />
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
                <label className="form-label">Foto Bukti (Opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileBukti(e.target.files ? e.target.files[0] : null)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success btn-auto"
            >
              {loading ? 'Mengupload...' : 'Simpan Pemasukan'}
            </button>
          </form>
        </div>
      )}

      <div className="wrapper-tabel">
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Sumber / Detail Pemasukan</th>
              <th>Nominal</th>
              <th>Bukti</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(dataPemasukanLainCloud || {}).length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: 'var(--text-muted)' }}>Belum ada riwayat pemasukan tak terduga luar.</td>
              </tr>
            ) : (
              Object.keys(dataPemasukanLainCloud).map(k => {
                let item = dataPemasukanLainCloud[k];
                return (
                  <tr key={k}>
                    <td data-label="Tanggal">{item.tanggal}</td>
                    <td className="kolom-nama" data-label="Sumber">💰 {item.sumber}</td>
                    <td className="total-masuk" data-label="Nominal" style={{ fontWeight: 700 }}>
                      Rp {Number(item.nominal).toLocaleString('id-ID')}
                    </td>
                    <td data-label="Bukti">
                      {item.bukti && item.bukti !== '#' ? (
                        <button
                          className="btn-lihat-bukti"
                          onClick={() => bukaLihatBukti(item.bukti!)}
                        >
                          <i className="fa-solid fa-chevron-right"></i> Lihat Bukti
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>–</span>
                      )}
                    </td>
                    <td data-label="Aksi">
                      {statusAdmin ? (
                        <button
                          className="btn-hapus-sm"
                          onClick={() => hapusPemasukanLain(k)}
                        >
                          Hapus
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
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
