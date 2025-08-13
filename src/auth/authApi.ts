const BASE = 'https://fakestoreapi.com'

export type FSLoginResponse = { token: string }

// stark vereinfachtes Usermodell (so liefert die API ihre Nutzerobjekte)
export type FSUser = {
  id: number
  email: string
  username: string
  name?: { firstname?: string; lastname?: string }
  // weitere Felder wie address/phone existieren ebenfalls
}

export async function loginApi(username: string, password: string): Promise<FSLoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // wichtig für korrekte Annahme
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Login fehlgeschlagen (${res.status}). ${text}`.trim())
  }
  return res.json()
}

// Profil-Lookup: FakeStore erzwingt das Token bei GET oft nicht,
// wir suchen den User per /users nach username heraus.
export async function getUserByUsername(username: string): Promise<FSUser | null> {
  const res = await fetch(`${BASE}/users`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Profil-Lookup fehlgeschlagen (${res.status})`)
  const users: FSUser[] = await res.json()
  return users.find((u) => u.username === username) ?? null
}
