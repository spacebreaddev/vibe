import axios from 'axios'

// ---------------------------------------------------------------------------
// Central API client
// Swap BASE_URL or add auth headers here when you know the real API.
// ---------------------------------------------------------------------------

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
})

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

export async function get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await client.get<T>(path, { params })
  return data
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const { data } = await client.post<T>(path, body)
  return data
}

// ---------------------------------------------------------------------------
// Feature-specific calls — add yours here as you build
// ---------------------------------------------------------------------------

// Example:
// export async function fetchItems(query: string) {
//   return get<Item[]>('/items', { q: query })
// }
