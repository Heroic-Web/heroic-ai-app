import { NextResponse } from 'next/server'
import { getRecentActivities } from '@/app/actions/activity'

export async function GET() {
  const data = await getRecentActivities(5)
  return NextResponse.json(data)
}