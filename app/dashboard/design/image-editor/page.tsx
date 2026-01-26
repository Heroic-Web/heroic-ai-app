'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

/* ===============================
 * TYPE
 * =============================== */
type Lang = 'id' | 'en'

type EditState = {
  rotation: number
  scale: number
  flipX: boolean
  flipY: boolean
  brightness: number
  contrast: number
  saturation: number
  blur: number
  grayscale: boolean
}

const defaultEdit: EditState = {
  rotation: 0,
  scale: 1,
  flipX: false,
  flipY: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: false,
}

/* ===============================
 * TRANSLATION TEXT
 * =============================== */
const TEXT: Record<Lang, any> = {
  id: {
    title: 'Professional Image Editor',
    subtitle:
      'Alat pengeditan gambar berbasis web dengan fitur lengkap untuk kebutuhan profesional.',
    intro1:
      'Editor ini dirancang untuk membantu Anda melakukan penyesuaian visual gambar secara presisi tanpa perlu menginstal software tambahan.',
    intro2:
      'Semua proses dilakukan dengan cepat, aman, dan mendukung preview real-time sebelum hasil akhir diunduh.',

    uploadTitle: 'Unggah Gambar',
    uploadDesc:
      'Pilih gambar dari perangkat Anda untuk mulai mengedit. Format yang didukung: JPG, PNG, WEBP.',
    uploadBtn: 'Upload Image',

    extraOptionsTitle: 'Opsi Tambahan',
    presetSoft: 'Preset Lembut',
    presetVivid: 'Preset Tajam',
    presetBW: 'Hitam Putih',
    quickEnhance: 'Quick Enhance',

    guideTitle: 'Panduan & Tutorial',
    guide1Title: 'Cara Menggunakan Editor',
    guide1Desc:
      'Unggah gambar, atur slider sesuai kebutuhan, klik Apply Changes, lalu download hasil akhir.',
    guide2Title: 'Tips Profesional',
    guide2Desc:
      'Gunakan brightness dan contrast secukupnya. Terlalu tinggi dapat mengurangi kualitas visual.',
    guide3Title: 'Keamanan & Privasi',
    guide3Desc:
      'Gambar tidak disimpan permanen di server. Semua proses hanya untuk pengeditan.',

    controls: {
      rotation: 'Rotasi',
      scale: 'Skala',
      brightness: 'Kecerahan',
      contrast: 'Kontras',
      saturation: 'Saturasi',
      blur: 'Blur',
      flipX: 'Flip Horizontal',
      flipY: 'Flip Vertical',
      grayscale: 'Grayscale',
      undo: 'Undo',
      reset: 'Reset',
      apply: 'Apply Changes',
      download: 'Download Image',
      processing: 'Processing...',
    },
  },

  en: {
    title: 'Professional Image Editor',
    subtitle:
      'A web based image editing tool with complete features for professional needs.',
    intro1:
      'This editor is designed to help you adjust image visuals precisely without installing additional software.',
    intro2:
      'All processes are fast, secure, and support real-time preview before downloading the final result.',

    uploadTitle: 'Upload Image',
    uploadDesc:
      'Choose an image from your device to start editing. Supported formats: JPG, PNG, WEBP.',
    uploadBtn: 'Upload Image',

    extraOptionsTitle: 'Additional Options',
    presetSoft: 'Soft Preset',
    presetVivid: 'Vivid Preset',
    presetBW: 'Black & White',
    quickEnhance: 'Quick Enhance',

    guideTitle: 'Guide & Tutorial',
    guide1Title: 'How to Use the Editor',
    guide1Desc:
      'Upload an image, adjust sliders as needed, click Apply Changes, then download the final result.',
    guide2Title: 'Professional Tips',
    guide2Desc:
      'Use brightness and contrast moderately. Excessive values may reduce visual quality.',
    guide3Title: 'Security & Privacy',
    guide3Desc:
      'Images are not stored permanently on the server. All processing is temporary.',

    controls: {
      rotation: 'Rotation',
      scale: 'Scale',
      brightness: 'Brightness',
      contrast: 'Contrast',
      saturation: 'Saturation',
      blur: 'Blur',
      flipX: 'Flip Horizontal',
      flipY: 'Flip Vertical',
      grayscale: 'Grayscale',
      undo: 'Undo',
      reset: 'Reset',
      apply: 'Apply Changes',
      download: 'Download Image',
      processing: 'Processing...',
    },
  },
}

/* ===============================
 * COMPONENT
 * =============================== */
