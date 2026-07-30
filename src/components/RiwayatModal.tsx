'use client';

import React from 'react';
import { URUTAN_BULAN, WAJIB_BAYAR } from '@/lib/constants';
import { MasterKasData } from '@/types/kas';

interface RiwayatModalProps {
  idSiswa: number | null;
  nama: string;
  masterDataCloud: MasterKasData;
  onClose: () => void;
  kirimWATagihanPersonal: (idSiswa: number) => void;
}

export default function RiwayatModal({
  idSiswa,
  nama,
  masterDataCloud,
  onClose,
  kirimWATagihanPersonal
}: RiwayatModalProps) {
  const show = idSiswa !== null;

  let totalSetahun = 0;
  let bulanLunas = 0;

  const listItems = idSiswa !== null ? URUTAN_BULAN.map(b => {
    let dataBulan = (masterDataCloud[b] && masterDataCloud[b][idSiswa]) || { m1: 0, m2: 0, m3: 0, m4: 0 };
    let totalBulan = (dataBulan.m1 || 0) + (dataBulan.m2 || 0) + (dataBulan.m3 || 0) + (dataBulan.m4 || 0);
    totalSetahun += totalBulan;
    let namaBulanSaja = b.split(" ")[0];
    let isLunas = totalBulan >= WAJIB_BAYAR;
    if (isLunas) bulanLunas++;

    return {
      bulan: namaBulanSaja,
      totalBulan,
      isLunas,
      isKurang: totalBulan > 0 && totalBulan < WAJIB_BAYAR
    };
  }) : [];

  return (
    <div className={`modal-overlay ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: '400px', textAlign: 'left', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--primary)' }}></i> Riwayat Setoran
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 700 }}>{nama || '-'}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1 }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', margin: '12px 0' }}>
          <div className="riwayat-stat-chip">
            <div className="label">Total Setor</div>
            <div className="value" style={{ color: 'var(--primary)' }}>
              Rp {totalSetahun.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="riwayat-stat-chip">
            <div className="label">Bulan Lunas</div>
            <div className="value" style={{ color: 'var(--success)' }}>
              {bulanLunas}/{URUTAN_BULAN.length}
            </div>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '2px' }}>
          {listItems.map((item, i) => (
            <div key={i} className="riwayat-item">
              <div>
                <div className="bulan">{item.bulan}</div>
                <div className="nominal">Rp {item.totalBulan.toLocaleString('id-ID')}</div>
              </div>
              {item.isLunas ? (
                <span className="badge badge-lunas">
                  <i className="fa-solid fa-circle-check"></i> Lunas
                </span>
              ) : (
                <span className="badge badge-nunggak">
                  <i className="fa-solid fa-circle-exclamation"></i> {item.isKurang ? 'Kurang' : 'Belum Setor'}
                </span>
              )}
            </div>
          ))}
        </div>

        {idSiswa !== null && (
          <button
            className="btn btn-success"
            style={{ marginTop: '12px', width: '100%' }}
            onClick={() => kirimWATagihanPersonal(idSiswa)}
          >
            <i className="fa-brands fa-whatsapp"></i> Kirim Tagihan WA Personal
          </button>
        )}
      </div>
    </div>
  );
}
