import * as jose from 'jose';
import { env } from '../config/env';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutos
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 dias

export interface JWTPayload {
  sub: string; // Subject (User ID)
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
    const secretFingerprint = `${env.JWT_SECRET.substring(0, 3)}...(${env.JWT_SECRET.length})`;
    console.log(`🔍 VERIFY - Token len: ${token.length}, Secret: ${secretFingerprint}`);
    
    // Default verify (permissive) to fix stability issues
    const { payload } = await jose.jwtVerify(token, JWT_SECRET); 
    return payload as unknown as JWTPayload;
  } catch (error: any) {
    console.error('❌ JWT Verification Error:', error);
    if (error?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        console.error('❌ Signature Mismatch! Secret might have changed or token is forged.');
    }
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
