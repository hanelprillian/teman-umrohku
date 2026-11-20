import {
  abdauBima,
  afwAfiyah,
  alIkhlas,
  alKafirun,
  ayatMaqam,
  doaMasukMasjid,
  doaZamzamIbnuAbbas,
  dzikirShafaMarwah,
  innashShafa,
  isytirath,
  rabbanaAtina,
  rabbanaTaqabbal,
  rabbighfirWarham,
  takbirHajarAswad,
  talbiyah,
  talbiyahUmroh,
} from "./duas";
import type { RoundHint, Session, SessionId } from "./types";

const ramlHints: RoundHint[] = [
  { audience: "pria", text: "Raml: jalan cepat, langkah pendek" },
  { audience: "wanita", text: "Berjalan biasa" },
];

const saiHints = (text: string): RoundHint[] => [
  { text },
  { audience: "pria", text: "Lari kecil di antara lampu hijau" },
];

const ihram: Session = {
  id: "ihram",
  title: "Ihram",
  subtitle: "Persiapan, niat di miqat & talbiyah",
  steps: [
    {
      id: "persiapan",
      title: "Persiapan Sebelum Miqat",
      instructions: [
        "Potong kuku dan rapikan rambut/bulu badan jika perlu.",
        "Mandi seperti mandi junub — termasuk wanita yang sedang haid atau nifas.",
        "Kenakan pakaian ihram sebelum sampai di miqat (di pesawat, miqat bisa terlewati tanpa terasa).",
      ],
      tips: [
        {
          audience: "pria",
          text: "Pakai wewangian di badan (bukan di kain ihram), lalu kenakan 2 lembar kain ihram (sarung & selendang) serta sandal yang tidak menutup mata kaki.",
        },
        {
          audience: "wanita",
          text: "Pakai pakaian syar'i biasa yang menutup aurat, warna bebas. Tidak memakai niqab (cadar) dan sarung tangan.",
        },
      ],
      dalil: [
        {
          source: "HR. Tirmidzi no. 830 (hadits Zaid bin Tsabit)",
          status: "hasan",
          quote: "Nabi ﷺ melepas pakaiannya untuk ihram dan mandi.",
        },
        {
          source: "HR. Muslim no. 1218 (hadits Jabir)",
          status: "shahih",
          note: "Asma' binti Umais yang baru melahirkan tetap diperintah mandi dan berihram.",
        },
        {
          source: "HR. Bukhari no. 1838",
          status: "shahih",
          quote: "Wanita yang berihram tidak memakai niqab dan sarung tangan.",
        },
      ],
    },
    {
      id: "niat",
      title: "Niat Ihram di Miqat",
      instructions: [
        "Setelah sampai di miqat (atau sejajar dengannya di pesawat), niatkan dalam hati untuk memulai umroh.",
        "Lalu ucapkan lafaz di bawah ini.",
        "Sejak saat ini, larangan-larangan ihram berlaku.",
      ],
      duas: [talbiyahUmroh, isytirath],
      tips: [
        {
          warning: true,
          text: "Larangan ihram: memotong rambut/kuku, memakai wewangian, berburu, akad nikah, dan berhubungan suami-istri.",
        },
        {
          audience: "pria",
          warning: true,
          text: "Pria juga dilarang memakai pakaian berjahit yang membentuk tubuh (baju, celana, kaos kaki) dan menutup kepala.",
        },
      ],
    },
    {
      id: "talbiyah",
      title: "Perbanyak Talbiyah",
      instructions: [
        "Sepanjang perjalanan menuju Masjidil Haram, perbanyak membaca talbiyah.",
        "Talbiyah dihentikan ketika mulai tawaf.",
      ],
      duas: [talbiyah],
      tips: [
        { audience: "pria", text: "Keraskan suara saat bertalbiyah." },
        { audience: "wanita", text: "Cukup dengan suara yang terdengar oleh diri sendiri." },
      ],
      dalil: [
        {
          source: "HR. Tirmidzi no. 919 & Abu Dawud no. 1817 (dari Ibnu Abbas)",
          status: "diperselisihkan",
          note: "Tentang berhentinya talbiyah umroh saat mulai tawaf. Sanadnya dibicarakan ulama, namun inilah yang diamalkan mayoritas ulama.",
        },
      ],
    },
    {
      id: "masuk-masjid",
      title: "Masuk Masjidil Haram",
      instructions: [
        "Masuk dengan mendahulukan kaki kanan dan membaca doa masuk masjid.",
        "Tidak ada doa khusus yang shahih saat pertama kali melihat Ka'bah — silakan berdoa bebas.",
        "Langsung menuju area tawaf. Tawaf ini sekaligus menggantikan shalat tahiyatul masjid.",
      ],
      duas: [doaMasukMasjid],
    },
  ],
};

