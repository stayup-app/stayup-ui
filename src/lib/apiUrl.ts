// The one StayUp API this deployment talks to (env var set at build/deploy time).
export const API_URL = process.env.STAYUP_API_URL?.replace(/\/$/, '') ?? ''

export async function getApiUrl(): Promise<string> {
  return API_URL
}
