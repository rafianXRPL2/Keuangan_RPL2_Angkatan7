'use client';

import React, { useState } from 'react';

interface AdminLoginModalProps {
  show: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
}

export default function AdminLoginModal({ show, onClose, onLogin }: AdminLoginModalProps) {
  const [pw, setPw] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(pw);
    setPw('');
  };

  return (
    <div className={`modal-overlay ${show ? 'show' : ''}`} onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="modal-box"
        style={{ maxWidth: '360px', textAlign: 'left' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i> Otoritas Bendahara
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Masukkan kode rahasia akses bendahara untuk mengaktifkan fitur edit data cloud.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">PASSWORD AKSES:</label>
          <input
            type="password"
            style={{ width: '100%' }}
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-btn-grup">
          <button type="button" className="btn btn-neutral" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary">
            Masuk Mode Edit
          </button>
        </div>
      </form>
    </div>
  );
}
