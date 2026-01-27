import "server-only"

export type CurrentUser = {
  id: string
  name: string
  email: string
}

/* ================================
   DUMMY AUTH (NO DATABASE)
================================ */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  return {
    id: "demo-user",
    name: "Demo User",
    email: "demo@example.com",
  }
}

/* ================================
   ALIAS (UNTUK KOMPATIBILITAS)
   👉 INI YANG DIPAKAI PAGE.TSX
================================ */
export async function getUser(): Promise<CurrentUser | null> {
  return getCurrentUser()
}