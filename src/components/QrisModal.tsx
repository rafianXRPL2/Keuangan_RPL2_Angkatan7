'use client';

import React, { useState } from 'react';

interface QrisModalProps {
  show: boolean;
  onClose: () => void;
}

export default function QrisModal({ show, onClose }: QrisModalProps) {
  const [zoom, setZoom] = useState(false);

  return (
    <>
      <div
        id="modal-qris"
        className={`modal-overlay ${show ? 'show' : ''}`}
        onClick={onClose}
        style={{ overflowY: 'auto', padding: '20px 16px' }}
      >
        <div
          className="modal-box"
          style={{
            maxWidth: '420px',
            padding: '16px',
            maxHeight: '88vh',
            overflowY: 'auto',
            margin: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="qris-card">
            <div className="qris-card-header">
              <div className="qris-logo">
                QR<span>IS</span>
                <small>Standar Pembayaran Nasional</small>
              </div>
              <div className="qris-gpn">GPN</div>
            </div>
            <div className="qris-card-body">
              <div className="qris-merchant-name">Kas Kelas XI RPL 2</div>
              <div className="qris-nmid">Scan via DANA, GoPay, OVO, ShopeePay, m-Banking, dll</div>
              <div className="qris-img-wrap" onClick={() => setZoom(true)}>
                <img src="/qris.jpeg" alt="QRIS Kas Kelas" />
              </div>
              <div className="qris-zoom-hint">
                <i className="fa-solid fa-magnifying-glass-plus"></i> Ketuk gambar untuk perbesar
              </div>
              <div className="qris-nominal-chip">
                <i className="fa-solid fa-tag"></i> Nominal Minimum Rp 1.000
              </div>
              <div className="qris-tagline">SATU QRIS UNTUK SEMUA</div>
            </div>
          </div>

          <div className="qris-instruksi">
            <b>📌 Instruksi:</b>
            <ol>
              <li>Scan nominal minimal Rp1.000.</li>
              <li>Kirim SS bukti ke bendahara kelas biar status diubah ke Lunas di web ini.</li>
            </ol>
          </div>

          <div className="modal-btn-grup">
            <a className="btn btn-primary" href="/qris.jpeg" download="QRIS-Kas-XI-RPL2.jpeg">
              <i className="fa-solid fa-download"></i> Download QRIS
            </a>
            <button className="btn btn-danger" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>

      <div id="qris-zoom" className={`qris-zoom-overlay ${zoom ? 'show' : ''}`} onClick={() => setZoom(false)}>
        <img src="/qris.jpeg" alt="QRIS Kas Kelas (diperbesar)" />
        <p>
          <i className="fa-solid fa-xmark"></i> Ketuk di mana saja untuk menutup
        </p>
      </div>
    </>
  );
}
