import { NextResponse } from 'next/server'
import { getAllActivities } from '@/app/actions/activity'

export async function GET() {
  const data = await getAllActivities()
  return NextResponse.json(data)
}