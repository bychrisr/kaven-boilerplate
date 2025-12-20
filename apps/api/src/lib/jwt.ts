import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'change-me-in-production'
);

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutos
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 dias

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  tenantId?: string;
}

/**
 * Gera um access token JWT
 */
export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  const token = await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Gera um refresh token (formato simples UUID-like)
 */
export function generateRefreshToken(): string {
  return `${Date.now()}.${Math.random().toString(36).substring(2)}`;
}

/**
 * Verifica e decodifica um JWT
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
}

/**
 * Calcula data de expiração do refresh token
 */
export function getRefreshTokenExpiry(): Date {
  const now = new Date();
  now.setDate(now.getDate() + 7); // 7 dias
  return now;
}
