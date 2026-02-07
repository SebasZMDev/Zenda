export type ApiOptions = RequestInit & {
  headers?: Record<string,string>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export async function api(path:string, options:ApiOptions = {}) {
  const res = await fetch(`${API_URL}${path}`,{
    ...options,
    credentials: "include",

    headers: {
      "Content-Type":"application/json",
       ...(options.headers || {})
    }
  })

  const rawText = await res.text();

  if (!res.ok) {
  let errorMessage = "Fetch Error"
  try{
    const errJson = rawText ? JSON.parse(rawText) : {}
    errorMessage = errJson?.error || errJson?.message || errorMessage
  }
  catch{
    if (rawText) errorMessage = rawText
  }
  throw new Error(errorMessage)
  }
  if (!rawText) return null

  try{return JSON.parse(rawText)}
  catch{return rawText}
}