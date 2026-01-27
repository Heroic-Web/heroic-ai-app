import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs" // ⬅️ WAJIB untuk Prisma

/**
 * CREATE PAYMENT INTENT (DEV SAFE)
 * - Auto-create demo user jika belum ada
 * - Simulasi pembayaran sukses
 */
export async function POST(_req: Request) {
  try {
    /* ============================
     * 1️⃣ PASTIKAN USER ADA
     * ============================ */
    const userId = "demo-user"

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: "demo@hinaitech.dev",
        name: "Demo User",
      },
    })

    /* ============================
     * 2️⃣ BUAT ORDER ID
     * ============================ */
    const orderId = `STT-${Date.now()}`

    /* ============================
     * 3️⃣ SIMPAN PAYMENT
     * ============================ */
    await prisma.payment.create({
      data: {
        userId: user.id,
        orderId,
        amount: 99000,
        currency: "IDR",
        product: "speech-to-text",
        status: "PAID", // dev-mode
      },
    })

    /* ============================
     * 4️⃣ RESPONSE (VALID JSON)
     * ============================ */
    return NextResponse.json({
      success: true,
      redirectUrl: "/dashboard/speech-to-text",
    })
  } catch (error) {
    console.error("PAYMENT API ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Payment failed",
      },
      { status: 500 }
    )
  }
}