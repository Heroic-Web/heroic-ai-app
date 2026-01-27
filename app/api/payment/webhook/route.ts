import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const payload = await req.json()

  if (payload.transaction_status === "settlement") {
    const payment = await prisma.payment.findUnique({
      where: { orderId: payload.order_id }
    })

    if (!payment) return Response.json({ ok: true })

    await prisma.subscription.upsert({
      where: { userId: payment.userId },
      update: { status: "active" },
      create: {
        userId: payment.userId,
        plan: "speech_to_text",
        status: "active"
      }
    })

    await prisma.payment.update({
      where: { orderId: payload.order_id },
      data: { status: "success" }
    })
  }

  return Response.json({ ok: true })
}