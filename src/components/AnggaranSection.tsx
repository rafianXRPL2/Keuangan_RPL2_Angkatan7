'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnggaranItem, TargetDanaItem } from '@/types/kas';

interface AnggaranSectionProps {
  dataAnggaranCloud: Record<string, AnggaranItem>;
  dataTargetDanaCloud: Record<string, TargetDanaItem>;
  statusAdmin: boolean;
  tambahAnggaranCloud: (kegiatan: string, estimasi: number) => void;
  tambahTargetDanaCloud: (nama: string, target: number, terkumpul: number) => void;
  updateTargetTerkumpul: (key: string, nominalLama: number) => void;
  hapusTargetDana: (key: string) => void;
  hapusAnggaran: (key: string) => void;
}

export default function AnggaranSection({
  dataAnggaranCloud,
  dataTargetDanaCloud,
  statusAdmin,
  tambahAnggaranCloud,
  tambahTargetDanaCloud,
  updateTargetTerkumpul,
  hapusTargetDana,
  hapusAnggaran
}: AnggaranSectionProps) {
  const [kegiatan, setKegiatan] = useState('');
  const [estimasi, setEstimasi] = useState('');

  const [targetNama, setTargetNama] = useState('');
  const [targetNominal, setTargetNominal] = useState('');
  const [targetTerkumpul, setTargetTerkumpul] = useState('');

  const handleSubAnggaran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegiatan || !estimasi) return;
    tambahAnggaranCloud(kegiatan, parseInt(estimasi) || 0);
    setKegiatan('');
    setEstimasi('');
  };

  const handleSubTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNama || !targetNominal) return;
    tambahTargetDanaCloud(targetNama, parseInt(targetNominal) || 0, parseInt(targetTerkumpul) || 0);
    setTargetNama('');
    setTargetNominal('');
    setTargetTerkumpul('');
  };

  const targetKeys = Object.keys(dataTargetDanaCloud || {});

  return (
    <div id="halaman-anggaran">
      {/* Target Tabungan Event Kelas */}
      <motion.div
        className="card-fitur"
        style={{ marginBottom: '16px' }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.4 }}
      >
        <h3>
          <i className="fa-solid fa-bullseye" style={{ color: 'var(--gold-2)' }}></i> Target Tabungan &amp; Penggalangan Dana Class Event
        </h3>
        <div id="container-target-dana" style={{ marginTop: '12px' }}>
          {targetKeys.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
              Belum ada target tabungan event / penggalangan dana aktif.
            </p>
          ) : (
            targetKeys.map((k, idx) => {
              let item = dataTargetDanaCloud[k];
              let persen = Math.min(100, Math.round((item.terkumpul / item.target) * 100)) || 0;
              return (
                <motion.div
                  key={k}
                  className="card-target-item"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-bullseye" style={{ color: 'var(--gold-2)' }}></i> {item.nama}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Target: <b>Rp {item.target.toLocaleString('id-ID')}</b> | Terkumpul: <b style={{ color: 'var(--success)' }}>Rp {item.terkumpul.toLocaleString('id-ID')}</b>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span className="chip-angka" style={{ background: 'var(--primary)', fontSize: '0.75rem', padding: '3px 8px' }}>
                        {persen}%
                      </span>
                      {statusAdmin && (
                        <>
                          <button
                            className="btn-aksi-icon edit"
                            onClick={() => updateTargetTerkumpul(k, item.terkumpul)}
                            title="Edit Terkumpul"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            className="btn-aksi-icon hapus"
                            onClick={() => hapusTargetDana(k)}
                            title="Hapus"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="progress-bar-track">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${persen}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    ></motion.div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {statusAdmin && (
        <>
          <motion.div
            id="admin-form-target-dana"
            className="form-box"
            style={{ marginBottom: '16px' }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <h3>
              <i className="fa-solid fa-plus"></i> Tambah Target Tabungan Baru (Bendahara)
            </h3>
            <form onSubmit={handleSubTarget}>
              <div className="form-grid">
                <div>
                  <label className="form-label">Nama Target / Event</label>
                  <input
                    type="text"
                    placeholder="Contoh: Beli Kipas Angin Dinding"
                    value={targetNama}
                    onChange={(e) => setTargetNama(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Target Nominal (Rupiah)</label>
                  <input
                    type="number"
                    placeholder="Nominal Target"
                    value={targetNominal}
                    onChange={(e) => setTargetNominal(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Nominal Terkumpul Saat Ini</label>
                  <input
                    type="number"
                    placeholder="Nominal Terkumpul awal"
                    value={targetTerkumpul}
                    onChange={(e) => setTargetTerkumpul(e.target.value)}
                  />
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.96 }} type="submit" className="btn btn-success btn-auto">
                Simpan Target Tabungan
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            id="admin-form-anggaran"
            className="form-box"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <h3>
              <i className="fa-solid fa-circle-plus"></i> Tambah Rencana Anggaran Kelas
            </h3>
            <form onSubmit={handleSubAnggaran}>
              <div className="form-grid">
                <div>
                  <label className="form-label">Rencana Alokasi / Kegiatan Kelas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sewa Baju Karnaval"
                    value={kegiatan}
                    onChange={(e) => setKegiatan(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Estimasi Biaya</label>
                  <input
                    type="number"
                    placeholder="Estimasi Biaya"
                    value={estimasi}
                    onChange={(e) => setEstimasi(e.target.value)}
                    required
                  />
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.96 }} type="submit" className="btn btn-success btn-auto">
                Tambah Rencana
              </motion.button>
            </form>
          </motion.div>
        </>
      )}

      <motion.div
        className="wrapper-tabel"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <table>
          <thead>
            <tr>
              <th>Rencana Alokasi / Kegiatan Kelas</th>
              <th>Estimasi Biaya</th>
              <th>Status Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(dataAnggaranCloud || {}).length === 0 ? (
              <tr>
                <td colSpan={3} style={{ color: 'var(--text-muted)' }}>Belum ada daftar rancangan anggaran kegiatan kelas.</td>
              </tr>
            ) : (
              Object.keys(dataAnggaranCloud).map((k, idx) => {
                let item = dataAnggaranCloud[k];
                return (
                  <motion.tr
                    key={k}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                  >
                    <td className="kolom-nama" data-label="Kegiatan">📌 {item.kegiatan}</td>
                    <td data-label="Estimasi" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      Rp {Number(item.estimasi).toLocaleString('id-ID')}
                    </td>
                    <td data-label="Aksi">
                      {statusAdmin ? (
                        <button
                          className="btn-hapus-sm"
                          onClick={() => hapusAnggaran(k)}
                        >
                          Hapus
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
