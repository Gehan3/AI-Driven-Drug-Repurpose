const USERS_KEY = "drugrepurposing_users"
const CURRENT_USER_KEY = "drugrepurposing_current_user"

export interface User {
  name: string
  age: string
  email: string
  password: string
}

export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signup(name: string, age: string, email: string, password: string): { ok: boolean; message: string } {
  const users = getUsers()
  if (users.find((u) => u.email === email)) {
    return { ok: false, message: "This email is already registered. Please sign in." }
  }
  users.push({ name, age, email, password })
  saveUsers(users)
  return { ok: true, message: "Account created successfully!" }
}

export function signin(email: string, password: string): { ok: boolean; message: string; user?: User } {
  const users = getUsers()
  const user = users.find((u) => u.email === email)
  if (!user) {
    return { ok: false, message: "No account found with this email. Please sign up first." }
  }
  if (user.password !== password) {
    return { ok: false, message: "Incorrect password. Please try again." }
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  return { ok: true, message: "Signed in successfully!", user }
}

export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function signout() {
  localStorage.removeItem(CURRENT_USER_KEY)
}
