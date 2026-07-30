'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { DAFTAR_SISWA, URUTAN_BULAN, KEY_VALIDASI, WAJIB_BAYAR } from '@/lib/constants';
import {
  MasterKasData, PengeluaranItem, PemasukanLainItem,
  AnggaranItem, TargetDanaItem, AgendaItem
} from '@/types/kas';
import { showToast, showAlert, showConfirm } from '@/lib/swal';
import {
  createAdminJwtToken, verifyAdminJwtToken,
  setAdminCookie, removeAdminCookie, getAdminCookie
} from '@/lib/auth';

import Sidebar from '@/components/Sidebar';
import DashboardHero from '@/components/DashboardHero';
import MonthlyKasTable from '@/components/MonthlyKasTable';
import RekapSection from '@/components/RekapSection';
import PemasukanLainSection from '@/components/PemasukanLainSection';
import PengeluaranSection from '@/components/PengeluaranSection';
import AnggaranSection from '@/components/AnggaranSection';
import KalenderSection from '@/components/KalenderSection';
import SaranSection from '@/components/SaranSection';
import QrisModal from '@/components/QrisModal';
import RiwayatModal from '@/components/RiwayatModal';
import AdminLoginModal from '@/components/AdminLoginModal';
import ProofModal from '@/components/ProofModal';
import NonaktifModal from '@/components/NonaktifModal';
import FabContainer from '@/components/FabContainer';

