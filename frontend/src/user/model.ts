export type User = {
  id: number
  email: string
  password: string
  confirm: string
  first_name: string
  last_name: string
  role: 'user' | 'owner' | 'admin'
}

export type AuthData = {
  access: string
  refresh: string
  user: User
}

export const emptyUser: User = {
  id: -1,
  email: '',
  password: '',
  confirm: '',
  first_name: '',
  last_name: '',
  role: 'user',
}
