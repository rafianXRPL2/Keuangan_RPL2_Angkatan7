'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FabContainerProps {
  setPindahHalaman: (target: string) => void;
  bukaQRIS: () => void;
  salinTagihanWhatsApp: () => void;
}

export default function FabContainer({
  setPindahHalaman,
  bukaQRIS,
  salinTagihanWhatsApp
}: FabContainerProps) {
  const [buka, setBuka] = useState(false);

  const toggleFAB = () => {
    setBuka(!buka);
  };

  const handleAction = (fn: () => void) => {
    fn();
    setBuka(false);
  };

  return (
    <div className="fab-container">
      <AnimatePresence>
        {buka && (
          <motion.div
            className="fab-menu buka"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="fab-item"
              whileHover={{ scale: 1.03, x: -2 }}
              onClick={() => handleAction(() => setPindahHalaman('bulanan'))}
            >
              <i className="fa-solid fa-chart-simple"></i> Data Bulanan
            </motion.div>

            <motion.div
              className="fab-item"
              whileHover={{ scale: 1.03, x: -2 }}
              onClick={() => handleAction(() => setPindahHalaman('rekap'))}
            >
              <i className="fa-solid fa-clipboard-list"></i> Rekap & Sultan
            </motion.div>

            <motion.div
              className="fab-item"
              whileHover={{ scale: 1.03, x: -2 }}
              onClick={() => handleAction(bukaQRIS)}
            >
              <i className="fa-solid fa-qrcode" style={{ color: 'var(--success)' }}></i> Scan QRIS Kelas
            </motion.div>

            <motion.div
              className="fab-item"
              whileHover={{ scale: 1.03, x: -2 }}
              onClick={() => handleAction(salinTagihanWhatsApp)}
            >
              <i className="fa-solid fa-bullhorn" style={{ color: 'var(--primary)' }}></i> Broadcast WA
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`fab-main ${buka ? 'aktif' : ''}`}
        onClick={toggleFAB}
        title="Menu Cepat"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.08 }}
        animate={{ rotate: buka ? 135 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <i className="fa-solid fa-plus"></i>
      </motion.button>
    </div>
  );
}
