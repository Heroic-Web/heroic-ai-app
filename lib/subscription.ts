import { prisma } from "@/lib/prisma"

export async function hasSpeechToTextAccess(userId: string) {
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      product: "speech-to-text",
      status: "PAID",
    },
  })

  return Boolean(payment)
}