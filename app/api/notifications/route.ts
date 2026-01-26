import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    {
      title: 'Free plan almost used',
      message: 'You have used 90% of your free quota.',
      type: 'quota',
    },
    {
      title: 'Workflow completed',
      message: 'Your SEO workflow finished successfully.',
      type: 'workflow',
    },
  ])
}