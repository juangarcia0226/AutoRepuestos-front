import process from 'node:process'

// Carga el archivo .env si existe (en Netlify las variables ya vienen definidas)
try {
  process.loadEnvFile()
} catch {
  // sin archivo .env: se usan las variables del entorno
}

const url = process.env.VITE_API_URL ?? ''
const enNetlify = process.env.NETLIFY === 'true'

function fallar(mensaje) {
  console.error(`\nError de configuración: ${mensaje}\n`)
  process.exit(1)
}

if (!url) {
  fallar('falta VITE_API_URL. Debe apuntar a la API, por ejemplo https://mi-api.onrender.com/api/v1')
}
if (!/^https?:\/\//.test(url)) {
  fallar(`VITE_API_URL debe empezar por http:// o https:// (valor actual: ${url})`)
}
if (url.endsWith('/')) {
  fallar(`VITE_API_URL no debe terminar en "/" (valor actual: ${url})`)
}
if (enNetlify && /localhost|127\.0\.0\.1/.test(url)) {
  fallar(`en Netlify, VITE_API_URL no puede apuntar a localhost (valor actual: ${url})`)
}

console.log(`VITE_API_URL = ${url}`)