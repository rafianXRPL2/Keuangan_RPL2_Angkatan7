'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DashboardHeroProps {
  saldoMasuk: number;
  saldoKeluar: number;
  saldoSisa: number;
  terakhirDiperbarui: string;
}

export default function DashboardHero({
  saldoMasuk,
  saldoKeluar,
  saldoSisa,
  terakhirDiperbarui
}: DashboardHeroProps) {
  return (
    <>
      <motion.div
        className="halaman-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>
          <i className="fa-solid fa-chart-line"></i> Sistem Monitoring Kas XI RPL 2
        </h1>
        <p>
          <span className="live-dot"></span>Sinkronisasi data transparan &amp; realtime cloud &bull;{' '}
          <span style={{ opacity: 0.85, fontSize: '0.78rem' }}>
            <i className="fa-solid fa-clock-rotate-left"></i> Terakhir diperbarui: <span>{terakhirDiperbarui || 'Realtime'}</span>
          </span>
        </p>
      </motion.div>

      <div className="dashboard-ringkasan">
        <motion.div
          className="saldo-hero"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="saldo-hero-pattern"></div>
          <div className="saldo-hero-backlight"></div>

          <div className="saldo-hero-top">
            <div className="saldo-hero-label">
              <span className="saldo-hero-icon">
                <i className="fa-solid fa-wallet"></i>
              </span>{' '}
              Sisa Saldo Kas Sekarang
            </div>
          </div>

          <motion.div
            className="saldo-hero-value total-sisa"
            key={saldoSisa}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Rp {saldoSisa.toLocaleString('id-ID')}
          </motion.div>

          <div className="saldo-hero-sub">Saldo bersih setelah dikurangi seluruh pengeluaran kelas</div>
        </motion.div>

        <div className="cards-ringkas">
          <motion.div
            className="card-ringkas masuk"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -3 }}
          >
            <div className="card-ringkas-pattern"></div>
            <div className="card-backlight"></div>
            <span className="card-ringkas-icon">
              <i className="fa-solid fa-arrow-down"></i>
            </span>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h4>Total Kas Masuk</h4>
              <p className="total-masuk">
                Rp {saldoMasuk.toLocaleString('id-ID')}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="card-ringkas keluar"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            whileHover={{ y: -3 }}
          >
            <div className="card-ringkas-pattern"></div>
            <div className="card-backlight"></div>
            <span className="card-ringkas-icon">
              <i className="fa-solid fa-arrow-up"></i>
            </span>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h4>Total Pengeluaran</h4>
              <p className="total-keluar">
                Rp {saldoKeluar.toLocaleString('id-ID')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
