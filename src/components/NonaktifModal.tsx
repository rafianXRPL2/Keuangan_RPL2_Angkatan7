'use client';

import React from 'react';
import { DAFTAR_SISWA } from '@/lib/constants';

interface NonaktifModalProps {
  show: boolean;
  onClose: () => void;
  siswaNonaktifCloud: Record<string, boolean>;
  namaSiswaCustomCloud: Record<string, string>;
  aktifkanSiswaKembali: (id: number) => void;
}

export default function NonaktifModal({
  show,
  onClose,
  siswaNonaktifCloud,
  namaSiswaCustomCloud,
  aktifkanSiswaKembali
}: NonaktifModalProps) {
  const namaTampil = (id: number) => {
    return (namaSiswaCustomCloud && namaSiswaCustomCloud[id]) || DAFTAR_SISWA[id - 1];
  };

  const nonaktifIds = Object.keys(siswaNonaktifCloud || {}).filter(id => siswaNonaktifCloud[id]).map(Number);

  return (
    <div className={`modal-overlay ${show ? 'show' : ''}`} onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: '420px', textAlign: 'left', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-user-slash" style={{ color: 'var(--danger)' }}></i> Siswa Nonaktif
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Disembunyikan dari tabel kas bulanan &amp; rekap, tapi data setoran lama tetap aman tersimpan.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1 }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px', paddingRight: '2px' }}>
          {nonaktifIds.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
              Tidak ada siswa nonaktif saat ini.
            </p>
          ) : (
            nonaktifIds.map(id => (
              <div key={id} className="riwayat-item">
                <div>
                  <div className="bulan">{namaTampil(id)}</div>
                  <div className="nominal">No Absen: #{id}</div>
                </div>
                <button
                  className="btn-hapus-sm aktifkan"
                  onClick={() => aktifkanSiswaKembali(id)}
                >
                  Aktifkan Lagi
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
