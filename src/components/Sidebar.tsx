'use client';

import React from 'react';

interface SidebarProps {
  halamanSekarang: string;
  setPindahHalaman: (target: string) => void;
  statusAdmin: boolean;
  bukaModalLoginAdmin: () => void;
  bukaQRIS: () => void;
  temaGelap: boolean;
  toggleTemaGelap: () => void;
  mobileBuka: boolean;
  toggleSidebarMobile: () => void;
}

export default function Sidebar({
  halamanSekarang,
  setPindahHalaman,
  statusAdmin,
  bukaModalLoginAdmin,
  bukaQRIS,
  temaGelap,
  toggleTemaGelap,
  mobileBuka,
  toggleSidebarMobile
}: SidebarProps) {
  const handleNav = (target: string) => {
    setPindahHalaman(target);
    if (window.innerWidth <= 768 && mobileBuka) {
      toggleSidebarMobile();
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileBuka ? 'buka' : ''}`}
        onClick={toggleSidebarMobile}
      />

      <aside className={mobileBuka ? 'buka' : ''}>
        <div className="sidebar-header">
          <div className="sidebar-header-icon">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <h1>XI RPL 2</h1>
          <p>Sistem Kas Terintegrasi</p>
        </div>

        <div className="sidebar-menu">
          <div className="menu-label">Monitoring Kas</div>
          <button
            className={`btn btn-tab ${halamanSekarang === 'bulanan' ? 'aktif' : ''}`}
            onClick={() => handleNav('bulanan')}
          >
            <i className="fa-solid fa-chart-simple"></i> Data Bulanan
          </button>
          <button
            className={`btn btn-tab ${halamanSekarang === 'rekap' ? 'aktif' : ''}`}
            onClick={() => handleNav('rekap')}
          >
            <i className="fa-solid fa-clipboard-list"></i> Rekap & Sultan
          </button>

          <div className="menu-label">Keuangan & Alokasi</div>
          <button
            className={`btn btn-tab ${halamanSekarang === 'pemasukan-lain' ? 'aktif' : ''}`}
            onClick={() => handleNav('pemasukan-lain')}
          >
            <i className="fa-solid fa-hand-holding-dollar"></i> Pemasukan Lain-lain
          </button>
          <button
            className={`btn btn-tab ${halamanSekarang === 'pengeluaran' ? 'aktif' : ''}`}
            onClick={() => handleNav('pengeluaran')}
          >
            <i className="fa-solid fa-money-bill-wave"></i> Pengeluaran & Nota
          </button>
          <button
            className={`btn btn-tab ${halamanSekarang === 'anggaran' ? 'aktif' : ''}`}
            onClick={() => handleNav('anggaran')}
          >
            <i className="fa-solid fa-thumbtack"></i> Rencana Anggaran
          </button>
          <button
            className={`btn btn-tab ${halamanSekarang === 'kalender' ? 'aktif' : ''}`}
            onClick={() => handleNav('kalender')}
          >
            <i className="fa-solid fa-calendar-days"></i> Agenda & Kalender
          </button>

          <div className="menu-label">Interaksi & Aksi</div>
          <button className="btn btn-qris" onClick={bukaQRIS}>
            <i className="fa-solid fa-qrcode"></i> Scan QRIS Kelas
          </button>
          <button
            className={`btn btn-tab ${halamanSekarang === 'saran' ? 'aktif' : ''}`}
            onClick={() => handleNav('saran')}
          >
            <i className="fa-solid fa-envelope-open-text"></i> Kotak Suara Anonim
          </button>

          <div className="menu-label">Pengaturan Tampilan</div>
          <div style={{ padding: '0 12px', marginBottom: '10px' }}>
            <div className="theme-switch" onClick={toggleTemaGelap}>
              <span className="theme-switch-label">
                <i className="fa-solid fa-circle-half-stroke"></i> {temaGelap ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span className="theme-switch-track">
                <span className="theme-switch-thumb">
                  <i className={`fa-solid ${temaGelap ? 'fa-moon' : 'fa-sun'}`}></i>
                </span>
              </span>
            </div>
          </div>

          <div className="menu-label" style={{ marginTop: 'auto' }}>Otoritas</div>
          <button
            className={`btn btn-admin ${statusAdmin ? 'aktif' : ''}`}
            onClick={bukaModalLoginAdmin}
          >
            <i className={`fa-solid ${statusAdmin ? 'fa-lock-open' : 'fa-lock'}`}></i>
            {statusAdmin ? 'Keluar Admin' : 'Mode Bendahara'}
          </button>
        </div>
      </aside>
    </>
  );
}