const tawaf: Session = {
  id: "tawaf",
  title: "Tawaf",
  subtitle: "7 putaran mengelilingi Ka'bah",
  steps: [
    {
      id: "persiapan-tawaf",
      title: "Persiapan Tawaf",
      instructions: [
        "Pastikan dalam keadaan suci — berwudhu terlebih dahulu.",
        "Talbiyah dihentikan mulai sekarang.",
      ],
      tips: [
        {
          audience: "pria",
          text: "Idhthiba': letakkan bagian tengah selendang ihram di bawah ketiak kanan, ujungnya di atas bahu kiri, sehingga bahu kanan terbuka. Hanya selama 7 putaran tawaf ini.",
        },
        {
          audience: "wanita",
          warning: true,
          text: "Wanita yang sedang haid tidak tawaf sampai suci. Ibadah lainnya tetap boleh.",
        },
      ],
      dalil: [
        {
          source: "HR. Bukhari & Muslim (hadits Aisyah)",
          status: "shahih",
          quote:
            "Hal pertama yang beliau lakukan ketika tiba (di Makkah) adalah berwudhu, kemudian tawaf.",
        },
        {
          source: "HR. Abu Dawud & Tirmidzi (hadits Ya'la bin Umayyah)",
          status: "hasan",
          note: "Nabi ﷺ tawaf dalam keadaan idhthiba'.",
        },
        {
          source: "HR. Bukhari & Muslim (hadits Aisyah)",
          status: "shahih",
          quote:
            "Lakukanlah apa yang dilakukan orang yang berhaji, hanya saja jangan tawaf di Ka'bah sampai engkau suci.",
        },
      ],
    },
    {
      id: "mulai-hajar-aswad",
      title: "Mulai dari Hajar Aswad",
      instructions: [
        "Menuju sudut Ka'bah tempat Hajar Aswad — tandanya lampu hijau di dinding masjid.",
        "Posisikan Ka'bah di sebelah kiri tubuhmu.",
        "Menghadap Hajar Aswad, lalu istilam: cium jika mudah. Jika tidak, sentuh dengan tangan lalu cium tangan. Jika tidak bisa juga, cukup berisyarat dengan tangan kanan.",
        "Sambil istilam/isyarat, ucapkan:",
      ],
      duas: [takbirHajarAswad],
      tips: [
        {
          warning: true,
          text: "Jangan berdesakan atau menyakiti orang lain demi mencium Hajar Aswad. Isyarat dari jauh sudah sesuai sunnah.",
        },
      ],
    },
    {
      id: "putaran-tawaf",
      title: "Tawaf 7 Putaran",
      instructions: [
        "Berjalan berlawanan arah jarum jam, Ka'bah selalu di sebelah kiri.",
        "Tekan tombol besar setiap kali kembali ke garis Hajar Aswad.",
        "Di Rukun Yamani (sudut sebelum Hajar Aswad): sentuh jika mudah, tanpa dicium. Jika tidak bisa, lewati saja tanpa isyarat.",
        "Selain doa di bawah, bebas berdzikir, berdoa dengan bahasa apa pun, atau membaca Al-Qur'an.",
      ],
      counter: {
        total: 7,
        unit: "putaran",
        tapLabel: "Sampai di Hajar Aswad",
        rounds: [
          { label: "Putaran 1", hints: ramlHints },
          { label: "Putaran 2", hints: ramlHints },
          { label: "Putaran 3", hints: ramlHints },
          { label: "Putaran 4", hints: [{ text: "Berjalan biasa" }] },
          { label: "Putaran 5", hints: [{ text: "Berjalan biasa" }] },
          { label: "Putaran 6", hints: [{ text: "Berjalan biasa" }] },
          { label: "Putaran 7", hints: [{ text: "Putaran terakhir — berjalan biasa" }] },
        ],
      },
      duas: [takbirHajarAswad, rabbanaAtina],
      tips: [
        {
          text: "Tidak ada doa khusus untuk tiap putaran (doa putaran 1–7 di buku saku tidak berdasar dalil). Berdoalah sesuai hajatmu.",
        },
        {
          warning: true,
          text: "Hijr Ismail (area setengah lingkaran) adalah bagian dari Ka'bah. Tawaf harus di luarnya.",
        },
        {
          text: "Jika ragu sudah berapa putaran, ambil jumlah yang lebih sedikit (yang yakin).",
        },
      ],
      dalil: [
        {
          source: "HR. Bukhari & Muslim (hadits Ibnu Umar)",
          status: "shahih",
          note: "Nabi ﷺ melakukan raml pada tiga putaran pertama dan berjalan biasa pada empat putaran sisanya.",
        },
        {
          source: "HR. Bukhari & Muslim (hadits Ibnu Umar)",
          status: "shahih",
          note: "Nabi ﷺ tidak menyentuh bagian Ka'bah selain dua rukun Yamani (Hajar Aswad & Rukun Yamani).",
        },
      ],
    },
    {
      id: "tutup-bahu",
      title: "Tawaf Selesai",
      instructions: [
        "Alhamdulillah, 7 putaran tawaf telah selesai.",
        "Berikutnya: berdoa di Multazam (opsional), lalu shalat 2 rakaat di belakang Maqam Ibrahim.",
      ],
      tips: [
        {
          audience: "pria",
          text: "Tutup kembali bahu kanan (idhthiba' selesai) sebelum shalat.",
        },
      ],
      dalil: [
        {
          source: "HR. Bukhari no. 359",
          status: "shahih",
          quote:
            "Janganlah salah seorang dari kalian shalat dengan satu kain yang tidak ada sedikit pun darinya di atas pundaknya.",
        },
      ],
    },
    {
      id: "multazam",
      title: "Berdoa di Multazam",
      optional: true,
      instructions: [
        "Multazam adalah dinding Ka'bah di antara Hajar Aswad dan pintu Ka'bah.",
        "Jika memungkinkan, tempelkan dada, wajah, dan kedua lengan ke dinding, lalu berdoa.",
        "Doanya bebas — tidak ada lafaz khusus dari Nabi ﷺ. Berikut contoh doa dari Al-Qur'an dan hadits shahih:",
      ],
      duas: [rabbanaTaqabbal, rabbanaAtina, afwAfiyah],
      tips: [
        {
          warning: true,
          text: "Jika penuh sesak, cukup berdoa dari kejauhan sambil menghadap Ka'bah. Menghindari menyakiti orang lain lebih didahulukan daripada mengejar amalan sunnah.",
        },
      ],
      dalil: [
        {
          source: "HR. Abu Dawud (dari Amr bin Syu'aib, dari ayahnya, dari kakeknya)",
          status: "diperselisihkan",
          note: "Dinilai hasan oleh sebagian ulama (termasuk Syaikh Al-Albani) karena jalur-jalur penguatnya; sebagian lain melemahkannya. Juga diamalkan oleh sebagian sahabat.",
        },
      ],
    },
  ],
};

