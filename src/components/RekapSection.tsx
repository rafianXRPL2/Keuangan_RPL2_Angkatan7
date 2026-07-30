'use client';

import React, { useEffect, useRef } from 'react';
import { DAFTAR_SISWA, URUTAN_BULAN, WAJIB_BAYAR } from '@/lib/constants';
import { MasterKasData, PengeluaranItem } from '@/types/kas';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface RekapSectionProps {
  masterDataCloud: MasterKasData;
  dataPengeluaranCloud: Record<string, PengeluaranItem>;
  namaSiswaCustomCloud: Record<string, string>;
  siswaNonaktifCloud: Record<string, boolean>;
}

export default function RekapSection({
  masterDataCloud,
  dataPengeluaranCloud,
  namaSiswaCustomCloud,
  siswaNonaktifCloud
}: RekapSectionProps) {
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInstance = useRef<Chart | null>(null);
  const doughnutChartInstance = useRef<Chart | null>(null);

  const namaTampil = (id: number) => {
    return (namaSiswaCustomCloud && namaSiswaCustomCloud[id]) || DAFTAR_SISWA[id - 1];
  };

  const activeStudentIds = DAFTAR_SISWA.map((_, i) => i + 1).filter(id => !siswaNonaktifCloud[id]);

  const dataSiswaKolektif = activeStudentIds.map(id => {
    let totalSatuTahun = 0;
    let adaBulanBolong = false;

    URUTAN_BULAN.forEach(b => {
      let dataBulan = masterDataCloud[b] || {};
      let s = dataBulan[id] || {};
      let totalBulanIni = (s.m1 || 0) + (s.m2 || 0) + (s.m3 || 0) + (s.m4 || 0);
      totalSatuTahun += totalBulanIni;
      if (totalBulanIni < WAJIB_BAYAR) {
        adaBulanBolong = true;
      }
    });

    return {
      id,
      nama: namaTampil(id),
      total: totalSatuTahun,
      isNunggakKronis: adaBulanBolong
    };
  });

  const urutanSultan = [...dataSiswaKolektif].sort((a, b) => b.total - a.total).slice(0, 3);

  useEffect(() => {
    const labels = URUTAN_BULAN.map(b => b.split(' ')[0]);
    const dataPerBulan = URUTAN_BULAN.map(b => {
      let dataBulan = masterDataCloud[b] || {};
      let totalBulanIni = 0;
      Object.keys(dataBulan).forEach(id => {
        let s = dataBulan[id] || {};
        totalBulanIni += (s.m1 || 0) + (s.m2 || 0) + (s.m3 || 0) + (s.m4 || 0);
      });
      return totalBulanIni;
    });

    if (barChartRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      barChartInstance.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Kas Masuk',
            data: dataPerBulan,
            backgroundColor: '#1e293b',
            borderRadius: 6,
            maxBarThickness: 34
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { ticks: { callback: v => 'Rp ' + (Number(v) / 1000) + 'k' } }
          }
        }
      });
    }

    const kats: Record<string, number> = {
      "Operasional Kelas": 0,
      "Event & Lomba": 0,
      "Kebersihan & Dekorasi": 0,
      "Dana Darurat / Lainnya": 0
    };
    Object.keys(dataPengeluaranCloud || {}).forEach(k => {
      let p = dataPengeluaranCloud[k];
      let kat = p.kategori || "Operasional Kelas";
      if (kats[kat] !== undefined) kats[kat] += Number(p.nominal) || 0;
      else kats["Operasional Kelas"] += Number(p.nominal) || 0;
    });

    if (doughnutChartRef.current) {
      if (doughnutChartInstance.current) {
        doughnutChartInstance.current.destroy();
      }
      doughnutChartInstance.current = new Chart(doughnutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(kats),
          datasets: [{
            data: Object.values(kats),
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
          }
        }
      });
    }

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();
    };
  }, [masterDataCloud, dataPengeluaranCloud]);

  return (
    <div id="halaman-rekap">
      <div className="cards-container" style={{ marginBottom: '16px' }}>
        <div className="card-fitur">
          <h3>
            <i className="fa-solid fa-chart-column" style={{ color: 'var(--primary)' }}></i> Grafik Kas Masuk per Bulan
          </h3>
          <div style={{ position: 'relative', height: '220px' }}>
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>

        <div className="card-fitur">
          <h3>
            <i className="fa-solid fa-chart-pie" style={{ color: 'var(--warning)' }}></i> Kategori Pengeluaran Kas
          </h3>
          <div style={{ position: 'relative', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={doughnutChartRef}></canvas>
          </div>
        </div>
      </div>

      <div className="cards-container">
        <div className="card-fitur">
          <h3>
            <i className="fa-solid fa-crown" style={{ color: '#eab308' }}></i> Lencana Sultan Kas (Ter-Rajin)
          </h3>
          <div>
            {urutanSultan.map((s, idx) => (
              s.total > 0 && (
                <div key={s.id} className="sultan-item">
                  <span><b>#{idx + 1}</b> {s.nama}</span>
                  <span className="badge badge-sultan">
                    <i className="fa-solid fa-award"></i> Rp {s.total.toLocaleString('id-ID')}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      <div className="wrapper-tabel">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }} className="col-no">No</th>
              <th>Nama Siswa</th>
              <th>Total Setor (Seluruh Bulan)</th>
              <th>Status Global</th>
            </tr>
          </thead>
          <tbody>
            {dataSiswaKolektif.map((s, idx) => (
              <tr key={s.id}>
                <td className="col-no">{idx + 1}</td>
                <td className="kolom-nama">{s.nama}</td>
                <td><b>Rp {s.total.toLocaleString('id-ID')}</b></td>
                <td>
                  {s.isNunggakKronis ? (
                    <span className="badge badge-nunggak">
                      <i className="fa-solid fa-triangle-exclamation"></i> KURANG
                    </span>
                  ) : (
                    <span className="badge badge-lunas">
                      <i className="fa-solid fa-fire"></i> AMAN
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
