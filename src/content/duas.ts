import type { Dua } from "./types";

export const talbiyahUmroh: Dua = {
  id: "talbiyah-umroh",
  title: "Lafaz niat umroh",
  arabic: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً",
  latin: "Labbaika Allāhumma 'umrah.",
  translation: "Aku penuhi panggilan-Mu ya Allah, untuk menunaikan umroh.",
  dalil: [
    {
      source: "HR. Muslim no. 1251 (hadits Anas bin Malik)",
      status: "shahih",
      note: "Niat tempatnya di hati. Lafaz ini adalah talbiyah dengan menyebut jenis ibadah, sebagaimana dicontohkan Nabi ﷺ.",
    },
  ],
};

export const isytirath: Dua = {
  id: "isytirath",
  title: "Isytirath (jika khawatir ada halangan, mis. sakit)",
  arabic: "اللَّهُمَّ مَحِلِّي حَيْثُ حَبَسْتَنِي",
  latin: "Allāhumma maḥillī ḥaitsu ḥabastanī.",
  translation: "Ya Allah, tempat tahallulku adalah di mana Engkau menahanku.",
  dalil: [
    {
      source: "HR. Bukhari no. 5089 & Muslim no. 1207 (kisah Dhuba'ah binti Az-Zubair)",
      status: "shahih",
      note: "Hanya dianjurkan bagi yang khawatir tidak bisa menyelesaikan umroh.",
    },
  ],
};

export const talbiyah: Dua = {
  id: "talbiyah",
  title: "Talbiyah",
  arabic:
    "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
  latin:
    "Labbaika Allāhumma labbaik, labbaika lā syarīka laka labbaik, innal-ḥamda wan-ni'mata laka wal-mulk, lā syarīka lak.",
  translation:
    "Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Aku penuhi panggilan-Mu, tiada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, nikmat, dan kerajaan adalah milik-Mu. Tiada sekutu bagi-Mu.",
  repeat: "Perbanyak sepanjang perjalanan",
  dalil: [
    {
      source: "HR. Bukhari no. 1549 & Muslim no. 1184 (hadits Ibnu Umar)",
      status: "shahih",
    },
  ],
};

export const doaMasukMasjid: Dua = {
  id: "masuk-masjid",
  title: "Doa masuk masjid",
  arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
  latin: "Allāhummaftaḥ lī abwāba raḥmatik.",
  translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
  dalil: [{ source: "HR. Muslim no. 713", status: "shahih" }],
};

export const takbirHajarAswad: Dua = {
  id: "takbir-hajar-aswad",
  title: "Saat istilam / isyarat ke Hajar Aswad",
  arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ",
  latin: "Bismillāhi wallāhu akbar.",
  translation: "Dengan nama Allah, dan Allah Mahabesar.",
  repeat: "Setiap kali melewati Hajar Aswad",
  dalil: [
    {
      source: "HR. Bukhari no. 1613 (hadits Ibnu Abbas)",
      status: "shahih",
      quote:
        "Nabi ﷺ tawaf di atas untanya. Setiap kali sampai di rukun (Hajar Aswad), beliau berisyarat kepadanya dan bertakbir.",
    },
    {
      source: "Atsar Ibnu Umar, riwayat Al-Baihaqi",
      status: "atsar",
      note: "Tambahan lafaz \"Bismillah\". Sanadnya dinilai shahih oleh Syaikh Al-Albani.",
    },
  ],
};

export const rabbanaAtina: Dua = {
  id: "rabbana-atina",
  title: "Antara Rukun Yamani dan Hajar Aswad",
  arabic:
    "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  latin:
    "Rabbanā ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā 'ażāban-nār.",
  translation:
    "Wahai Rabb kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.",
  dalil: [
    {
      source: "HR. Abu Dawud no. 1892 (hadits Abdullah bin As-Sa'ib)",
      status: "hasan",
      note: "Dinilai hasan oleh Syaikh Al-Albani. Lafaznya dari QS. Al-Baqarah: 201.",
    },
  ],
};

export const rabbanaTaqabbal: Dua = {
  id: "rabbana-taqabbal",
  title: "Doa Nabi Ibrahim saat membangun Ka'bah",
  arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
  latin: "Rabbanā taqabbal minnā, innaka antas-samī'ul-'alīm.",
  translation:
    "Wahai Rabb kami, terimalah (amal) dari kami. Sesungguhnya Engkau Maha Mendengar lagi Maha Mengetahui.",
  dalil: [{ source: "QS. Al-Baqarah: 127", status: "quran" }],
};

export const afwAfiyah: Dua = {
  id: "afw-afiyah",
  title: "Memohon ampunan dan keselamatan",
  arabic:
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
  latin: "Allāhumma innī as'alukal-'afwa wal-'āfiyata fid-dunyā wal-ākhirah.",
  translation:
    "Ya Allah, sesungguhnya aku memohon kepada-Mu ampunan dan keselamatan di dunia dan akhirat.",
  dalil: [
    {
      source: "HR. Abu Dawud no. 5074 & Ibnu Majah no. 3871 (hadits Ibnu Umar)",
      status: "shahih",
    },
  ],
};

export const ayatMaqam: Dua = {
  id: "ayat-maqam",
  title: "Dibaca sambil berjalan ke Maqam Ibrahim",
  arabic: "وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى",
  latin: "Wattakhiżū min maqāmi Ibrāhīma muṣallā.",
  translation: "Dan jadikanlah sebagian Maqam Ibrahim sebagai tempat shalat.",
  dalil: [
    { source: "QS. Al-Baqarah: 125", status: "quran" },
    {
      source: "HR. Muslim no. 1218 (hadits Jabir)",
      status: "shahih",
      note: "Nabi ﷺ membaca ayat ini ketika menuju Maqam Ibrahim setelah tawaf.",
    },
  ],
};

