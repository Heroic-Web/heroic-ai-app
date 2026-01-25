import 'server-only'

export type CurrentUser = {
  id: string
  name: string
  email: string
}

/* ================================
   DUMMY AUTH (NO DATABASE)
================================ */
export async function getCurrentUser(): Promise<CurrentUser> {
  return {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com',
  }
}