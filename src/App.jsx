import React, { useState } from 'react';
import {
  User,
  Instagram,
  Copy,
  CheckCircle2,
  Calendar,
  MapPin,
  Target,
  BookOpen,
  Quote,
  Sparkles,
  Heart
} from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#FFF8F9] text-stone-800 font-sans selection:bg-rose-200 selection:text-rose-900 pb-20">
      
      <nav className="sticky top-0 z-40 bg-[#FFF8F9]/80 backdrop-blur-md border-b border-rose-100/60">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-serif font-bold text-rose-900 text-lg tracking-wider">NP</span>
          <div className="flex gap-6 text-xs font-medium text-stone-600">
            <a href="#profile" className="hover:text-rose-700 transition-colors">Profile</a>
            <a href="#biodata" className="hover:text-rose-700 transition-colors">Biodata</a>
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

      <section id="biodata" className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm">
            <h2 className="text-rose-900 font-serif text-xl mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-rose-600" /> Identitas Diri
            </h2>
            <div className="space-y-4 text-sm text-stone-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><User size={14}/></div>
                <div>
                  <span className="text-xs text-stone-400 block">Nama Lengkap</span>
                  <span className="font-medium text-stone-800">{profileData.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><Calendar size={14}/></div>
                <div>
                  <span className="text-xs text-stone-400 block">Tanggal Lahir</span>
                  <span className="font-medium text-stone-800">{profileData.biodata.dob}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><MapPin size={14}/></div>
                <div>
                  <span className="text-xs text-stone-400 block">Sekolah & Tingkat</span>
                  <span className="font-medium text-stone-800">{profileData.school} ({profileData.grade})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/40 p-8 rounded-3xl border border-rose-100 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="text-rose-950 font-serif text-sm font-bold flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-rose-600" /> Hobi
                </h3>
                <p className="text-sm text-stone-600">{profileData.biodata.hobbies}</p>
              </div>
              <div>
                <h3 className="text-rose-950 font-serif text-sm font-bold flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-rose-600" /> Cita-Cita
                </h3>
                <p className="text-sm text-stone-600">{profileData.biodata.dream}</p>
              </div>
              <div className="pt-3 border-t border-rose-200/50">
                <h3 className="text-rose-950 font-serif text-sm font-bold flex items-center gap-2 mb-1">
                  <Quote className="w-4 h-4 text-rose-600" /> Motto Hidup
                </h3>
                <p className="text-sm italic text-rose-900 font-serif">"{profileData.biodata.motto}"</p>
              </div>
            </div>
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
