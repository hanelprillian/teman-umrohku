import type { Audience, Dalil } from "./types";

export interface IhramRule {
  title: string;
  detail?: string;
  audience?: Audience;
  dalil: Dalil[];
}

export const prohibitions: IhramRule[] = [
  {
    title: "Memakai wewangian",
    detail:
      "Pada badan, pakaian ihram, maupun makanan/minuman. Hindari sabun, sampo, tisu basah, dan lotion yang wangi. Wangi yang dipakai sebelum niat lalu masih tersisa tidak mengapa.",
    dalil: [
      {
        source: "HR. Bukhari no. 1838 & Muslim no. 1177 (hadits Ibnu Umar)",
        status: "shahih",
        quote: "…dan janganlah memakai pakaian yang terkena za'faran atau wars (pewangi).",
      },
      {
        source: "HR. Bukhari no. 1265 & Muslim no. 1206 (hadits Ibnu Abbas)",
        status: "shahih",
        quote: "Tentang orang yang wafat saat ihram: “…dan jangan diberi wewangian.”",
      },
    ],
  },
  {
    title: "Mencukur atau mencabut rambut",
    detail: "Rambut kepala maupun bulu badan lainnya, sampai tahallul.",
    dalil: [
      {
        source: "QS. Al-Baqarah: 196",
        status: "quran",
        quote:
          "…dan jangan kamu mencukur kepalamu, sebelum hewan kurban sampai di tempat penyembelihannya.",
      },
    ],
  },
  {
    title: "Memotong kuku",
    dalil: [
      {
        source: "Ibnul Mundzir, Al-Ijma'",
        status: "ijma",
        note: "Para ulama sepakat orang yang berihram dilarang memotong kuku, diqiyaskan dengan mencukur rambut.",
      },
    ],
  },
  {
    title: "Menikah, menikahkan, atau melamar",
    dalil: [
      {
        source: "HR. Muslim no. 1409 (hadits Utsman bin Affan)",
        status: "shahih",
        quote:
          "Orang yang berihram tidak boleh menikah, tidak boleh dinikahkan, dan tidak boleh melamar.",
      },
    ],
  },
  {
    title: "Berhubungan suami istri dan pendahuluannya",
    detail:
      "Termasuk bercumbu dengan syahwat. Jima' sebelum tahallul merusak umroh dan ada kewajiban dam — segera tanyakan pembimbing bila terjadi.",
    dalil: [
      {
        source: "QS. Al-Baqarah: 197",
        status: "quran",
        quote: "…maka tidak boleh rafats (berkata/berbuat yang menjurus ke jima'), berbuat fasik, dan berbantah-bantahan…",
      },
    ],
  },
  {
    title: "Berburu hewan darat",
    detail: "Termasuk membantu atau menunjukkan buruan. Hewan laut dan ternak tidak termasuk.",
    dalil: [
      {
        source: "QS. Al-Ma'idah: 95–96",
        status: "quran",
        quote: "Wahai orang-orang yang beriman, janganlah kamu membunuh hewan buruan ketika kamu sedang ihram…",
      },
    ],
  },
  {
    title: "Bertengkar, berkata kotor, dan maksiat",
    detail: "Dilarang kapan saja, tetapi lebih ditekankan saat ihram dan di tanah haram.",
    dalil: [{ source: "QS. Al-Baqarah: 197", status: "quran" }],
  },
  {
    title: "Memakai pakaian yang membentuk tubuh",
    detail:
      "Seperti baju, kemeja, celana, gamis, celana dalam, jubah, dan kaus kaki/sepatu yang menutup mata kaki. Cukup kain ihram (izar & rida') dan sandal.",
    audience: "pria",
    dalil: [
      {
        source: "HR. Bukhari no. 1542 & Muslim no. 1177 (hadits Ibnu Umar)",
        status: "shahih",
        quote:
          "Janganlah memakai gamis, sorban, celana panjang, burnus (baju bertudung), dan khuf (sepatu)…",
      },
    ],
  },
  {
    title: "Menutup kepala dengan sesuatu yang menempel",
    detail: "Seperti peci, topi, atau sorban. Berteduh di bawah payung atau tenda tidak mengapa.",
    audience: "pria",
    dalil: [
      {
        source: "HR. Bukhari no. 1265 & Muslim no. 1206 (hadits Ibnu Abbas)",
        status: "shahih",
        quote: "Tentang orang yang wafat saat ihram: “…dan jangan tutupi kepalanya.”",
      },
      {
        source: "HR. Muslim no. 1298 (hadits Ummul Hushain)",
        status: "shahih",
        note: "Usamah/Bilal menaungi Nabi ﷺ dengan kain dari terik matahari saat beliau berihram.",
      },
    ],
  },
  {
    title: "Memakai cadar (niqab) dan sarung tangan",
    detail:
      "Wanita tetap menutup aurat dengan pakaian biasa. Boleh menjulurkan kain dari atas kepala untuk menutup wajah saat berpapasan dengan laki-laki non-mahram.",
    audience: "wanita",
    dalil: [
      {
        source: "HR. Bukhari no. 1838 (hadits Ibnu Umar)",
        status: "shahih",
        quote: "Wanita yang berihram tidak memakai niqab dan tidak memakai sarung tangan.",
      },
      {
        source: "Atsar Asma' binti Abi Bakr, riwayat Al-Hakim",
        status: "atsar",
        quote:
          "Kami menutup wajah kami dari pandangan laki-laki, dan kami menyisir rambut sebelum itu, ketika ihram.",
      },
    ],
  },
];

