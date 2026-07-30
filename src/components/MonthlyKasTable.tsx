'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DAFTAR_SISWA, URUTAN_BULAN, WAJIB_BAYAR } from '@/lib/constants';
import { MasterKasData } from '@/types/kas';

interface MonthlyKasTableProps {
  bulanAktif: string;
  setBulanAktif: (b: string) => void;
  masterDataCloud: MasterKasData;
  namaSiswaCustomCloud: Record<string, string>;
  siswaNonaktifCloud: Record<string, boolean>;
  statusAdmin: boolean;
  bukaRiwayatSiswa: (id: number) => void;
  editNamaSiswa: (id: number) => void;
  nonaktifkanSiswa: (id: number) => void;
  bukaModalSiswaNonaktif: () => void;
  salinTagihanWhatsApp: () => void;
  setorKasBatchLunas: (terpilih: number[]) => void;
  simpanDataKeCloudSingle: (bulan: string, id: number, m1: number, m2: number, m3: number, m4: number) => void;
}

export default function MonthlyKasTable({
  bulanAktif,
  setBulanAktif,
  masterDataCloud,
  namaSiswaCustomCloud,
  siswaNonaktifCloud,
  statusAdmin,
  bukaRiwayatSiswa,
  editNamaSiswa,
  nonaktifkanSiswa,
  bukaModalSiswaNonaktif,
  salinTagihanWhatsApp,
  setorKasBatchLunas,
  simpanDataKeCloudSingle
}: MonthlyKasTableProps) {
  const [cariSiswa, setCariSiswa] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const namaTampil = (id: number) => {
    return (namaSiswaCustomCloud && namaSiswaCustomCloud[id]) || DAFTAR_SISWA[id - 1];
  };

  const activeStudentIds = DAFTAR_SISWA.map((_, i) => i + 1).filter(id => !siswaNonaktifCloud[id]);
  const nonaktifCount = Object.keys(siswaNonaktifCloud || {}).filter(id => siswaNonaktifCloud[id]).length;

  const filteredStudentIds = activeStudentIds.filter(id => {
    const nama = namaTampil(id).toLowerCase();
    return nama.includes(cariSiswa.trim().toLowerCase());
  });

  const indeksBulanAktif = URUTAN_BULAN.indexOf(bulanAktif);
  let jumlahNunggak = 0;

  activeStudentIds.forEach(id => {
    let adaHutangBulanLalu = false;
    for (let i = 0; i < indeksBulanAktif; i++) {
      let bulanLalu = URUTAN_BULAN[i];
      let dataBulanLalu = (masterDataCloud[bulanLalu] && masterDataCloud[bulanLalu][id]) || { m1: 0, m2: 0, m3: 0, m4: 0 };
      let totalBulanLalu = (dataBulanLalu.m1 || 0) + (dataBulanLalu.m2 || 0) + (dataBulanLalu.m3 || 0) + (dataBulanLalu.m4 || 0);
      if (totalBulanLalu < WAJIB_BAYAR) {
        adaHutangBulanLalu = true;
        break;
      }
    }
    let dataBulanIni = (masterDataCloud[bulanAktif] && masterDataCloud[bulanAktif][id]) || { m1: 0, m2: 0, m3: 0, m4: 0 };
    let totalBulanIni = (dataBulanIni.m1 || 0) + (dataBulanIni.m2 || 0) + (dataBulanIni.m3 || 0) + (dataBulanIni.m4 || 0);

    if (totalBulanIni < WAJIB_BAYAR || adaHutangBulanLalu) {
      jumlahNunggak++;
    }
  });

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredStudentIds);
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectId = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCellBlur = (id: number, minggu: 'm1' | 'm2' | 'm3' | 'm4', valStr: string) => {
    if (!statusAdmin) return;
    const numVal = parseInt(valStr) || 0;
    const current = (masterDataCloud[bulanAktif] && masterDataCloud[bulanAktif][id]) || { m1: 0, m2: 0, m3: 0, m4: 0 };
    const m1 = minggu === 'm1' ? numVal : current.m1 || 0;
    const m2 = minggu === 'm2' ? numVal : current.m2 || 0;
    const m3 = minggu === 'm3' ? numVal : current.m3 || 0;
    const m4 = minggu === 'm4' ? numVal : current.m4 || 0;
    simpanDataKeCloudSingle(bulanAktif, id, m1, m2, m3, m4);
  };

  return (
    <div id="halaman-bulanan">
      <motion.div
        className="panel-kontrol"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="filter-grup">
          <label>PILIH BULAN DATA: </label>
          <select
            value={bulanAktif}
            onChange={(e) => setBulanAktif(e.target.value)}
          >
            {URUTAN_BULAN.map(b => (
              <option key={b} value={b}>{b.split(' ')[0]}</option>
            ))}
          </select>
        </div>

        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={cariSiswa}
            onChange={(e) => setCariSiswa(e.target.value)}
          />
        </div>

        {statusAdmin && (
          <>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="btn btn-neutral btn-auto admin-only-elemen"
              onClick={bukaModalSiswaNonaktif}
            >
              <i className="fa-solid fa-user-slash"></i> Nonaktif <span className="chip-angka">{nonaktifCount}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              className="btn btn-success btn-auto admin-only-elemen"
              onClick={() => setorKasBatchLunas(selectedIds)}
              title="Tandai Lunas M1-M4 untuk siswa yang dicentang"
            >
              <i className="fa-solid fa-check-double"></i> Batch Lunas
            </motion.button>
          </>
        )}

        <motion.button
          whileTap={{ scale: 0.96 }}
          className="btn btn-primary btn-auto"
          onClick={salinTagihanWhatsApp}
        >
          <i className="fa-solid fa-bullhorn"></i> Broadcast WA
        </motion.button>
      </motion.div>

      {jumlahNunggak > 0 && (
        <motion.div
          className="banner-notif"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>{jumlahNunggak} siswa belum lunas kas bulan ini.</span>
        </motion.div>
      )}

      <motion.div
        className="wrapper-tabel"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4 }}
      >
        <table>
          <thead>
            <tr>
              {statusAdmin && (
                <th style={{ width: '32px' }} className="admin-only-elemen">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredStudentIds.length && filteredStudentIds.length > 0}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    title="Pilih Semua"
                  />
                </th>
              )}
              <th style={{ width: '40px' }} className="col-no">No</th>
              <th>Nama Siswa</th>
              <th style={{ width: '80px' }}>M1</th>
              <th style={{ width: '80px' }}>M2</th>
              <th style={{ width: '80px' }}>M3</th>
              <th style={{ width: '80px' }}>M4</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '90px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudentIds.map((idSiswa, idx) => {
              const nama = namaTampil(idSiswa);
              const dataBulanIni = (masterDataCloud[bulanAktif] && masterDataCloud[bulanAktif][idSiswa]) || { m1: 0, m2: 0, m3: 0, m4: 0 };
              
              let adaHutangBulanLalu = false;
              for (let i = 0; i < indeksBulanAktif; i++) {
                let bulanLalu = URUTAN_BULAN[i];
                let dataBulanLalu = (masterDataCloud[bulanLalu] && masterDataCloud[bulanLalu][idSiswa]) || { m1: 0, m2: 0, m3: 0, m4: 0 };
                let totalBulanLalu = (dataBulanLalu.m1 || 0) + (dataBulanLalu.m2 || 0) + (dataBulanLalu.m3 || 0) + (dataBulanLalu.m4 || 0);
                if (totalBulanLalu < WAJIB_BAYAR) {
                  adaHutangBulanLalu = true;
                  break;
                }
              }

              const totalBulanIni = (dataBulanIni.m1 || 0) + (dataBulanIni.m2 || 0) + (dataBulanIni.m3 || 0) + (dataBulanIni.m4 || 0);
              const isLunas = totalBulanIni >= WAJIB_BAYAR && !adaHutangBulanLalu;

              return (
                <motion.tr
                  key={idSiswa}
                  className={!isLunas && statusAdmin ? 'baris-warning' : ''}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.3) }}
                >
                  {statusAdmin && (
                    <td className="admin-only-elemen">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(idSiswa)}
                        onChange={() => toggleSelectId(idSiswa)}
                      />
                    </td>
                  )}
                  <td className="col-no">{idSiswa}</td>
                  <td className="kolom-nama">
                    <span className="nama-klik" onClick={() => bukaRiwayatSiswa(idSiswa)}>
                      <span>{nama}</span>
                      <i className="fa-solid fa-chevron-right nama-klik-icon"></i>
                    </span>
                  </td>
                  <td
                    contentEditable={statusAdmin}
                    suppressContentEditableWarning
                    onBlur={(e) => handleCellBlur(idSiswa, 'm1', e.currentTarget.innerText)}
                    className={`editable ${statusAdmin ? 'aktif' : ''}`}
                    data-label="M1"
                  >
                    {dataBulanIni.m1 || 0}
                  </td>
                  <td
                    contentEditable={statusAdmin}
                    suppressContentEditableWarning
                    onBlur={(e) => handleCellBlur(idSiswa, 'm2', e.currentTarget.innerText)}
                    className={`editable ${statusAdmin ? 'aktif' : ''}`}
                    data-label="M2"
                  >
                    {dataBulanIni.m2 || 0}
                  </td>
                  <td
                    contentEditable={statusAdmin}
                    suppressContentEditableWarning
                    onBlur={(e) => handleCellBlur(idSiswa, 'm3', e.currentTarget.innerText)}
                    className={`editable ${statusAdmin ? 'aktif' : ''}`}
                    data-label="M3"
                  >
                    {dataBulanIni.m3 || 0}
                  </td>
                  <td
                    contentEditable={statusAdmin}
                    suppressContentEditableWarning
                    onBlur={(e) => handleCellBlur(idSiswa, 'm4', e.currentTarget.innerText)}
                    className={`editable ${statusAdmin ? 'aktif' : ''}`}
                    data-label="M4"
                  >
                    {dataBulanIni.m4 || 0}
                  </td>
                  <td data-label="Status">
                    {isLunas ? (
                      <span className="badge badge-lunas">
                        <i className="fa-solid fa-circle-check"></i> Lunas
                      </span>
                    ) : (
                      <span className="badge badge-nunggak">
                        <i className="fa-solid fa-circle-exclamation"></i> Nunggak
                      </span>
                    )}
                  </td>
                  <td className="kolom-aksi-siswa" data-label="Aksi">
                    {statusAdmin ? (
                      <div className="aksi-tombol">
                        <button
                          className="btn-aksi-icon edit"
                          onClick={(e) => { e.stopPropagation(); editNamaSiswa(idSiswa); }}
                          title="Edit nama"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="btn-aksi-icon hapus"
                          onClick={(e) => { e.stopPropagation(); nonaktifkanSiswa(idSiswa); }}
                          title="Nonaktifkan"
                        >
                          <i className="fa-solid fa-user-slash"></i>
                        </button>
                      </div>
                    ) : (
                      <span className="aksi-kosong">–</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
