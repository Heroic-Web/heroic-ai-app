import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * CREATE PAYMENT INTENT (DEV SAFE)
 * - Auto-create demo user jika belum ada
 * - Tidak pakai Midtrans dulu
 */
export async function POST() {
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
     * 2️⃣ BUAT ORDER
     * ============================ */
    const orderId = `STT-${Date.now()}`

    /* ============================
     * 3️⃣ SIMPAN PAYMENT (VALID)
     * ============================ */
    await prisma.payment.create({
        data: {
            userId: user.id,
            orderId,
            amount: 99000,
            currency: "IDR",
            product: "speech-to-text",
            status: "PAID", 
        },
        })

    /* ============================
     * 4️⃣ RESPONSE
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