const maqam: Session = {
  id: "maqam",
  title: "Maqam Ibrahim",
  subtitle: "Shalat 2 rakaat setelah tawaf",
  steps: [
    {
      id: "menuju-maqam",
      title: "Menuju Maqam Ibrahim",
      instructions: [
        "Berjalan menuju Maqam Ibrahim sambil membaca ayat berikut.",
        "Jika memungkinkan, posisikan Maqam Ibrahim di antara dirimu dan Ka'bah.",
      ],
      duas: [ayatMaqam],
      tips: [
        {
          text: "Jika area di belakang Maqam penuh, shalat di bagian mana saja di Masjidil Haram — tetap sah.",
        },
        {
          warning: true,
          text: "Jangan shalat di jalur orang yang sedang tawaf.",
        },
      ],
    },
    {
      id: "shalat-dua-rakaat",
      title: "Shalat 2 Rakaat",
      instructions: [
        "Shalat 2 rakaat dengan ringan (tidak panjang).",
        "Rakaat pertama: Al-Fatihah lalu Al-Kafirun.",
        "Rakaat kedua: Al-Fatihah lalu Al-Ikhlas.",
      ],
      duas: [alKafirun, alIkhlas],
      tips: [
        {
          text: "Shalat setelah tawaf boleh dikerjakan kapan saja, termasuk di waktu yang biasanya terlarang untuk shalat.",
        },
      ],
      dalil: [
        {
          source: "HR. Tirmidzi no. 868 (hadits Jubair bin Muth'im)",
          status: "shahih",
          quote:
            "Wahai Bani Abdi Manaf, janganlah kalian melarang seorang pun tawaf di Baitullah ini dan shalat kapan pun ia mau, di waktu malam maupun siang.",
        },
      ],
    },
  ],
};

