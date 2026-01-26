import sharp from 'sharp'

/**
 * WAJIB: sharp hanya jalan di Node runtime
 */
export const runtime = 'nodejs'

/**
 * Helper: aman konversi number
 */
function toNumber(value: FormDataEntryValue | null, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Helper: boolean dari formData
 */
function toBoolean(value: FormDataEntryValue | null) {
  return value === 'true'
}

export async function POST(req: Request): Promise<Response> {
  try {
    /* ===============================
     * 1. PARSE FORM DATA
     * =============================== */
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No image uploaded' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    /* ===============================
     * 2. LOAD IMAGE BUFFER
     * =============================== */
    const inputBuffer = Buffer.from(await file.arrayBuffer())
    let image = sharp(inputBuffer, { failOnError: false })

    /* ===============================
     * 3. BASIC TRANSFORM
     * =============================== */
    const rotation = toNumber(formData.get('rotation'), 0)
    const scale = toNumber(formData.get('scale'), 1)
    const flipX = toBoolean(formData.get('flipX'))
    const flipY = toBoolean(formData.get('flipY'))

    if (rotation !== 0) image = image.rotate(rotation)
    if (flipX) image = image.flop()
    if (flipY) image = image.flip()

    /* ===============================
     * 4. RESIZE (SCALE)
     * =============================== */
    const meta = await image.metadata()
    if (meta.width && meta.height && scale !== 1) {
      image = image.resize(
        Math.max(1, Math.round(meta.width * scale)),
        Math.max(1, Math.round(meta.height * scale))
      )
    }

    /* ===============================
     * 5. COLOR & FILTER
     * =============================== */
    const brightness = toNumber(formData.get('brightness'), 100)
    const contrast = toNumber(formData.get('contrast'), 100)
    const saturation = toNumber(formData.get('saturation'), 100)
    const blur = toNumber(formData.get('blur'), 0)
    const grayscale = toBoolean(formData.get('grayscale'))

    image = image.modulate({
      brightness: brightness / 100,
      saturation: saturation / 100,
    })

    if (contrast !== 100) {
      image = image.linear(contrast / 100, 0)
    }

    if (blur > 0) image = image.blur(blur)
    if (grayscale) image = image.grayscale()

    /* ===============================
     * 6. OUTPUT (SAFE BODYINIT)
     * =============================== */
    const outputBuffer = await image.png({ quality: 100 }).toBuffer()
    const body = new Uint8Array(outputBuffer)

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[IMAGE_EDITOR_ERROR]', error)

    return new Response(
      JSON.stringify({
        error: 'Image editor failed',
        message:
          error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}