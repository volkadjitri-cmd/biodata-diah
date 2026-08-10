import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Copy,
  CheckCircle2,
  Sparkles,
  Heart
} from 'lucide-react';
import supabase from './supabaseClient.js';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [uploads, setUploads] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [uploadsError, setUploadsError] = useState("");
  const [editingUploadId, setEditingUploadId] = useState(null);
  const [editFileName, setEditFileName] = useState("");
  const [editFileExtension, setEditFileExtension] = useState("");
  const [studentName, setStudentName] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const profileImage = "https://lqvjphmbebbcdquovkap.supabase.co/storage/v1/object/public/product-images/products/1785799787354-WhatsApp-Image-2026-08-04-at-06.21.12.jpeg";

  const profileData = {
    name: "Nurdiah Pitaloka",
    school: "SMAN 12 Jakarta",
    grade: "Grade 12",
    email: "nurdiahptugas@gmail.com",
    instagram: "diahpita17_",
    biodata: {
      dob: "17 Oktober 2007",
      hobbies: "Data Analysis, Reading, Creative Writing",
      dream: "Data Scientist / Business Analyst",
      motto: "Small steps today lead to big results tomorrow."
    },
    aboutParagraphs: [
      "Hello! My name is Nurdiah Pitaloka, and I am a student at SMAN 12 Jakarta. I am currently in Grade 12 and have a strong curiosity for learning, creating, and continuously improving my skills.",
      "I am passionate about data and enjoy organizing, analyzing, and transforming information into meaningful insights. I believe that every dataset tells a story waiting to be discovered, and I am excited by the opportunity to use data to solve problems and support better decision-making.",
      "Beyond academics, I enjoy exploring new ideas, taking on creative challenges, and building projects that allow me to apply what I have learned. This website serves as my personal portfolio, where I share my profile, learning journey, and a collection of my PKWU projects and achievements. I hope it reflects not only the work I have completed but also my growth, creativity, and enthusiasm for learning."
    ]
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await checkAdmin(session.user);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await checkAdmin(session.user);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const loadUploads = async () => {
    setLoadingUploads(true);
    setUploadsError("");

    const { data, error } = await supabase
      .from('uploads')
      .select('id, file_name, file_url, file_path, uploaded_at, user_id, description')
      .order('uploaded_at', { ascending: false });

    if (error) {
      setUploadsError(`Gagal memuat daftar tugas: ${error.message}`);
    } else {
      setUploads(data || []);
    }

    setLoadingUploads(false);
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const checkAdmin = async (currentUser) => {
    setAuthError("");
    setUploadStatus("");

    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || profileData.email || "nurdiahptugas@gmail.com").trim().toLowerCase();
    const normalizedEmail = currentUser?.email?.toLowerCase();

    setIsAdmin(Boolean(normalizedEmail && normalizedEmail === adminEmail));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0] || null);
    setUploadStatus("");
  };

  const parseUploadDescription = (upload) => {
    if (!upload?.description) return null;
    try {
      return JSON.parse(upload.description);
    } catch (error) {
      return null;
    }
  };

  const getFileTypeLabel = (fileName) => {
    if (!fileName) return 'File';
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.pdf')) return 'PDF';
    if (lower.match(/\.(jpe?g|png|gif|webp|svg)$/)) return 'Gambar';
    if (lower.match(/\.(docx?|zip)$/)) return 'Dokumen';
    return 'File';
  };

  const getFileExtension = (fileName) => {
    if (!fileName) return '';
    const match = fileName.match(/\.([^.]+)$/);
    return match ? match[1] : '';
  };

  const getBaseFileName = (fileName) => {
    if (!fileName) return '';
    const index = fileName.lastIndexOf('.');
    return index > 0 ? fileName.slice(0, index) : fileName;
  };

  const isImageFile = (fileName) => /\.(jpe?g|png|gif|webp|svg)$/i.test(fileName);
  const isPdfFile = (fileName) => /\.pdf$/i.test(fileName);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setUploadStatus("Hanya admin yang dapat mengunggah tugas.");
      return;
    }

    if (!selectedFile) {
      setUploadStatus("Pilih dahulu file tugas yang ingin diunggah.");
      return;
    }

    setUploadStatus("Mengunggah file ke Supabase...");

    const fileName = `${Date.now()}_${selectedFile.name}`;
    const folderPath = `tugas/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tugas')
      .upload(folderPath, selectedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      const isStoragePolicyError = uploadError.message?.toLowerCase().includes('policy') || uploadError.message?.toLowerCase().includes('permission');
      if (isStoragePolicyError) {
        setUploadStatus('Gagal mengunggah file ke storage Supabase karena kebijakan izin. Buka Supabase SQL Editor dan jalankan skrip supabase-policies.sql.');
      } else {
        setUploadStatus(`Gagal mengunggah file: ${uploadError.message}`);
      }
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('tugas')
      .getPublicUrl(folderPath);

    const { data: insertData, error: insertError } = await supabase
      .from('uploads')
      .insert([
        {
          file_name: selectedFile.name,
          file_path: folderPath,
          file_url: publicUrlData.publicUrl,
          uploaded_at: new Date().toISOString(),
          user_id: user?.id || null,
          description: JSON.stringify({
            studentName: studentName.trim(),
            fullName: fullName.trim(),
            studentClass: studentClass.trim(),
            taskTitle: taskTitle.trim(),
            notes: taskDescription.trim()
          })
        }
      ]);

    if (insertError) {
      const isRlsError = insertError.message?.toLowerCase().includes('row-level security') || insertError.message?.toLowerCase().includes('policy');
      if (isRlsError) {
        setUploadStatus('File berhasil diunggah ke storage, tetapi gagal menyimpan metadata karena kebijakan RLS Supabase. Buka Supabase SQL Editor dan jalankan skrip supabase-policies.sql.');
      } else {
        setUploadStatus(`File terunggah, tetapi gagal menyimpan metadata: ${insertError.message}`);
      }
      return;
    }

    setUploadStatus(`File ${selectedFile.name} berhasil diunggah ke Supabase.`);
    await loadUploads();
    setSelectedFile(null);
    setStudentName("");
    setFullName("");
    setStudentClass("");
    setTaskTitle("");
    setTaskDescription("");
    setFileInputKey(Date.now());
  };

  const handleStartEdit = (upload) => {
    setEditingUploadId(upload.id);
    setEditFileName(getBaseFileName(upload.file_name || ""));
    setEditFileExtension(getFileExtension(upload.file_name || ""));
    setUploadStatus("");
  };

  const handleCancelEdit = () => {
    setEditingUploadId(null);
    setEditFileName("");
    setEditFileExtension("");
  };

  const handleSaveFileName = async (upload) => {
    const baseName = editFileName.trim();
    if (!baseName) {
      setUploadStatus("Nama file tidak boleh kosong.");
      return;
    }

    const hasExtensionInBase = baseName.match(/\.([^.]+)$/);
    const finalFileName = hasExtensionInBase
      ? baseName
      : editFileExtension
      ? `${baseName}.${editFileExtension}`
      : baseName;

    if (finalFileName === upload.file_name) {
      handleCancelEdit();
      return;
    }

    setUploadStatus("Menyimpan perubahan nama file...");
    const { error } = await supabase
      .from('uploads')
      .update({ file_name: finalFileName })
      .eq('id', upload.id);

    if (error) {
      setUploadStatus(`Gagal mengganti nama file: ${error.message}`);
      return;
    }

    setUploadStatus(`Nama file berhasil diubah menjadi "${newFileName}".`);
    setEditingUploadId(null);
    setEditFileName("");
    await loadUploads();
  };

  const handleDeleteUpload = async (upload) => {
    const confirmed = window.confirm(`Hapus tugas "${upload.file_name}"? Aksi ini tidak dapat dibatalkan.`);
    if (!confirmed) return;

    setUploadStatus("Menghapus tugas...");

    if (upload.file_path) {
      const { error: deleteStorageError } = await supabase
        .storage.from('tugas')
        .remove([upload.file_path]);

      if (deleteStorageError) {
        setUploadStatus(`Gagal menghapus file dari storage: ${deleteStorageError.message}`);
        return;
      }
    }

    const { error: deleteDbError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', upload.id);

    if (deleteDbError) {
      setUploadStatus(`File berhasil dihapus dari storage, tetapi gagal menghapus metadata: ${deleteDbError.message}`);
      return;
    }

    setUploadStatus(`Tugas "${upload.file_name}" berhasil dihapus.`);
    if (editingUploadId === upload.id) handleCancelEdit();
    await loadUploads();
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setAuthError("");

    const loginEmail = email.trim().toLowerCase();
    const loginPassword = password.trim();
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || profileData.email || "nurdiahptugas@gmail.com").trim().toLowerCase();
    const adminPassword = (import.meta.env.VITE_ADMIN_PASSWORD || "").trim();

    if (adminEmail && adminPassword && loginEmail === adminEmail && loginPassword === adminPassword) {
      const localAdminUser = { id: 'local-admin', email: adminEmail };
      setUser(localAdminUser);
      setIsAdmin(true);
      setEmail("");
      setPassword("");
      setUploadStatus("");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data?.user) {
      setUser(data.user);
      await checkAdmin(data.user);
      setEmail("");
      setPassword("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setUploadStatus("");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F9] text-stone-800 font-sans selection:bg-rose-200 selection:text-rose-900 pb-20">
      
      <nav className="sticky top-0 z-40 bg-[#FFF8F9]/80 backdrop-blur-md border-b border-rose-100/60">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-serif font-bold text-rose-900 text-lg tracking-wider">NP</span>
          <div className="flex gap-6 text-xs font-medium text-stone-600">
            <a href="#profile" className="hover:text-rose-700 transition-colors">Profile</a>
            <a href="#about" className="hover:text-rose-700 transition-colors">About</a>
            <a href="#contact" className="hover:text-rose-700 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      <section id="profile" className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/60 p-8 rounded-3xl border border-rose-100 shadow-sm">
          
          <div className="relative group shrink-0">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-white shadow-md shadow-rose-100/60 ring-1 ring-rose-200/50 relative bg-rose-50">
              <img
                src={profileImage}
                alt={profileData.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/60 border border-rose-200/80 text-rose-900 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-rose-600" />
              <span>Portfolio & PKWU</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif text-rose-950 leading-tight">
              My Journey Through <br />
              <span className="text-rose-600 italic">PKWU Starts Here.</span>
            </h1>
            <p className="text-sm text-stone-600 max-w-md">
              Welcome to my space. I'm {profileData.name}, a XII grade student passionate about data, creativity, and learning.
            </p>
          </div>

        </div>
      </section>

      <section id="about" className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-100 shadow-sm">
          <h2 className="text-2xl font-serif text-rose-950 mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-100" /> About Me
          </h2>
          <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
            <p>{profileData.aboutParagraphs[0]}</p>
            <p className="bg-rose-50/50 p-5 rounded-2xl text-rose-900 italic border-l-4 border-rose-300">
              {profileData.aboutParagraphs[1]}
            </p>
            <p>{profileData.aboutParagraphs[2]}</p>
          </div>
        </div>
      </section>

      <section id="upload" className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-100 shadow-sm">
          <h2 className="text-2xl font-serif text-rose-950 mb-6">Upload Tugas</h2>

          {!user ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                Fitur unggah tugas hanya tersedia untuk akun admin. Silakan login menggunakan akun administrator.
              </div>
              <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-stone-700">Email admin</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-stone-700 focus:border-rose-400 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-stone-700">Password admin</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-stone-700 focus:border-rose-400 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-rose-900 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-800 transition-colors"
              >
                Login Admin
              </button>
              {authError && <p className="text-sm text-rose-600">{authError}</p>}
            </form>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-700">Terhubung sebagai: <span className="font-semibold">{user?.email || 'Admin'}</span></p>
                  <p className="text-sm text-stone-500">{isAdmin ? 'Hak akses: Admin' : 'Hak akses: Tidak Admin'}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-full bg-stone-200 px-5 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-300 transition-colors"
                >
                  Logout
                </button>
              </div>
                {isAdmin ? (
                <form onSubmit={handleUpload} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-700">Nama Siswa</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Contoh: Diah"
                        className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-stone-700 focus:border-rose-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-700">Nama Lengkap</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Nurdiah Pitaloka"
                        className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-stone-700 focus:border-rose-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700">Kelas</label>
                    <input
                      type="text"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      placeholder="Contoh: XII IPS 2"
                      className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-stone-700 focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700">Judul Tugas</label>
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Contoh: Proposal Usaha Kerajinan"
                      className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-stone-700 focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700">File / Gambar Tugas</label>
                    <input
                      key={fileInputKey}
                      type="file"
                      accept=".pdf,.doc,.docx,.zip,.jpg,.png"
                      onChange={handleFileChange}
                      className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-stone-700 focus:border-rose-400 focus:outline-none"
                    />
                    {selectedFile && (
                      <p className="text-sm text-stone-600">File yang dipilih: <span className="font-semibold">{selectedFile.name}</span></p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700">Catatan (opsional)</label>
                    <textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      rows="3"
                      placeholder="Catatan tambahan untuk guru..."
                      className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-stone-700 focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-rose-900 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-800 transition-colors"
                  >
                    Unggah Tugas
                  </button>
                  {uploadStatus && (
                    <p className="text-sm text-stone-700">{uploadStatus}</p>
                  )}
                </form>
              ) : (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  Hanya admin yang boleh mengunggah tugas.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="daftar-tugas" className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-100 shadow-sm">
          <h2 className="text-2xl font-serif text-rose-950 mb-6">Daftar Tugas Terupload</h2>
          {loadingUploads ? (
            <p className="text-sm text-stone-600">Memuat daftar tugas...</p>
          ) : uploadsError ? (
            <p className="text-sm text-rose-600">{uploadsError}</p>
          ) : uploads.length === 0 ? (
            <p className="text-sm text-stone-600">Belum ada tugas yang diunggah.</p>
          ) : (
            <div className="space-y-4">
              {uploads.map((upload) => {
                const metadata = parseUploadDescription(upload);
                const previewSource = upload.file_path || upload.file_name;
                const previewIsImage = isImageFile(previewSource);
                const previewIsPdf = isPdfFile(previewSource);

                return (
                  <div key={upload.id} className="overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-rose-100 shadow-lg shadow-rose-200/70 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] p-4 sm:p-5">
                      <div className="rounded-3xl border border-rose-100 bg-white p-3 shadow-sm">
                        {previewIsImage ? (
                          <img
                            src={upload.file_url}
                            alt={upload.file_name}
                            className="h-44 w-full rounded-3xl object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : previewIsPdf ? (
                          <div className="flex h-44 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-rose-200 bg-rose-50 text-center px-4">
                            <span className="text-2xl font-semibold text-rose-700">PDF</span>
                            <p className="text-xs text-stone-500 mt-2">Klik buka untuk melihat preview PDF.</p>
                          </div>
                        ) : (
                          <div className="flex h-44 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-rose-200 bg-rose-50 text-center px-4">
                            <span className="text-xl font-semibold text-rose-700">{getFileTypeLabel(upload.file_name)}</span>
                            <p className="text-xs text-stone-500 mt-2">Preview file tersedia saat dibuka.</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">{getFileTypeLabel(upload.file_name)}</span>
                            <span className="text-xs text-stone-500">{new Date(upload.uploaded_at).toLocaleString('id-ID')}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-stone-900">
                            {metadata?.taskTitle ? `${metadata.taskTitle} • ${upload.file_name}` : upload.file_name}
                          </h3>
                          {!metadata?.taskTitle && (
                            <p className="text-sm text-stone-600 line-clamp-2">Judul tugas tidak tersedia</p>
                          )}
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="rounded-3xl bg-white/80 p-3 border border-rose-100 shadow-sm">
                            <p className="text-xs uppercase text-rose-500 tracking-[0.2em]">Siswa</p>
                            <p className="mt-1 text-sm text-stone-700">{metadata?.studentName || '-'}</p>
                          </div>
                          <div className="rounded-3xl bg-white/80 p-3 border border-rose-100 shadow-sm">
                            <p className="text-xs uppercase text-rose-500 tracking-[0.2em]">Kelas</p>
                            <p className="mt-1 text-sm text-stone-700">{metadata?.studentClass || '-'}</p>
                          </div>
                        </div>

                        <div className="rounded-3xl bg-white/80 p-4 border border-rose-100 shadow-sm">
                          <p className="text-xs uppercase text-rose-500 tracking-[0.2em]">Catatan</p>
                          <p className="mt-2 text-sm text-stone-600">{metadata?.notes || 'Tidak ada catatan tambahan.'}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={upload.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-rose-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-800"
                          >
                            Buka Preview
                          </a>
                          {isAdmin && editingUploadId !== upload.id && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(upload)}
                                className="rounded-full bg-stone-200 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-300 transition-colors"
                              >
                                Ubah nama
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUpload(upload)}
                                className="rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-900 hover:bg-rose-200 transition-colors"
                              >
                                Hapus
                              </button>
                            </>
                          )}
                        </div>
                        {editingUploadId === upload.id && (
                          <div className="rounded-3xl border border-rose-200 bg-white p-4 shadow-sm">
                            <div className="space-y-3">
                              <div className="flex flex-col sm:flex-row items-center gap-3">
                                <input
                                  value={editFileName}
                                  onChange={(e) => setEditFileName(e.target.value)}
                                  className="min-w-0 flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-rose-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveFileName(upload)}
                                  className="rounded-full bg-rose-900 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800 transition-colors"
                                >
                                  Simpan
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="rounded-full bg-stone-200 px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-300 transition-colors"
                                >
                                  Batal
                                </button>
                              </div>
                              <p className="text-xs text-stone-500">Ubah nama file tanpa memindahkan file di storage.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer id="contact" className="max-w-4xl mx-auto px-6 pt-6">
        <div className="bg-rose-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-md shadow-rose-950/10">
          <h2 className="text-2xl font-serif">Let's Connect</h2>
          <p className="text-rose-200 text-sm max-w-sm mx-auto">
            Feel free to reach out if you'd like to discuss data, projects, or connect!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={`https://instagram.com/${profileData.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-medium flex items-center gap-2 border border-white/10"
            >
              <Instagram className="w-4 h-4 text-rose-300" /> @{profileData.instagram}
            </a>
            
            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-full border border-white/10">
              <span className="px-4 text-sm font-medium text-rose-100">{profileData.email}</span>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-full bg-white text-rose-900 hover:bg-rose-50 transition-colors"
                title="Copy Email"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
