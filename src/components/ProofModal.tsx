'use client';

import React from 'react';

interface ProofModalProps {
  url: string | null;
  onClose: () => void;
}

export default function ProofModal({ url, onClose }: ProofModalProps) {
  if (!url) return null;

  return (
    <div className="qris-zoom-overlay show" onClick={onClose}>
      <img src={url} alt="Bukti transaksi (diperbesar)" />
      <p>
        <i className="fa-solid fa-xmark"></i> Ketuk di mana saja untuk menutup
      </p>
    </div>
  );
}
