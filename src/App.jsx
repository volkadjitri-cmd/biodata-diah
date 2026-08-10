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

  useEffect(() => {
    const loadUploads = async () => {
      setLoadingUploads(true);
      setUploadsError("");

      const { data, error } = await supabase
        .from('uploads')
        .select('id, file_name, file_url, uploaded_at, user_id')
        .order('uploaded_at', { ascending: false });

      if (error) {
        setUploadsError(`Gagal memuat daftar tugas: ${error.message}`);
      } else {
        setUploads(data || []);
      }

      setLoadingUploads(false);
    };

    loadUploads();
  }, []);

  const checkAdmin = async (currentUser) => {
    setAuthError("");
    setUploadStatus("");

    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || profileData.email || "nurdiahptugas@gmail.com").toLowerCase();

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (!error && data?.role) {
      setIsAdmin(data.role === 'admin');
      return;
    }

    const normalizedEmail = currentUser?.email?.toLowerCase();
    setIsAdmin(Boolean(normalizedEmail && normalizedEmail === adminEmail));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0] || null);
    setUploadStatus("");
  };

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
      setUploadStatus(`Gagal mengunggah file: ${uploadError.message}`);
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
          user_id: user?.id || null
        }
      ]);

    if (insertError) {
      setUploadStatus(`File terunggah, tetapi gagal menyimpan metadata: ${insertError.message}`);
      return;
    }

    setUploadStatus(`File ${selectedFile.name} berhasil diunggah ke Supabase.`);
    setSelectedFile(null);
    setFileInputKey(Date.now());
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
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700">Pilih file tugas</label>
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
              {uploads.map((upload) => (
                <div key={upload.id} className="rounded-3xl border border-rose-100 bg-rose-50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-900">{upload.file_name}</p>
                      <p className="text-xs text-stone-500 mt-1">Diunggah oleh: {upload.user_id || 'Tidak diketahui'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={upload.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-rose-900 hover:text-rose-700"
                      >
                        Buka file
                      </a>
                      <span className="text-xs text-stone-500">
                        {new Date(upload.uploaded_at).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