const zamzam: Session = {
  id: "zamzam",
  title: "Air Zamzam",
  subtitle: "Minum & berdoa",
  steps: [
    {
      id: "minum-zamzam",
      title: "Minum Air Zamzam",
      instructions: [
        "Ambil air Zamzam dari galon/kran yang tersedia di sekitar area tawaf.",
        "Ucapkan Bismillah, lalu minum. Boleh sambil berdiri.",
        "Minumlah sampai puas, dan berdoalah dengan hajat apa pun — doa bebas.",
      ],
      duas: [doaZamzamIbnuAbbas],
      dalil: [
        {
          source: "HR. Ibnu Majah no. 3062 (hadits Jabir)",
          status: "shahih",
          quote: "Air Zamzam sesuai dengan niat orang yang meminumnya.",
          note: "Dinilai shahih oleh Syaikh Al-Albani.",
        },
        {
          source: "HR. Muslim no. 2473 (hadits Abu Dzar)",
          status: "shahih",
          quote: "Sesungguhnya ia (Zamzam) penuh berkah, dan ia adalah makanan yang mengenyangkan.",
        },
        {
          source: "HR. Bukhari no. 1637 (hadits Ibnu Abbas)",
          status: "shahih",
          quote: "Aku memberi Rasulullah ﷺ air Zamzam, lalu beliau minum sambil berdiri.",
        },
      ],
    },
    {
      id: "kembali-hajar-aswad",
      title: "Kembali ke Hajar Aswad",
      optional: true,
      instructions: [
        "Jika mudah, kembali ke Hajar Aswad dan istilam (menyentuh/mencium) sebelum menuju Shafa.",
        "Jika ramai, lewati langkah ini dan langsung menuju Shafa.",
      ],
      dalil: [
        {
          source: "HR. Muslim no. 1218 (hadits Jabir)",
          status: "shahih",
          quote:
            "Kemudian beliau kembali ke rukun (Hajar Aswad) lalu menyentuhnya, kemudian keluar dari pintu menuju Shafa.",
        },
      ],
    },
  ],
};