export default function Home() {
  const [halamanSekarang, setHalamanSekarang] = useState('bulanan');
  const [bulanAktif, setBulanAktif] = useState('Agustus 2025');
  const [statusAdmin, setStatusAdmin] = useState(false);
  const [temaGelap, setTemaGelap] = useState(false);
  const [mobileBuka, setMobileBuka] = useState(false);
  const [loadingCloud, setLoadingCloud] = useState(true);

  // Supabase Realtime Cloud States
  const [masterDataCloud, setMasterDataCloud] = useState<MasterKasData>({});
  const [dataPengeluaranCloud, setDataPengeluaranCloud] = useState<Record<string, PengeluaranItem>>({});
  const [dataPemasukanLainCloud, setDataPemasukanLainCloud] = useState<Record<string, PemasukanLainItem>>({});
  const [dataAnggaranCloud, setDataAnggaranCloud] = useState<Record<string, AnggaranItem>>({});
  const [dataTargetDanaCloud, setDataTargetDanaCloud] = useState<Record<string, TargetDanaItem>>({});
  const [dataAgendaKalenderCloud, setDataAgendaKalenderCloud] = useState<Record<string, AgendaItem>>({});
  const [dataSaranCloud, setDataSaranCloud] = useState<Record<string, string>>({});
  const [namaSiswaCustomCloud, setNamaSiswaCustomCloud] = useState<Record<string, string>>({});
  const [siswaNonaktifCloud, setSiswaNonaktifCloud] = useState<Record<string, boolean>>({});
  const [terakhirDiperbarui, setTerakhirDiperbarui] = useState('Realtime');

  // Modals & Overlay States
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNonaktifModal, setShowNonaktifModal] = useState(false);
  const [riwayatIdSiswa, setRiwayatIdSiswa] = useState<number | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  // Synchronize admin class on body for CSS selectors (body.admin-aktif)
  useEffect(() => {
    if (statusAdmin) {
      document.body.classList.add('admin-aktif');
    } else {
      document.body.classList.remove('admin-aktif');
    }
  }, [statusAdmin]);

  // Supabase Data Fetching & Realtime Sync
  const fetchAllCloudData = async () => {
    try {
      // 1. Kas XI RPL 2
      const { data: kasData } = await supabase.from('kas_xi_rpl2').select('*');
      if (kasData) {
        const master: MasterKasData = {};
        kasData.forEach((row) => {
          if (!master[row.bulan]) master[row.bulan] = {};
          master[row.bulan][row.siswa_id] = {
            m1: Number(row.m1) || 0,
            m2: Number(row.m2) || 0,
            m3: Number(row.m3) || 0,
            m4: Number(row.m4) || 0,
          };
        });
        setMasterDataCloud(master);
      }

      // 2. Nama Siswa Custom
      const { data: namaData } = await supabase.from('nama_siswa_custom').select('*');
      if (namaData) {
        const customMap: Record<string, string> = {};
        namaData.forEach((row) => {
          customMap[row.siswa_id] = row.nama;
        });
        setNamaSiswaCustomCloud(customMap);
      }

      // 3. Siswa Nonaktif
      const { data: nonaktifData } = await supabase.from('siswa_nonaktif').select('*');
      if (nonaktifData) {
        const nonaktifMap: Record<string, boolean> = {};
        nonaktifData.forEach((row) => {
          if (row.is_nonaktif) nonaktifMap[row.siswa_id] = true;
        });
        setSiswaNonaktifCloud(nonaktifMap);
      }

      // 4. Pengeluaran Kas
      const { data: pengeluaranData } = await supabase.from('pengeluaran_kas').select('*').order('created_at', { ascending: false });
      if (pengeluaranData) {
        const pMap: Record<string, PengeluaranItem> = {};
        pengeluaranData.forEach((row) => {
          pMap[row.id] = {
            id: row.id,
            tanggal: row.tanggal,
            keperluan: row.keperluan,
            kategori: row.kategori,
            nominal: Number(row.nominal) || 0,
            nota: row.nota,
          };
        });
        setDataPengeluaranCloud(pMap);
      }

      // 5. Pemasukan Lain Kas
      const { data: pemasukanData } = await supabase.from('pemasukan_lain_kas').select('*').order('created_at', { ascending: false });
      if (pemasukanData) {
        const pmMap: Record<string, PemasukanLainItem> = {};
        pemasukanData.forEach((row) => {
          pmMap[row.id] = {
            id: row.id,
            tanggal: row.tanggal,
            sumber: row.sumber,
            nominal: Number(row.nominal) || 0,
            bukti: row.bukti,
          };
        });
        setDataPemasukanLainCloud(pmMap);
      }

      // 6. Anggaran Kas
      const { data: anggaranData } = await supabase.from('anggaran_kas').select('*');
      if (anggaranData) {
        const aMap: Record<string, AnggaranItem> = {};
        anggaranData.forEach((row) => {
          aMap[row.id] = {
            id: row.id,
            kegiatan: row.kegiatan,
            estimasi: Number(row.estimasi) || 0,
          };
        });
        setDataAnggaranCloud(aMap);
      }

      // 7. Target Dana Kas
      const { data: targetData } = await supabase.from('target_dana_kas').select('*');
      if (targetData) {
        const tMap: Record<string, TargetDanaItem> = {};
        targetData.forEach((row) => {
          tMap[row.id] = {
            id: row.id,
            nama: row.nama,
            target: Number(row.target) || 0,
            terkumpul: Number(row.terkumpul) || 0,
          };
        });
        setDataTargetDanaCloud(tMap);
      }

      // 8. Agenda Kalender
      const { data: agendaData } = await supabase.from('agenda_kalender').select('*');
      if (agendaData) {
        const agMap: Record<string, AgendaItem> = {};
        agendaData.forEach((row) => {
          agMap[row.id] = {
            id: row.id,
            title: row.title,
            start: row.start,
            backgroundColor: row.background_color,
          };
        });
        setDataAgendaKalenderCloud(agMap);
      }

      // 9. Saran Kelas
      const { data: saranData } = await supabase.from('saran_kelas').select('*').order('created_at', { ascending: false });
      if (saranData) {
        const sMap: Record<string, string> = {};
        saranData.forEach((row) => {
          sMap[row.id] = row.teks;
        });
        setDataSaranCloud(sMap);
      }

      // 10. Terakhir Diperbarui Metadata
      const { data: metadataData } = await supabase.from('app_metadata').select('val').eq('key', 'Terakhir_Diperbarui').single();
      if (metadataData && metadataData.val) {
        setTerakhirDiperbarui(metadataData.val);
      }
    } catch (err) {
      console.error("Gagal mengambil data dari Supabase:", err);
    } finally {
      setLoadingCloud(false);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTemaGelap(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Verifikasi Sesi JWT Admin dari Cookie (2 Jam Expiration)
    const checkAdminSession = async () => {
      const token = getAdminCookie();
      if (token) {
        const isValid = await verifyAdminJwtToken(token);
        if (isValid) {
          setStatusAdmin(true);
        } else {
          removeAdminCookie();
          setStatusAdmin(false);
        }
      }
    };
    checkAdminSession();

    fetchAllCloudData();

    // Supabase Realtime Channel Listener
    const channel = supabase
      .channel('public-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAllCloudData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const catatWaktuLogCloud = async () => {
    let skrg = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setTerakhirDiperbarui(skrg);
    await supabase.from('app_metadata').upsert({
      key: 'Terakhir_Diperbarui',
      val: skrg,
      updated_at: new Date().toISOString()
    });
  };

  const toggleTemaGelap = () => {
    const newTheme = !temaGelap;
    setTemaGelap(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  // Finance global calculations
  let totalKasMasuk = 0;
  URUTAN_BULAN.forEach(b => {
    let dataBulan = masterDataCloud[b] || {};
    Object.keys(dataBulan).forEach(id => {
      let s = dataBulan[id] || {};
      totalKasMasuk += (s.m1 || 0) + (s.m2 || 0) + (s.m3 || 0) + (s.m4 || 0);
    });
  });
  Object.keys(dataPemasukanLainCloud).forEach(k => {
    totalKasMasuk += Number(dataPemasukanLainCloud[k].nominal) || 0;
  });

  let totalKasKeluar = 0;
  Object.keys(dataPengeluaranCloud).forEach(k => {
    totalKasKeluar += Number(dataPengeluaranCloud[k].nominal) || 0;
  });

  const saldoSisa = totalKasMasuk - totalKasKeluar;

  // Student Helpers
  const namaTampil = (id: number) => {
    return (namaSiswaCustomCloud && namaSiswaCustomCloud[id]) || DAFTAR_SISWA[id - 1];
  };

  const editNamaSiswa = async (idSiswa: number) => {
    if (!statusAdmin) return;
    let namaSekarang = namaTampil(idSiswa);
    let namaBaru = prompt("Edit nama siswa:", namaSekarang);
    if (namaBaru === null) return;
    namaBaru = namaBaru.trim();
    if (!namaBaru) return showToast("Nama tidak boleh kosong!", "error");

    if (namaBaru === DAFTAR_SISWA[idSiswa - 1]) {
      await supabase.from('nama_siswa_custom').delete().eq('siswa_id', idSiswa);
    } else {
      await supabase.from('nama_siswa_custom').upsert({ siswa_id: idSiswa, nama: namaBaru });
    }
    await fetchAllCloudData();
    showToast("Nama siswa berhasil diperbarui!", "success");
  };

  const nonaktifkanSiswa = async (idSiswa: number) => {
    if (!statusAdmin) return;
    let nama = namaTampil(idSiswa);
    const setuju = await showConfirm(`Nonaktifkan ${nama}?`, "Disembunyikan dari tabel kas bulanan & rekap, tapi data lama aman.");
    if (setuju) {
      await supabase.from('siswa_nonaktif').upsert({ siswa_id: idSiswa, is_nonaktif: true });
      await fetchAllCloudData();
      showToast(`${nama} dipindah ke daftar nonaktif.`, "info");
    }
  };

  const aktifkanSiswaKembali = async (idSiswa: number) => {
    if (!statusAdmin) return;
    let nama = namaTampil(idSiswa);
    const setuju = await showConfirm(`Aktifkan Kembali ${nama}?`, "Siswa akan muncul kembali di tabel kas aktif.");
    if (setuju) {
      await supabase.from('siswa_nonaktif').delete().eq('siswa_id', idSiswa);
      await fetchAllCloudData();
      showToast(`${nama} sudah diaktifkan kembali!`, "success");
    }
  };

  const simpanDataKeCloudSingle = async (bulan: string, id: number, m1: number, m2: number, m3: number, m4: number) => {
    if (!statusAdmin) return;
    await supabase.from('kas_xi_rpl2').upsert(
      { bulan, siswa_id: id, m1, m2, m3, m4, updated_at: new Date().toISOString() },
      { onConflict: 'bulan,siswa_id' }
    );
    await catatWaktuLogCloud();
    await fetchAllCloudData();
  };

  // Image Upload Compress Helper & Fallback
  const kompresGambar = (file: File, maxWidth = 800, kualitas = 0.65): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const gambar = new Image();
      const urlSementara = URL.createObjectURL(file);
      gambar.onload = () => {
        let { width, height } = gambar;
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(gambar, 0, 0, width, height);
        }
        URL.revokeObjectURL(urlSementara);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Gagal kompres gambar")), 'image/jpeg', kualitas);
      };
      gambar.onerror = () => reject(new Error("File gambar tidak valid"));
      gambar.src = urlSementara;
    });
  };

  const imageToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const uploadBukti = async (file: File, folder: string): Promise<string> => {
    try {
      const blobKecil = await kompresGambar(file, 800, 0.65);
      try {
        const namaFile = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
        const pathBucket = `${folder}/${namaFile}`;
        const { error } = await supabase.storage.from('bukti').upload(pathBucket, blobKecil, {
          contentType: 'image/jpeg',
          upsert: true
        });
        if (error) throw error;

        const { data: publicUrlData } = supabase.storage.from('bukti').getPublicUrl(pathBucket);
        return publicUrlData.publicUrl;
      } catch (storageErr) {
        console.warn("Supabase Storage fallback to Base64:", storageErr);
        return await imageToBase64(blobKecil);
      }
    } catch (err) {
      console.error("Gagal kompres foto:", err);
      throw err;
    }
  };

  const tambahPemasukanLainCloud = async (sumber: string, nominal: number, fileBukti: File | null) => {
    let urlBukti = "#";
    if (fileBukti) {
      urlBukti = await uploadBukti(fileBukti, "pemasukan");
    }
    let tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    await supabase.from('pemasukan_lain_kas').insert({ tanggal: tgl, sumber, nominal, bukti: urlBukti });
    await catatWaktuLogCloud();
    await fetchAllCloudData();
    showToast("Pemasukan luar berhasil ditambahkan!", "success");
  };

  const hapusPemasukanLain = async (key: string) => {
    if (!statusAdmin) return;
    const setuju = await showConfirm("Hapus Pemasukan?", "Hapus data pemasukan tak terduga ini?");
    if (setuju) {
      await supabase.from('pemasukan_lain_kas').delete().eq('id', key);
      await catatWaktuLogCloud();
      await fetchAllCloudData();
      showToast("Data pemasukan berhasil dihapus.", "success");
    }
  };

  const tambahPengeluaranCloud = async (keperluan: string, kategori: string, nominal: number, fileBukti: File | null) => {
    let nota = "#";
    if (fileBukti) {
      nota = await uploadBukti(fileBukti, "pengeluaran");
    }
    let tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    await supabase.from('pengeluaran_kas').insert({ tanggal: tgl, keperluan, kategori, nominal, nota });
    await catatWaktuLogCloud();
    await fetchAllCloudData();
    showToast("Pengeluaran berhasil dicatat!", "success");
  };

  const editPengeluaranCloud = async (id: string, keperluan: string, kategori: string, nominal: number, fileBukti: File | null, notaLama: string) => {
    if (!statusAdmin) return;
    let nota = notaLama;
    if (fileBukti) {
      nota = await uploadBukti(fileBukti, "pengeluaran");
    }
    await supabase.from('pengeluaran_kas').update({ keperluan, kategori, nominal, nota }).eq('id', id);
    await catatWaktuLogCloud();
    await fetchAllCloudData();
    showToast("Pengeluaran berhasil diperbarui!", "success");
  };

  const hapusPengeluaranCloud = async (id: string) => {
    if (!statusAdmin) return;
    const setuju = await showConfirm("Hapus Pengeluaran?", "Data pengeluaran dan nota ini akan dihapus permanen.");
    if (setuju) {
      await supabase.from('pengeluaran_kas').delete().eq('id', id);
      await catatWaktuLogCloud();
      await fetchAllCloudData();
      showToast("Pengeluaran berhasil dihapus.", "success");
    }
  };

  const tambahAnggaranCloud = async (kegiatan: string, estimasi: number) => {
    await supabase.from('anggaran_kas').insert({ kegiatan, estimasi });
    await catatWaktuLogCloud();
    await fetchAllCloudData();
    showToast("Rencana anggaran ditambahkan!", "success");
  };

  const hapusAnggaran = async (key: string) => {
    if (!statusAdmin) return;
    const setuju = await showConfirm("Hapus Rencana Anggaran?", "Hapus alokasi rencana anggaran kegiatan ini?");
    if (setuju) {
      await supabase.from('anggaran_kas').delete().eq('id', key);
      await catatWaktuLogCloud();
      await fetchAllCloudData();
      showToast("Rencana anggaran dihapus.", "success");
    }
  };

  const tambahTargetDanaCloud = async (nama: string, target: number, terkumpul: number) => {
    await supabase.from('target_dana_kas').insert({ nama, target, terkumpul });
    await catatWaktuLogCloud();
    await fetchAllCloudData();
    showToast("Target tabungan event ditambahkan!", "success");
  };

  const updateTargetTerkumpul = async (key: string, nominalLama: number) => {
    if (!statusAdmin) return;
    let valStr = prompt("Update nominal terkumpul saat ini (Rupiah):", nominalLama.toString());
    if (valStr === null) return;
    let nominalBaru = parseInt(valStr) || 0;
    await supabase.from('target_dana_kas').update({ terkumpul: nominalBaru }).eq('id', key);
    await catatWaktuLogCloud();
    await fetchAllCloudData();
    showToast("Progres tabungan diperbarui!", "success");
  };

  const hapusTargetDana = async (key: string) => {
    if (!statusAdmin) return;
    const setuju = await showConfirm("Hapus Target Tabungan?", "Hapus penggalangan dana event kelas ini?");
    if (setuju) {
      await supabase.from('target_dana_kas').delete().eq('id', key);
      await catatWaktuLogCloud();
      await fetchAllCloudData();
      showToast("Target tabungan dihapus.", "info");
    }
  };

  const tambahAgendaKalenderCloud = async (start: string, title: string, backgroundColor: string) => {
    await supabase.from('agenda_kalender').insert({ title, start, background_color: backgroundColor });
    await catatWaktuLogCloud();
    await fetchAllCloudData();
    showToast("Agenda kas berhasil ditambahkan!", "success");
  };

  const hapusAgendaKalender = async (key: string, title: string) => {
    if (!statusAdmin) return;
    const setuju = await showConfirm(`Hapus Agenda "${title}"?`, "Hapus penanda agenda ini dari kalender kelas?");
    if (setuju) {
      await supabase.from('agenda_kalender').delete().eq('id', key);
      await catatWaktuLogCloud();
      await fetchAllCloudData();
      showToast("Agenda berhasil dihapus!", "success");
    }
  };

  const kirimSaranCloud = async (teks: string) => {
    await supabase.from('saran_kelas').insert({ teks });
    await fetchAllCloudData();
    showToast("Aspirasi berhasil dikirim secara anonim!", "success");
  };

  const hapusSaranCloud = async (key: string) => {
    if (!statusAdmin) return;
    const setuju = await showConfirm("Hapus Saran Anonim?", "Hapus saran/kritik ini dari daftar?");
    if (setuju) {
      await supabase.from('saran_kelas').delete().eq('id', key);
      await fetchAllCloudData();
      showToast("Saran dihapus.", "success");
    }
  };

  const salinTagihanWhatsApp = () => {
    let namaBulanSaja = bulanAktif.split(" ")[0];
    let teks = `*Assalamu'alaikum Wr. Wb.*\n\nSelamat pagi/siang rekan-rekan XI RPL 2. Berikut kami lampirkan laporan tagihan kas untuk *Bulan ${namaBulanSaja.toUpperCase()}*.\n\nSisa Saldo Kas Kelas: *Rp ${saldoSisa.toLocaleString('id-ID')}*\n\nCek rincian & scan QRIS di web: https://rafianxrpl2.github.io/Keuangan_RPL2_Angkatan7/\n\n_- Bendahara XI RPL 2_`;
    navigator.clipboard.writeText(teks);
    showToast("Teks broadcast WhatsApp disalin ke clipboard!", "success");
  };

  const eksporKasExcel = () => {
    let csvContent = "\uFEFF";
    csvContent += `LAPORAN KAS REALTIME XI RPL 2 - BULAN ${bulanAktif.toUpperCase()}\n`;
    csvContent += `Sisa Saldo Kas Kelas: Rp ${saldoSisa.toLocaleString('id-ID')}\n\n`;
    csvContent += `No,Nama Siswa,Minggu 1 (Rp),Minggu 2 (Rp),Minggu 3 (Rp),Minggu 4 (Rp),Total Setor (Rp),Status\n`;

    let idx = 1;
    DAFTAR_SISWA.forEach((_, i) => {
      let id = i + 1;
      if (siswaNonaktifCloud[id]) return;
      let nama = namaTampil(id);
      let dataBulan = (masterDataCloud[bulanAktif] && masterDataCloud[bulanAktif][id]) || { m1: 0, m2: 0, m3: 0, m4: 0 };
      let total = (dataBulan.m1 || 0) + (dataBulan.m2 || 0) + (dataBulan.m3 || 0) + (dataBulan.m4 || 0);
      let statusStr = total >= WAJIB_BAYAR ? "LUNAS" : "NUNGGAK";

      csvContent += `"${idx}","${nama.replace(/"/g, '""')}","${dataBulan.m1 || 0}","${dataBulan.m2 || 0}","${dataBulan.m3 || 0}","${dataBulan.m4 || 0}","${total}","${statusStr}"\n`;
      idx++;
    });

    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement('a');
    let url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Kas_XI_RPL2_${bulanAktif.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Laporan Kas Excel/CSV berhasil diunduh!", "success");
  };

  const cetakLaporanPDF = () => {
    window.print();
  };

  const kirimWATagihanPersonal = (idSiswa: number) => {
    let nama = namaTampil(idSiswa);
    let bulanTunggakan: string[] = [];
    let totalTunggakan = 0;

    URUTAN_BULAN.forEach(b => {
      let dataBulan = (masterDataCloud[b] && masterDataCloud[b][idSiswa]) || { m1: 0, m2: 0, m3: 0, m4: 0 };
      let totalBulan = (dataBulan.m1 || 0) + (dataBulan.m2 || 0) + (dataBulan.m3 || 0) + (dataBulan.m4 || 0);
      if (totalBulan < WAJIB_BAYAR) {
        let sisaBulan = WAJIB_BAYAR - totalBulan;
        totalTunggakan += sisaBulan;
        let namaBulanSaja = b.split(" ")[0];
        bulanTunggakan.push(`${namaBulanSaja} (kurang Rp ${sisaBulan.toLocaleString('id-ID')})`);
      }
    });

    if (bulanTunggakan.length === 0) {
      return showAlert("Status Lunas!", `${nama} sudah LUNAS seluruh bulan kas!`, "success");
    }

    let pesan = `*Assalamu'alaikum Wr. Wb. / Halo ${nama}*\n\nIni pengingat resmi kas kelas *XI RPL 2*.\nSisa tunggakan kas kamu sebesar *Rp ${totalTunggakan.toLocaleString('id-ID')}*:\n`;
    bulanTunggakan.forEach(item => {
      pesan += `• ${item}\n`;
    });
    pesan += `\nScan QRIS di web: https://rafianxrpl2.github.io/Keuangan_RPL2_Angkatan7/\n\nTerima kasih! 🙏\n_- Bendahara XI RPL 2_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(pesan)}`, '_blank');
    showToast(`Membuka WhatsApp untuk tagihan ${nama}...`, "info");
  };

  const setorKasBatchLunas = async (terpilih: number[]) => {
    if (!statusAdmin) return;
    if (terpilih.length === 0) return showToast("Pilih minimal 1 siswa terlebih dahulu!", "error");
    const setuju = await showConfirm(`Batch Lunas ${terpilih.length} Siswa?`, `Tandai LUNAS M1-M4 untuk ${terpilih.length} siswa terpilih pada bulan ${bulanAktif}?`);
    if (setuju) {
      const rows = terpilih.map(id => ({
        bulan: bulanAktif,
        siswa_id: id,
        m1: 5000,
        m2: 5000,
        m3: 5000,
        m4: 5000,
        updated_at: new Date().toISOString()
      }));
      await supabase.from('kas_xi_rpl2').upsert(rows, { onConflict: 'bulan,siswa_id' });
      await catatWaktuLogCloud();
      await fetchAllCloudData();
      showToast(`Berhasil menandai LUNAS ${terpilih.length} siswa!`, "success");
    }
  };

  const handleVerifikasiLoginAdmin = async (pwInput: string) => {
    if (pwInput && btoa(pwInput) === KEY_VALIDASI) {
      const token = await createAdminJwtToken();
      setAdminCookie(token);
      setStatusAdmin(true);
      setShowAdminModal(false);
      showAlert("Otoritas Diterima!", "Mode Bendahara aktif (Sesi login disimpan 2 jam di Cookie). Anda sekarang memiliki akses edit data kas.", "success");
    } else {
      showAlert("Akses Ditolak!", "Password bendahara salah!", "error");
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      <div className={`loading-overlay ${!loadingCloud ? 'loading-selesai' : ''}`}>
        <div className="loading-spinner"></div>
        <p>Menyambungkan ke data kas Supabase...</p>
      </div>

      {/* Printable PDF Header */}
      <div className="print-header">
        <h2>LAPORAN KEUANGAN KAS XI RPL 2</h2>
        <p>Sistem Kas Realtime Cloud Monitoring (Supabase)</p>
      </div>

      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        <h2>
          <i className="fa-solid fa-wallet"></i> MANAGEMENT KAS
        </h2>
        <button className="btn-toggle-sidebar" onClick={() => setMobileBuka(!mobileBuka)}>
          ☰
        </button>
      </div>

      <Sidebar
        halamanSekarang={halamanSekarang}
        setPindahHalaman={setHalamanSekarang}
        statusAdmin={statusAdmin}
        bukaModalLoginAdmin={() => {
          if (statusAdmin) {
            removeAdminCookie();
            setStatusAdmin(false);
            showToast("Mode bendahara dinonaktifkan.", "info");
          } else {
            setShowAdminModal(true);
          }
        }}
        bukaQRIS={() => setShowQrisModal(true)}
        temaGelap={temaGelap}
        toggleTemaGelap={toggleTemaGelap}
        mobileBuka={mobileBuka}
        toggleSidebarMobile={() => setMobileBuka(!mobileBuka)}
      />

      <main>
        <DashboardHero
          saldoMasuk={totalKasMasuk}
          saldoKeluar={totalKasKeluar}
          saldoSisa={saldoSisa}
          terakhirDiperbarui={terakhirDiperbarui}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={halamanSekarang}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {halamanSekarang === 'bulanan' && (
              <MonthlyKasTable
                bulanAktif={bulanAktif}
                setBulanAktif={setBulanAktif}
                masterDataCloud={masterDataCloud}
                namaSiswaCustomCloud={namaSiswaCustomCloud}
                siswaNonaktifCloud={siswaNonaktifCloud}
                statusAdmin={statusAdmin}
                bukaRiwayatSiswa={(id) => setRiwayatIdSiswa(id)}
                editNamaSiswa={editNamaSiswa}
                nonaktifkanSiswa={nonaktifkanSiswa}
                bukaModalSiswaNonaktif={() => setShowNonaktifModal(true)}
                salinTagihanWhatsApp={salinTagihanWhatsApp}
                setorKasBatchLunas={setorKasBatchLunas}
                simpanDataKeCloudSingle={simpanDataKeCloudSingle}
              />
            )}

            {halamanSekarang === 'rekap' && (
              <RekapSection
                masterDataCloud={masterDataCloud}
                dataPengeluaranCloud={dataPengeluaranCloud}
                namaSiswaCustomCloud={namaSiswaCustomCloud}
                siswaNonaktifCloud={siswaNonaktifCloud}
              />
            )}

            {halamanSekarang === 'pemasukan-lain' && (
              <PemasukanLainSection
                dataPemasukanLainCloud={dataPemasukanLainCloud}
                statusAdmin={statusAdmin}
                bukaLihatBukti={(url) => setProofUrl(url)}
                tambahPemasukanLainCloud={tambahPemasukanLainCloud}
                hapusPemasukanLain={hapusPemasukanLain}
              />
            )}

            {halamanSekarang === 'pengeluaran' && (
              <PengeluaranSection
                dataPengeluaranCloud={dataPengeluaranCloud}
                statusAdmin={statusAdmin}
                bukaLihatBukti={(url) => setProofUrl(url)}
                tambahPengeluaranCloud={tambahPengeluaranCloud}
                editPengeluaranCloud={editPengeluaranCloud}
                hapusPengeluaranCloud={hapusPengeluaranCloud}
              />
            )}

            {halamanSekarang === 'anggaran' && (
              <AnggaranSection
                dataAnggaranCloud={dataAnggaranCloud}
                dataTargetDanaCloud={dataTargetDanaCloud}
                statusAdmin={statusAdmin}
                tambahAnggaranCloud={tambahAnggaranCloud}
                tambahTargetDanaCloud={tambahTargetDanaCloud}
                updateTargetTerkumpul={updateTargetTerkumpul}
                hapusTargetDana={hapusTargetDana}
                hapusAnggaran={hapusAnggaran}
              />
            )}

            {halamanSekarang === 'kalender' && (
              <KalenderSection
                dataAgendaKalenderCloud={dataAgendaKalenderCloud}
                statusAdmin={statusAdmin}
                tambahAgendaKalenderCloud={tambahAgendaKalenderCloud}
                hapusAgendaKalender={hapusAgendaKalender}
                tampilkanInfoAgenda={(judul, tanggal) => showAlert("Agenda Kas Kelas", `📌 <b>${judul}</b><br>Tanggal: ${tanggal}`, "info")}
              />
            )}

            {halamanSekarang === 'saran' && (
              <SaranSection
                dataSaranCloud={dataSaranCloud}
                statusAdmin={statusAdmin}
                kirimSaranCloud={kirimSaranCloud}
                hapusSaranCloud={hapusSaranCloud}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Printable PDF Footer Signatures */}
        <div className="print-footer-ttd">
          <div className="ttd-box">
            <p>Mengetahui,</p>
            <p style={{ fontWeight: 700 }}>Wali Kelas XI RPL 2</p>
            <div className="ttd-garis">( Wali Kelas )</div>
          </div>
          <div className="ttd-box">
            <p>Pengelola Keuangan,</p>
            <p style={{ fontWeight: 700 }}>Bendahara Kelas</p>
            <div className="ttd-garis">( Bendahara XI RPL 2 )</div>
          </div>
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <FabContainer
        setPindahHalaman={setHalamanSekarang}
        bukaQRIS={() => setShowQrisModal(true)}
        salinTagihanWhatsApp={salinTagihanWhatsApp}
      />

      {/* Modals */}
      <QrisModal show={showQrisModal} onClose={() => setShowQrisModal(false)} />
      
      <AdminLoginModal
        show={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onLogin={handleVerifikasiLoginAdmin}
      />

      <RiwayatModal
        idSiswa={riwayatIdSiswa}
        nama={riwayatIdSiswa ? namaTampil(riwayatIdSiswa) : ''}
        masterDataCloud={masterDataCloud}
        onClose={() => setRiwayatIdSiswa(null)}
        kirimWATagihanPersonal={kirimWATagihanPersonal}
      />

      <NonaktifModal
        show={showNonaktifModal}
        onClose={() => setShowNonaktifModal(false)}
        siswaNonaktifCloud={siswaNonaktifCloud}
        namaSiswaCustomCloud={namaSiswaCustomCloud}
        aktifkanSiswaKembali={aktifkanSiswaKembali}
      />

      <ProofModal url={proofUrl} onClose={() => setProofUrl(null)} />
    </>
  );
}