export default function ImageEditorPage() {
  const fileRef = useRef<HTMLInputElement>(null)

  const [lang, setLang] = useState<Lang>('id')
  const t = TEXT[lang]

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [edit, setEdit] = useState<EditState>(defaultEdit)
  const [history, setHistory] = useState<EditState[]>([])
  const [loading, setLoading] = useState(false)
  const [openGuide, setOpenGuide] = useState<number | null>(null)

  /* ===============================
 * PRESET HANDLERS (CONNECTED)
 * =============================== */
    const applyPresetSoft = () => {
    setEdit((prev) => ({
        ...prev,
        brightness: 110,
        contrast: 90,
        saturation: 95,
        blur: 0,
        grayscale: false,
    }))
    }

    const applyPresetVivid = () => {
    setEdit((prev) => ({
        ...prev,
        brightness: 105,
        contrast: 120,
        saturation: 130,
        blur: 0,
        grayscale: false,
    }))
    }

    const applyPresetBW = () => {
    setEdit((prev) => ({
        ...prev,
        grayscale: true,
        saturation: 0,
        contrast: 110,
        brightness: 100,
        blur: 0,
    }))
    }

    const applyQuickEnhance = () => {
    setEdit((prev) => ({
        ...prev,
        brightness: Math.min(prev.brightness + 10, 200),
        contrast: Math.min(prev.contrast + 10, 200),
        saturation: Math.min(prev.saturation + 10, 200),
    }))
    }

  /* ===============================
   * UPLOAD
   * =============================== */
  const onUpload = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setEdit(defaultEdit)
    setHistory([])
  }

  /* ===============================
   * APPLY SERVER
   * =============================== */
  const applyEdit = async () => {
    if (!file) return
    setLoading(true)

    const form = new FormData()
    form.append('file', file)
    Object.entries(edit).forEach(([k, v]) => form.append(k, String(v)))

    const res = await fetch('/api/image-editor', { method: 'POST', body: form })
    const blob = await res.blob()
    setPreview(URL.createObjectURL(blob))
    setHistory((h) => [...h, edit])
    setLoading(false)
  }

  const downloadImage = () => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = 'edited-image.png'
    a.click()
  }

  const undo = () => {
    const last = history.at(-1)
    if (!last) return
    setEdit(last)
    setHistory((h) => h.slice(0, -1))
  }

  const [activePreset, setActivePreset] = useState<
    'soft' | 'vivid' | 'bw' | 'quick' | null
    >(null)

 /* ===============================
 * UI (FULL FIX & CONNECTED)
 * =============================== */
    return (
    <div className="p-6 space-y-10">
        {/* LANGUAGE SWITCH */}
        <div className="flex justify-end">
        <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="text-sm border rounded px-3 py-1 hover:bg-muted"
        >
            🌐 {lang === 'id' ? 'English' : 'Indonesia'}
        </button>
        </div>

        {/* HEADER */}
        <div className="space-y-3 max-w-4xl">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
        <p className="text-muted-foreground">{t.intro1}</p>
        <p className="text-muted-foreground">{t.intro2}</p>
        </div>

        {/* ===============================
        * GUIDE & HOW IT WORKS
        * =============================== */}
        <div className="border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">
            {lang === 'en'
            ? 'How This Image Editor Works'
            : 'Cara Kerja Image Editor'}
        </h3>

        <p className="text-sm text-muted-foreground">
            {lang === 'en'
            ? 'This section explains how to use the editor effectively, from uploading images to applying presets and exporting results.'
            : 'Bagian ini menjelaskan cara menggunakan editor secara efektif, mulai dari upload gambar hingga menerapkan preset dan mengunduh hasil.'}
        </p>

        {[
            {
            title:
                lang === 'en'
                ? '1. Uploading an Image'
                : '1. Mengunggah Gambar',
            desc:
                lang === 'en'
                ? 'Click the Upload Image button to select an image from your device. The image will be displayed in the preview area and is ready for editing.'
                : 'Klik tombol Upload Image untuk memilih gambar dari perangkat Anda. Gambar akan langsung ditampilkan di area preview dan siap diedit.',
            },
            {
            title:
                lang === 'en'
                ? '2. Using Presets & Additional Options'
                : '2. Menggunakan Preset & Opsi Tambahan',
            desc:
                lang === 'en'
                ? 'Presets allow you to instantly apply visual styles such as soft tones, vivid colors, or black & white effects without adjusting sliders manually.'
                : 'Preset memungkinkan Anda menerapkan gaya visual seperti lembut, tajam, atau hitam putih secara instan tanpa mengatur slider satu per satu.',
            },
            {
            title:
                lang === 'en'
                ? '3. Manual Adjustments with Controls'
                : '3. Penyesuaian Manual dengan Kontrol',
            desc:
                lang === 'en'
                ? 'Use sliders to fine-tune rotation, scale, brightness, contrast, saturation, blur, and more for precise control over your image.'
                : 'Gunakan slider untuk menyesuaikan rotasi, skala, kecerahan, kontras, saturasi, blur, dan lainnya untuk kontrol yang lebih presisi.',
            },
            {
            title:
                lang === 'en'
                ? '4. Apply Changes & Processing'
                : '4. Terapkan Perubahan & Proses',
            desc:
                lang === 'en'
                ? 'When you click Apply Changes, your image is securely processed on the server to generate a high-quality final result.'
                : 'Saat Anda klik Apply Changes, gambar diproses secara aman di server untuk menghasilkan hasil akhir berkualitas tinggi.',
            },
            {
            title:
                lang === 'en'
                ? '5. Download & Privacy'
                : '5. Unduh & Privasi',
            desc:
                lang === 'en'
                ? 'Download the final image to your device. Your image is not permanently stored and is only used for editing purposes.'
                : 'Unduh gambar hasil edit ke perangkat Anda. Gambar tidak disimpan permanen dan hanya digunakan untuk proses pengeditan.',
            },
        ].map((item, i) => (
            <div key={i} className="border rounded-lg">
            <button
                onClick={() => setOpenGuide(openGuide === i ? null : i)}
                className="w-full text-left px-4 py-3 font-medium hover:bg-muted"
            >
                {item.title}
            </button>

            {openGuide === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                {item.desc}
                </div>
            )}
            </div>
        ))}
        </div>

        {/* UPLOAD */}
        <div className="border border-dashed rounded-xl p-8 text-center space-y-3">
        <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files && onUpload(e.target.files[0])}
        />
        <h2 className="font-semibold">{t.uploadTitle}</h2>
        <p className="text-muted-foreground">{t.uploadDesc}</p>
        <button
            onClick={() => fileRef.current?.click()}
            className="px-6 py-3 bg-black text-white rounded-lg"
        >
            {t.uploadBtn}
        </button>
        </div>

        {/* ===============================
        * EDITOR + PRESET (ABOVE PREVIEW)
        * =============================== */}
        {preview && (
        <div className="space-y-6">
            {/* ADDITIONAL OPTIONS — ABOVE IMAGE */}
            <div className="border rounded-xl p-6 space-y-2">
            <h3 className="font-semibold">
                {lang === 'en' ? 'Additional Options' : 'Opsi Tambahan'}
            </h3>

            <p className="text-sm text-muted-foreground">
                {lang === 'en'
                ? 'Use quick presets to apply automatic visual styles.'
                : 'Gunakan preset cepat untuk menerapkan gaya visual otomatis.'}
            </p>

            <div className="flex flex-wrap gap-2">
                <button
                onClick={() => {
                    applyPresetSoft()
                    setActivePreset('soft')
                }}
                className={`btn ${
                    activePreset === 'soft'
                    ? 'bg-black text-white'
                    : ''
                }`}
                >
                {lang === 'en' ? 'Soft Preset' : 'Preset Lembut'}
                </button>

                <button
                onClick={() => {
                    applyPresetVivid()
                    setActivePreset('vivid')
                }}
                className={`btn ${
                    activePreset === 'vivid'
                    ? 'bg-black text-white'
                    : ''
                }`}
                >
                {lang === 'en' ? 'Vivid Preset' : 'Preset Tajam'}
                </button>

                <button
                onClick={() => {
                    applyPresetBW()
                    setActivePreset('bw')
                }}
                className={`btn ${
                    activePreset === 'bw'
                    ? 'bg-black text-white'
                    : ''
                }`}
                >
                {lang === 'en' ? 'Black & White' : 'Hitam Putih'}
                </button>

                <button
                onClick={() => {
                    applyQuickEnhance()
                    setActivePreset('quick')
                }}
                className={`btn ${
                    activePreset === 'quick'
                    ? 'bg-black text-white'
                    : ''
                }`}
                >
                {lang === 'en'
                    ? 'Quick Enhance'
                    : 'Peningkatan Cepat'}
                </button>
            </div>
            </div>

            {/* PREVIEW + CONTROLS */}
            <div className="grid lg:grid-cols-3 gap-6">
            {/* PREVIEW */}
            <div className="lg:col-span-2 border rounded-xl p-4 flex justify-center items-center bg-muted">
                <div
                style={{
                    transform: `
                    rotate(${edit.rotation}deg)
                    scale(${edit.scale})
                    scaleX(${edit.flipX ? -1 : 1})
                    scaleY(${edit.flipY ? -1 : 1})
                    `,
                    filter: `
                    brightness(${edit.brightness}%)
                    contrast(${edit.contrast}%)
                    saturate(${edit.saturation}%)
                    blur(${edit.blur}px)
                    ${edit.grayscale ? 'grayscale(100%)' : ''}
                    `,
                }}
                className="transition-all"
                >
                <Image
                    src={preview}
                    alt="Preview"
                    width={600}
                    height={600}
                    className="max-h-[500px] w-auto rounded"
                />
                </div>
            </div>

            {/* CONTROLS */}
            <div className="space-y-4">
                {[
                [t.controls.rotation, 'rotation', -180, 180],
                [t.controls.scale, 'scale', 0.3, 2, 0.1],
                [t.controls.brightness, 'brightness', 0, 200],
                [t.controls.contrast, 'contrast', 0, 200],
                [t.controls.saturation, 'saturation', 0, 200],
                [t.controls.blur, 'blur', 0, 10],
                ].map(([label, key, min, max, step]) => (
                <div key={key as string}>
                    <label className="text-sm font-medium">{label}</label>
                    <input
                    type="range"
                    min={min}
                    max={max}
                    step={step ?? 1}
                    value={(edit as any)[key]}
                    onChange={(e) =>
                        setEdit({
                        ...edit,
                        [key]: Number(e.target.value),
                        })
                    }
                    className="w-full"
                    />
                </div>
                ))}

                <div className="flex gap-2">
                <button onClick={undo} className="btn">
                    {t.controls.undo}
                </button>
                <button
                    onClick={() => {
                    setEdit(defaultEdit)
                    setActivePreset(null)
                    }}
                    className="btn"
                >
                    {t.controls.reset}
                </button>
                </div>

                <button
                onClick={applyEdit}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
                >
                {loading
                    ? t.controls.processing
                    : t.controls.apply}
                </button>

                <button
                onClick={downloadImage}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                {t.controls.download}
                </button>
            </div>
            {/* ===============================
            * POST-UPLOAD INTRO / MOTIVATION
            * =============================== */}
            <div className="rounded-xl bg-muted p-6 space-y-3 max-w-4xl">
            <h3 className="text-lg font-semibold">
                {lang === 'en'
                ? 'Start Editing Like a Pro'
                : 'Mulai Mengedit Seperti Profesional'}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
                {lang === 'en'
                ? 'Once your image is uploaded, you can instantly enhance it using presets or manually fine-tune every detail. This editor is designed to give you full control without complexity.'
                : 'Setelah gambar diunggah, Anda bisa langsung meningkatkannya menggunakan preset atau mengatur setiap detail secara manual. Editor ini dirancang untuk memberi kontrol penuh tanpa kerumitan.'}
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">
                {lang === 'en'
                ? 'You can experiment freely—adjustments are previewed in real time, and nothing is permanent until you click Apply Changes.'
                : 'Anda bebas bereksperimen semua perubahan ditampilkan secara real-time, dan tidak ada yang permanen sampai Anda menekan tombol Terapkan Perubahan.'}
            </p>
            </div>
            {/* ===============================
            * FOOTER / FINAL NOTES
            * =============================== */}
            <div className="border-t pt-8 space-y-4 max-w-5xl">
            <h3 className="text-lg font-semibold">
                {lang === 'en'
                ? 'Designed for Quality, Speed, and Privacy'
                : 'Dirancang untuk Kualitas, Kecepatan, dan Privasi'}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
                {lang === 'en'
                ? 'This image editor processes your edits efficiently while preserving image quality. All transformations are handled securely and optimized for modern devices.'
                : 'Image editor ini memproses perubahan secara efisien dengan tetap menjaga kualitas gambar. Semua transformasi dilakukan secara aman dan dioptimalkan untuk perangkat modern.'}
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">
                {lang === 'en'
                ? 'Your images are never permanently stored. They are used only for editing purposes and can be downloaded immediately after processing.'
                : 'Gambar Anda tidak pernah disimpan secara permanen. Gambar hanya digunakan untuk proses pengeditan dan dapat langsung diunduh setelah selesai.'}
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">
                {lang === 'en'
                ? 'Whether you are preparing visuals for social media, presentations, or professional design work, this tool is built to support your creative workflow.'
                : 'Baik untuk kebutuhan media sosial, presentasi, maupun desain profesional, alat ini dibuat untuk mendukung alur kerja kreatif Anda.'}
            </p>

            <div className="text-sm font-medium">
                {lang === 'en'
                ? 'Tip: Try combining presets with manual adjustments for the best results.'
                : 'Tips: Coba kombinasikan preset dengan pengaturan manual untuk hasil terbaik.'}
            </div>
            </div>
            </div>
        </div>
        )}
    </div>
    )
}