const sai: Session = {
  id: "sai",
  title: "Sa'i",
  subtitle: "7 perjalanan antara Shafa & Marwah",
  steps: [
    {
      id: "menuju-shafa",
      title: "Menuju Bukit Shafa",
      instructions: [
        "Ikuti petunjuk arah \"Safa\" di dalam masjid.",
        "Ketika mendekati Shafa, bacalah ayat dan lafaz berikut — hanya sekali, di awal sa'i.",
      ],
      duas: [innashShafa, abdauBima],
    },
    {
      id: "di-shafa",
      title: "Di Atas Shafa",
      instructions: [
        "Naik ke bukit Shafa sampai bisa melihat Ka'bah (atau menghadap ke arahnya).",
        "Menghadap kiblat, angkat kedua tangan seperti berdoa.",
        "Baca dzikir berikut, lalu berdoa bebas. Ulangi dzikir + doa sebanyak 3 kali.",
      ],
      duas: [dzikirShafaMarwah],
      tips: [
        {
          text: "Mengangkat tangan di sini untuk berdoa — bukan isyarat seperti takbiratul ihram shalat.",
        },
      ],
    },
    {
      id: "perjalanan-sai",
      title: "Sa'i 7 Perjalanan",
      instructions: [
        "Turun dari Shafa dan berjalan menuju Marwah.",
        "Sampai di lampu hijau pertama: pria berlari kecil hingga lampu hijau berikutnya, lalu berjalan biasa lagi. Wanita tetap berjalan biasa.",
        "Di antara dua lampu hijau, boleh membaca \"Rabbighfir warḥam…\" seperti yang dibaca para sahabat.",
        "Tekan tombol besar setiap kali sampai di bukit tujuan.",
        "Setiap sampai di Shafa/Marwah: menghadap kiblat, baca dzikir yang sama, lalu berdoa (3 kali).",
        "Selama perjalanan, bebas berdzikir, berdoa, atau membaca Al-Qur'an.",
      ],
      counter: {
        total: 7,
        unit: "perjalanan",
        tapLabel: "Sampai di bukit tujuan",
        rounds: [
          { label: "Shafa → Marwah", hints: saiHints("Perjalanan 1") },
          { label: "Marwah → Shafa", hints: saiHints("Perjalanan 2") },
          { label: "Shafa → Marwah", hints: saiHints("Perjalanan 3") },
          { label: "Marwah → Shafa", hints: saiHints("Perjalanan 4") },
          { label: "Shafa → Marwah", hints: saiHints("Perjalanan 5") },
          { label: "Marwah → Shafa", hints: saiHints("Perjalanan 6") },
          {
            label: "Shafa → Marwah",
            hints: saiHints("Perjalanan terakhir — selesai di Marwah"),
          },
        ],
      },
      duas: [dzikirShafaMarwah, rabbighfirWarham],
      tips: [
        {
          audience: "pria",
          text: "Di antara dua tanda lampu hijau, berlari kecil. Selebihnya berjalan biasa.",
        },
        {
          audience: "wanita",
          text: "Berjalan biasa sepanjang sa'i, termasuk di area lampu hijau.",
        },
        {
          text: "Tidak ada doa khusus dari Nabi ﷺ saat masuk atau keluar area lampu hijau. Doa panjang khusus per putaran yang beredar di beberapa buku tidak ada dasarnya dari hadits.",
          warning: true,
        },
        {
          text: "Dari Shafa ke Marwah dihitung 1, kembali ke Shafa dihitung 2, dan seterusnya. Sa'i berakhir di Marwah.",
        },
      ],
      dalil: [
        {
          source: "HR. Muslim no. 1218 (hadits Jabir)",
          status: "shahih",
          quote:
            "…hingga ketika kedua kaki beliau menginjak dasar lembah, beliau berlari kecil. Ketika sudah naik, beliau berjalan hingga sampai di Marwah.",
          note: "Dasar lembah itu kini ditandai dengan lampu hijau.",
        },
        {
          source: "Atsar Ibnu Umar, riwayat Al-Baihaqi dalam As-Sunan Al-Kubra",
          status: "atsar",
          quote:
            "Wanita tidak berlari kecil saat thawaf di Baitullah, tidak pula di antara Shafa dan Marwah.",
        },
      ],
    },
  ],
};

const tahallul: Session = {
  id: "tahallul",
  title: "Tahallul",
  subtitle: "Mencukur / memotong rambut",
  steps: [
    {
      id: "cukur",
      title: "Cukur atau Potong Rambut",
      instructions: [
        "Setelah sa'i selesai, potong atau cukur rambut sebagai penutup umroh.",
      ],
      tips: [
        {
          audience: "pria",
          text: "Mencukur gundul lebih utama. Boleh juga memendekkan rambut secara merata di seluruh kepala.",
        },
        {
          audience: "wanita",
          text: "Cukup potong ujung rambut kira-kira seruas jari. Wanita tidak mencukur gundul.",
        },
      ],
      dalil: [
        {
          source: "HR. Bukhari no. 1727 & Muslim no. 1301 (hadits Ibnu Umar)",
          status: "shahih",
          note: "Nabi ﷺ mendoakan rahmat untuk orang yang mencukur gundul tiga kali, dan untuk yang memendekkan rambut satu kali.",
        },
        {
          source: "HR. Abu Dawud (hadits Ibnu Abbas)",
          status: "shahih",
          quote: "Wanita tidak wajib mencukur, tetapi cukup memendekkan rambut.",
          note: "Dinilai shahih oleh Syaikh Al-Albani.",
        },
      ],
    },
    {
      id: "selesai",
      title: "Alhamdulillah, Umroh Selesai",
      instructions: [
        "Semua larangan ihram kini telah gugur.",
        "Perbanyak syukur kepada Allah dan berdoalah agar umrohmu diterima.",
      ],
      duas: [rabbanaTaqabbal],
    },
  ],
};

export const sessions: Session[] = [ihram, tawaf, maqam, zamzam, sai, tahallul];

export const getSession = (id: string): Session | undefined =>
  sessions.find((session) => session.id === id);

export const getNextSession = (id: SessionId): Session | undefined => {
  const index = sessions.findIndex((session) => session.id === id);
  return sessions[index + 1];
};
