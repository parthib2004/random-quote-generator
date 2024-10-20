export const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ''

if (!RAPIDAPI_KEY) {
  console.warn('RAPIDAPI_KEY is not set in the environment variables')
}
