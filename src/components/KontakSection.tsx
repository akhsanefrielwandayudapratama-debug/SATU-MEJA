import React, { useState } from 'react';
import { MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const KontakSection: React.FC = () => {
  const [nama, setNama] = useState('');
  const [telepon, setTelepon] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState('2');
  const [waktu, setWaktu] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    const message = `Halo Barista Satu Meja! Saya ingin reservasi / bertanya:\n\n• Nama: ${nama}\n• No Telp/WA: ${telepon || '-'}\n• Jumlah Orang: ${jumlahOrang} orang\n• Waktu: ${waktu || 'Malam ini'}\n• Catatan: ${catatan || '-'}\n\nTerima kasih!`;
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/6281112131415?text=${encoded}`;

    window.open(waUrl, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2
              className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] tracking-tight mb-3"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Duduk Bersama di Satu Meja
            </h2>
            <p className="text-[#5C4535] text-sm leading-relaxed">
              Punya agenda diskusi santai, kumpul komunitas, atau sekadar ingin menyeduh kopi di keheningan malam? Kami menyambut Anda dengan hangat.
            </p>
          </div>

          <div className="space-y-4">
            {/* Alamat */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFC8] flex items-start gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EBE0CF] flex items-center justify-center text-[#2C1810] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#2C1810] text-sm sm:text-base">
                  Alamat Kedai
                </h4>
                <p className="text-xs sm:text-sm text-[#5C4535] mt-1 leading-relaxed">
                  Pesantren Ekonomi Darul Uchwah
                </p>
                <a
                  href="https://maps.google.com/?q=Pesantren+Ekonomi+Darul+Uchwah"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-xs font-bold text-[#8D3B2B] hover:underline"
                >
                  Buka di Google Maps ↗
                </a>
              </div>
            </div>

            {/* Jam Buka */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFC8] flex items-start gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EBE0CF] flex items-center justify-center text-[#2C1810] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#2C1810] text-sm sm:text-base">
                  Jam Buka
                </h4>
                <p className="text-xs sm:text-sm text-[#5C4535] mt-1 leading-relaxed">
                  Tergantung Mood Barista
                </p>
                <p className="text-[11px] text-[#8D6E63] italic mt-1">
                  (Biasanya buka sore hingga larut malam untuk menemani obrolan kawan)
                </p>
              </div>
            </div>

            {/* Kontak Resmi */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFC8] space-y-3 shadow-xs">
              <h4 className="font-bold text-[#2C1810] text-sm sm:text-base">
                Kontak & Media Sosial
              </h4>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://wa.me/6281112131415"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-xs sm:text-sm text-[#2C1810] hover:text-[#25D366] font-semibold transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#EAE1D0] flex items-center justify-center text-[#2C1810]">
                    📱
                  </span>
                  <span>WhatsApp: 081112131415</span>
                </a>

                <a
                  href="https://instagram.com/SATU_MEJA"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-xs sm:text-sm text-[#2C1810] hover:text-[#E1306C] font-semibold transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#EAE1D0] flex items-center justify-center text-[#2C1810]">
                    📸
                  </span>
                  <span>Instagram: @SATU_MEJA</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reservation / Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-white flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C1810]">
                Reservasi Meja & Obrolan
              </h3>
              <p className="text-xs text-[#7A6658]">
                Kirim pesan langsung ke Barista Satu Meja via WhatsApp.
              </p>
            </div>
          </div>

          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center gap-3 text-[#2E7D32]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold">
                Pesan reservasi sedang dibuka di WhatsApp! Barista kami akan segera merespons.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3E291D] mb-1.5">
                  Nama Anda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDB8] text-sm text-[#2C1810] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E291D] mb-1.5">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="0812xxxxxxx"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDB8] text-sm text-[#2C1810] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3E291D] mb-1.5">
                  Perkiraan Jumlah Orang
                </label>
                <select
                  value={jumlahOrang}
                  onChange={(e) => setJumlahOrang(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDB8] text-sm text-[#2C1810] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                >
                  <option value="1-2">1 - 2 Orang (Santai)</option>
                  <option value="3-4">3 - 4 Orang (Satu Meja)</option>
                  <option value="5-8">5 - 8 Orang (Rombongan Tongkrongan)</option>
                  <option value="9+">Lebih dari 8 Orang (Diskusi/Acara)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E291D] mb-1.5">
                  Rencana Waktu / Jam
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Malam ini jam 20:00"
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDB8] text-sm text-[#2C1810] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E291D] mb-1.5">
                Catatan Meja / Permintaan Khusus
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Meja pojok luar untuk merokok, butuh colokan charger laptop..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDB8] text-sm text-[#2C1810] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C1810]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#2C1810] hover:bg-[#432618] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Kirim ke WhatsApp Satu Meja</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