export const alKafirun: Dua = {
  id: "al-kafirun",
  title: "Rakaat 1 — setelah Al-Fatihah: QS. Al-Kafirun",
  arabic:
    "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
  latin:
    "Qul yā ayyuhal-kāfirūn. Lā a'budu mā ta'budūn. Wa lā antum 'ābidūna mā a'bud. Wa lā ana 'ābidum mā 'abadtum. Wa lā antum 'ābidūna mā a'bud. Lakum dīnukum wa liya dīn.",
  translation:
    "Katakanlah: \"Wahai orang-orang kafir! Aku tidak akan menyembah apa yang kamu sembah. Dan kamu bukan penyembah apa yang aku sembah. Dan aku tidak pernah menjadi penyembah apa yang kamu sembah. Dan kamu tidak pernah (pula) menjadi penyembah apa yang aku sembah. Untukmu agamamu, dan untukku agamaku.\"",
  dalil: [
    {
      source: "HR. Muslim no. 1218 (hadits Jabir)",
      status: "shahih",
      note: "Nabi ﷺ membaca Al-Kafirun dan Al-Ikhlas dalam dua rakaat setelah tawaf.",
    },
  ],
};

export const alIkhlas: Dua = {
  id: "al-ikhlas",
  title: "Rakaat 2 — setelah Al-Fatihah: QS. Al-Ikhlas",
  arabic:
    "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
  latin:
    "Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul lahū kufuwan aḥad.",
  translation:
    "Katakanlah: \"Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu pun yang setara dengan Dia.\"",
  dalil: [{ source: "HR. Muslim no. 1218 (hadits Jabir)", status: "shahih" }],
};

export const doaZamzamIbnuAbbas: Dua = {
  id: "doa-zamzam",
  title: "Contoh doa (opsional)",
  arabic:
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ",
  latin:
    "Allāhumma innī as'aluka 'ilman nāfi'an, wa rizqan wāsi'an, wa syifā'an min kulli dā'.",
  translation:
    "Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang luas, dan kesembuhan dari segala penyakit.",
  dalil: [
    {
      source: "Atsar Ibnu Abbas, riwayat Ad-Daraquthni & Al-Hakim",
      status: "diperselisihkan",
      note: "Sanadnya dinilai lemah oleh sebagian ulama. Boleh dibaca sebagai doa umum, namun tidak diyakini sebagai doa khusus Zamzam. Yang utama: berdoa bebas sesuai hajat.",
    },
  ],
};

export const innashShafa: Dua = {
  id: "innash-shafa",
  title: "Saat mendekati Shafa (sekali saja, di awal sa'i)",
  arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ",
  latin: "Innaṣ-ṣafā wal-marwata min sya'ā'irillāh.",
  translation: "Sesungguhnya Shafa dan Marwah adalah sebagian dari syi'ar-syi'ar Allah.",
  dalil: [
    { source: "QS. Al-Baqarah: 158", status: "quran" },
    { source: "HR. Muslim no. 1218 (hadits Jabir)", status: "shahih" },
  ],
};

export const abdauBima: Dua = {
  id: "abdau-bima",
  title: "Lanjutkan dengan",
  arabic: "أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
  latin: "Abda'u bimā bada'allāhu bih.",
  translation: "Aku memulai dengan apa yang Allah mulai (dalam firman-Nya).",
  dalil: [{ source: "HR. Muslim no. 1218 (hadits Jabir)", status: "shahih" }],
};

export const dzikirShafaMarwah: Dua = {
  id: "dzikir-shafa-marwah",
  title: "Dzikir di atas Shafa & Marwah",
  arabic:
    "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ. لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ. لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ",
  latin:
    "Allāhu akbar, Allāhu akbar, Allāhu akbar. Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu, wa huwa 'alā kulli syai'in qadīr. Lā ilāha illallāhu waḥdah, anjaza wa'dah, wa naṣara 'abdah, wa hazamal-aḥzāba waḥdah.",
  translation:
    "Allah Mahabesar (3x). Tiada ilah yang berhak disembah selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan bagi-Nya segala pujian, dan Dia Mahakuasa atas segala sesuatu. Tiada ilah selain Allah semata. Dia telah menepati janji-Nya, menolong hamba-Nya, dan mengalahkan pasukan sekutu sendirian.",
  repeat: "3 kali, diselingi doa bebas",
  dalil: [
    {
      source: "HR. Muslim no. 1218 (hadits Jabir)",
      status: "shahih",
      quote:
        "…beliau menghadap kiblat, mentauhidkan Allah dan bertakbir… lalu berdoa di antaranya. Beliau mengucapkan seperti ini tiga kali. Kemudian beliau melakukan di Marwah seperti yang beliau lakukan di Shafa.",
    },
  ],
};

export const rabbighfirWarham: Dua = {
  id: "rabbighfir-warham",
  title: "Dzikir saat sa'i (opsional)",
  arabic: "رَبِّ اغْفِرْ وَارْحَمْ، إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ",
  latin: "Rabbighfir warḥam, innaka antal-a'azzul-akram.",
  translation:
    "Wahai Rabbku, ampunilah dan rahmatilah. Sesungguhnya Engkau Mahaperkasa lagi Mahamulia.",
  dalil: [
    {
      source: "Atsar Ibnu Mas'ud & Ibnu Umar, riwayat Ibnu Abi Syaibah",
      status: "atsar",
      note: "Dibaca para sahabat saat sa'i. Sanadnya dinilai shahih oleh Syaikh Al-Albani. Boleh juga berdzikir/berdoa bebas.",
    },
  ],
};