export const allowed: string[] = [
  "Mandi, keramas, dan berganti kain ihram (tanpa sabun/sampo wangi).",
  "Memakai jam tangan, kacamata, cincin, sabuk/tas pinggang, dan sandal.",
  "Berteduh di bawah payung, tenda, atau di dalam kendaraan.",
  "Menggaruk kepala dengan pelan, walau ada rambut yang rontok tanpa sengaja.",
  "Berbekam atau mengobati luka.",
];

export const allowedDalil: Dalil[] = [
  {
    source: "HR. Bukhari no. 1840 & Muslim no. 1205 (hadits Abu Ayyub)",
    status: "shahih",
    note: "Abu Ayyub mencontohkan cara Nabi ﷺ mandi ketika berihram.",
  },
  {
    source: "HR. Bukhari no. 1836 & Muslim no. 1203 (hadits Ibnu Buhainah)",
    status: "shahih",
    note: "Nabi ﷺ berbekam ketika sedang berihram.",
  },
];

export const forgetting = {
  text: "Melanggar karena lupa atau tidak tahu: tidak berdosa dan tidak ada fidyah menurut pendapat yang kuat. Segera hentikan begitu ingat — lepas pakaiannya atau bersihkan wewangiannya.",
  dalil: [
    {
      source: "HR. Bukhari no. 1536 & Muslim no. 1180 (hadits Ya'la bin Umayyah)",
      status: "shahih",
      note: "Seseorang berihram memakai jubah berwewangian karena tidak tahu. Nabi ﷺ menyuruhnya melepas jubah dan mencuci wewangian, tanpa memerintahkan fidyah.",
    },
  ] satisfies Dalil[],
};

export const fidyah = {
  text: "Pelanggaran yang disengaja (selain jima' dan berburu) wajib fidyah, pilih salah satu: puasa 3 hari, memberi makan 6 orang miskin (masing-masing ½ sha' ≈ 1,5 kg makanan pokok), atau menyembelih seekor kambing.",
  dalil: [
    { source: "QS. Al-Baqarah: 196", status: "quran" },
    {
      source: "HR. Bukhari no. 1814 & Muslim no. 1201 (hadits Ka'ab bin 'Ujrah)",
      status: "shahih",
      note: "Asal hukumnya tentang mencukur rambut karena uzur; para ulama mengqiyaskan larangan lain kepadanya.",
    },
  ] satisfies Dalil[],
};
