export type Locale = "en" | "id"

export const translations = {
  en: {
    // Navigation
    nav: {
      features: "Features",
      tools: "Tools",
      pricing: "Pricing",
      about: "About",
      login: "Log in",
      getStarted: "Get Started",
      dashboard: "Dashboard",
      upgrade: "Upgrade to Pro",
      help: "Help & Support",
      settings: "Settings",
    },
    // Hero Section
    hero: {
      badge: "All-in-One AI Platform",
      title: "Create content at the speed of thought",
      subtitle:
        "HINTech AI Studio combines AI writing, design tools, and utilities in one powerful platform. Write better, design faster, work smarter.",
      cta: "Start Creating Free",
      ctaSecondary: "Watch Demo",
      trustedBy: "Trusted by 10,000+ creators and businesses",
    },
    // Stats
    stats: {
      users: "Active Users",
      content: "Content Generated",
      tools: "AI Tools",
      uptime: "Uptime",
    },
    // Features Section
    features: {
      title: "Everything you need to create",
      subtitle:
        "One platform for all your content creation needs. Write, design, and automate with AI.",
      writer: {
        title: "AI Writer",
        description:
          "Generate articles, blog posts, ad copy, and more with SEO optimization built-in.",
      },
      tools: {
        title: "Heroic Tools",
        description:
          "PDF tools, image editors, text utilities - 15+ tools for everyday tasks.",
      },
      design: {
        title: "AI Design",
        description:
          "Create stunning visuals with AI image generation and editing tools.",
      },
      workflow: {
        title: "Workflow Automation",
        description:
          "Build content workflows with no-code automation and scheduling.",
      },
    },
    // Tools Section
    tools: {
      title: "Heroic Tools",
      subtitle: "Fast, free tools for everyday tasks",
      pdf: {
        merge: "Merge PDF",
        split: "Split PDF",
        compress: "Compress PDF",
        convert: "PDF to Word",
      },
      image: {
        resize: "Resize Image",
        compress: "Compress Image",
        removeBg: "Remove Background",
        convert: "Convert Format",
      },
      text: {
        paraphrase: "Paraphrase",
        summarize: "Summarize",
        rewrite: "Rewrite",
        grammar: "Grammar Check",
      },
      viewAll: "View All Tools",
      mergePdf: "Merge PDF",
      pdfToImage: "PDF to Image",
      imageToPdf: "Image to PDF",
      resizeImage: "Resize Image",
      compressImage: "Compress Image",
      generateQr: "Generate QR Code",
      paraphrase: "Paraphrase Text",
      summarize: "Summarize Text",
      grammarCheck: "Grammar Check",
      wordCounter: "Word Counter",
      convertCase: "Convert Case",
      colorPicker: "Color Picker",
    },
    // Pricing
    pricing: {
      title: "Simple, transparent pricing",
      subtitle: "Start free, upgrade when you need more",
      free: {
        name: "Free",
        price: "$0",
        period: "/month",
        description: "Perfect for trying out HINTech",
        features: [
          "5 AI generations per day",
          "Basic tools access",
          "1 workspace",
          "Community support",
        ],
        cta: "Get Started",
      },
      pro: {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "For creators who need more power",
        features: [
          "Unlimited AI generations",
          "All tools access",
          "5 workspaces",
          "Priority support",
          "Custom brand kit",
          "API access",
        ],
        cta: "Start Pro Trial",
        badge: "Most Popular",
      },
      business: {
        name: "Business",
        price: "$49",
        period: "/month",
        description: "For teams and agencies",
        features: [
          "Everything in Pro",
          "Unlimited workspaces",
          "Team collaboration",
          "Advanced analytics",
          "Custom integrations",
          "Dedicated support",
        ],
        cta: "Contact Sales",
      },
    },
    // CTA Section
    cta: {
      title: "Ready to create heroic content?",
      subtitle:
        "Join thousands of creators and businesses using HINTech Studio.",
      button: "Start Creating Free",
    },
    // Footer
    footer: {
      description:
        "All-in-one AI platform for content creation, design, and automation.",
      product: "Product",
      resources: "Resources",
      company: "Company",
      legal: "Legal",
      features: "Features",
      pricing: "Pricing",
      tools: "Tools",
      api: "API",
      docs: "Documentation",
      blog: "Blog",
      tutorials: "Tutorials",
      support: "Support",
      about: "About Us",
      careers: "Careers",
      contact: "Contact",
      partners: "Partners",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
      copyright: "All rights reserved.",
    },
    // Dashboard
    dashboard: {
      welcome: "Welcome back",
      quickActions: "Quick Actions",
      recentProjects: "Recent Projects",
      usage: "Usage",
      newArticle: "New Article",
      newDesign: "New Design",
      uploadFile: "Upload File",
      viewAll: "View All",
    },
    // AI Writer
    writer: {
      title: "AI Writer",
      newDocument: "New Document",
      templates: "Templates",
      history: "History",
      tone: "Tone",
      length: "Length",
      language: "Language",
      keywords: "Keywords",
      generate: "Generate",
      regenerate: "Regenerate",
      copy: "Copy",
      export: "Export",
      tones: {
        professional: "Professional",
        casual: "Casual",
        formal: "Formal",
        friendly: "Friendly",
        persuasive: "Persuasive",
      },
      lengths: {
        short: "Short",
        medium: "Medium",
        long: "Long",
      },
      types: {
        article: "Article",
        blog: "Blog Post",
        ad: "Ad Copy",
        email: "Email",
        social: "Social Media",
        product: "Product Description",
      },
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Try Again",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      settings: "Settings",
      logout: "Log out",
      profile: "Profile",
    },
    // Auth
    auth: {
      login: "Log in",
      register: "Create account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      orContinueWith: "Or continue with",
      google: "Continue with Google",
      termsAgree: "By continuing, you agree to our",
      terms: "Terms of Service",
      and: "and",
      privacy: "Privacy Policy",
    },
  },
  id: {
    // Navigation
    nav: {
      features: "Fitur",
      tools: "Alat",
      pricing: "Harga",
      about: "Tentang",
      login: "Masuk",
      getStarted: "Mulai Gratis",
      dashboard: "Dashboard",
      upgrade: "Upgrade ke Pro",
      help: "Bantuan & Dukungan",
      settings: "Pengaturan",
    },
    // Hero Section
    hero: {
      badge: "Platform AI All-in-One",
      title: "Buat konten dengan kecepatan pikiran",
      subtitle:
        "HINTech Studio menggabungkan AI writing, design tools, dan utilitas dalam satu platform. Tulis lebih baik, desain lebih cepat, kerja lebih cerdas.",
      cta: "Mulai Gratis",
      ctaSecondary: "Lihat Demo",
      trustedBy: "Dipercaya oleh 10.000+ kreator dan bisnis",
    },
    // Stats
    stats: {
      users: "Pengguna Aktif",
      content: "Konten Dibuat",
      tools: "AI Tools",
      uptime: "Uptime",
    },
    // Features Section
    features: {
      title: "Semua yang kamu butuhkan untuk berkreasi",
      subtitle:
        "Satu platform untuk semua kebutuhan pembuatan konten. Tulis, desain, dan otomatisasi dengan AI.",
      writer: {
        title: "AI Writer",
        description:
          "Buat artikel, blog, copy iklan, dan lainnya dengan optimasi SEO bawaan.",
      },
      tools: {
        title: "Heroic Tools",
        description:
          "PDF tools, editor gambar, utilitas teks - 15+ alat untuk tugas sehari-hari.",
      },
      design: {
        title: "AI Design",
        description:
          "Buat visual menakjubkan dengan AI image generation dan editing tools.",
      },
      workflow: {
        title: "Otomatisasi Workflow",
        description:
          "Bangun workflow konten dengan otomatisasi no-code dan penjadwalan.",
      },
    },
    // Tools Section
    tools: {
      title: "Heroic Tools",
      subtitle: "Alat cepat dan gratis untuk tugas sehari-hari",
      pdf: {
        merge: "Gabung PDF",
        split: "Pisah PDF",
        compress: "Kompres PDF",
        convert: "PDF ke Word",
      },
      image: {
        resize: "Ubah Ukuran",
        compress: "Kompres Gambar",
        removeBg: "Hapus Background",
        convert: "Konversi Format",
      },
      text: {
        paraphrase: "Parafrase",
        summarize: "Rangkum",
        rewrite: "Tulis Ulang",
        grammar: "Cek Grammar",
      },
      viewAll: "Lihat Semua Alat",
      mergePdf: "Gabung PDF",
      pdfToImage: "PDF ke Gambar",
      imageToPdf: "Gambar ke PDF",
      resizeImage: "Ubah Ukuran Gambar",
      compressImage: "Kompres Gambar",
      generateQr: "Buat Kode QR",
      paraphrase: "Parafrase Teks",
      summarize: "Ringkas Teks",
      grammarCheck: "Cek Tata Bahasa",
      wordCounter: "Penghitung Kata",
      convertCase: "Ubah Huruf Besar/Kecil",
      colorPicker: "Pemilih Warna",
    },
    // Pricing
    pricing: {
      title: "Harga yang sederhana dan transparan",
      subtitle: "Mulai gratis, upgrade saat butuh lebih",
      free: {
        name: "Gratis",
        price: "Rp0",
        period: "/bulan",
        description: "Sempurna untuk mencoba HINTech",
        features: [
          "5 AI generations per hari",
          "Akses tools dasar",
          "1 workspace",
          "Dukungan komunitas",
        ],
        cta: "Mulai Gratis",
      },
      pro: {
        name: "Pro",
        price: "Rp299k",
        period: "/bulan",
        description: "Untuk kreator yang butuh lebih",
        features: [
          "Unlimited AI generations",
          "Akses semua tools",
          "5 workspaces",
          "Dukungan prioritas",
          "Custom brand kit",
          "Akses API",
        ],
        cta: "Coba Pro Gratis",
        badge: "Paling Populer",
      },
      business: {
        name: "Bisnis",
        price: "Rp799k",
        period: "/bulan",
        description: "Untuk tim dan agensi",
        features: [
          "Semua fitur Pro",
          "Unlimited workspaces",
          "Kolaborasi tim",
          "Analitik lanjutan",
          "Integrasi kustom",
          "Dukungan dedicated",
        ],
        cta: "Hubungi Sales",
      },
    },
    // CTA Section
    cta: {
      title: "Siap membuat konten heroik?",
      subtitle:
        "Bergabung dengan ribuan kreator dan bisnis yang menggunakan HINTech Studio.",
      button: "Mulai Gratis",
    },
    // Footer
    footer: {
      description:
        "Platform AI all-in-one untuk pembuatan konten, desain, dan otomatisasi.",
      product: "Produk",
      resources: "Sumber Daya",
      company: "Perusahaan",
      legal: "Legal",
      features: "Fitur",
      pricing: "Harga",
      tools: "Alat",
      api: "API",
      docs: "Dokumentasi",
      blog: "Blog",
      tutorials: "Tutorial",
      support: "Dukungan",
      about: "Tentang Kami",
      careers: "Karir",
      contact: "Kontak",
      partners: "Partner",
      privacy: "Kebijakan Privasi",
      terms: "Syarat Layanan",
      cookies: "Kebijakan Cookie",
      copyright: "Hak cipta dilindungi.",
    },
    // Dashboard
    dashboard: {
      welcome: "Selamat datang kembali",
      quickActions: "Aksi Cepat",
      recentProjects: "Proyek Terbaru",
      usage: "Penggunaan",
      newArticle: "Artikel Baru",
      newDesign: "Desain Baru",
      uploadFile: "Upload File",
      viewAll: "Lihat Semua",
    },
    // AI Writer
    writer: {
      title: "AI Writer",
      newDocument: "Dokumen Baru",
      templates: "Template",
      history: "Riwayat",
      tone: "Nada",
      length: "Panjang",
      language: "Bahasa",
      keywords: "Kata Kunci",
      generate: "Generate",
      regenerate: "Generate Ulang",
      copy: "Salin",
      export: "Ekspor",
      tones: {
        professional: "Profesional",
        casual: "Kasual",
        formal: "Formal",
        friendly: "Ramah",
        persuasive: "Persuasif",
      },
      lengths: {
        short: "Pendek",
        medium: "Sedang",
        long: "Panjang",
      },
      types: {
        article: "Artikel",
        blog: "Postingan Blog",
        ad: "Copy Iklan",
        email: "Email",
        social: "Media Sosial",
        product: "Deskripsi Produk",
      },
    },
    // Common
    common: {
      loading: "Memuat...",
      error: "Terjadi kesalahan",
      retry: "Coba Lagi",
      cancel: "Batal",
      save: "Simpan",
      delete: "Hapus",
      edit: "Edit",
      create: "Buat",
      search: "Cari",
      filter: "Filter",
      sort: "Urutkan",
      settings: "Pengaturan",
      logout: "Keluar",
      profile: "Profil",
    },
    // Auth
    auth: {
      login: "Masuk",
      register: "Buat Akun",
      email: "Email",
      password: "Password",
      confirmPassword: "Konfirmasi Password",
      forgotPassword: "Lupa password?",
      noAccount: "Belum punya akun?",
      hasAccount: "Sudah punya akun?",
      orContinueWith: "Atau lanjutkan dengan",
      google: "Lanjutkan dengan Google",
      termsAgree: "Dengan melanjutkan, kamu setuju dengan",
      terms: "Syarat Layanan",
      and: "dan",
      privacy: "Kebijakan Privasi",
    },
  },
}

export type TranslationKeys = typeof translations.en

export function getTranslation(locale: Locale): TranslationKeys {
  return translations[locale]
}
