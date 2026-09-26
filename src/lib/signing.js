// Digital signatures for certificates (ECDSA P-256 via Web Crypto).
//
// DEMO ONLY: the private key is embedded here so the prototype can sign in the
// browser. In production it lives on the university's server and never ships to
// clients — only the public key below is published, so anyone can verify but
// only the university can sign.

const PRIVATE_JWK = {
  kty: 'EC', crv: 'P-256',
  x: 'U-pPDbeQgzs8_vDP2cLEHOeChP2SCE7718XMsRWUYGg',
  y: 'W9qzElymFzgSJ_uf1iNQrgwhlNSx2MxvvIDWlxZglwo',
  d: 'FtDq_MzEr0ExTtXgBZjiZbbn6HxRr12SBBUHUp1XjmE',
}
const PUBLIC_JWK = {
  kty: 'EC', crv: 'P-256',
  x: 'U-pPDbeQgzs8_vDP2cLEHOeChP2SCE7718XMsRWUYGg',
  y: 'W9qzElymFzgSJ_uf1iNQrgwhlNSx2MxvvIDWlxZglwo',
}
const ALG = { name: 'ECDSA', namedCurve: 'P-256' }
const SIGN = { name: 'ECDSA', hash: 'SHA-256' }

const b64url = (bytes) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const fromB64url = (str) =>
  Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/')), (ch) => ch.charCodeAt(0))

// The exact fields that are signed, in a fixed order
const FIELDS = ['id', 'studentName', 'uniId', 'major', 'companyId', 'durationMonths', 'hours', 'score', 'issuedOn', 'fingerprint']
const payloadOf = (cert) => JSON.stringify(FIELDS.map((f) => cert[f]))

export const publicKeyFingerprint = PUBLIC_JWK.x.slice(0, 16)

export async function signCert(cert) {
  const key = await crypto.subtle.importKey('jwk', PRIVATE_JWK, ALG, false, ['sign'])
  const sig = await crypto.subtle.sign(SIGN, key, new TextEncoder().encode(payloadOf(cert)))
  return b64url(new Uint8Array(sig))
}

export async function verifyCert(cert, sig) {
  try {
    const key = await crypto.subtle.importKey('jwk', PUBLIC_JWK, ALG, false, ['verify'])
    return await crypto.subtle.verify(SIGN, key, fromB64url(sig), new TextEncoder().encode(payloadOf(cert)))
  } catch {
    return false
  }
}

// The QR link carries the certificate data + signature, so any phone can verify it offline
export function encodeCert(cert) {
  return b64url(new TextEncoder().encode(payloadOf(cert)))
}

export function decodeCert(str) {
  try {
    const values = JSON.parse(new TextDecoder().decode(fromB64url(str)))
    return Object.fromEntries(FIELDS.map((f, i) => [f, values[i]]))
  } catch {
    return null
  }
}

export function verifyUrl(cert, overrides) {
  const data = overrides ? { ...cert, ...overrides } : cert
  return `${location.origin}${location.pathname}#/verify/${cert.id}?d=${encodeCert(data)}&s=${cert.sig}`
}
