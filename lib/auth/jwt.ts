/**
 * JWT Utility for token verification
 * This is a simplified implementation for development
 * In production, use a proper JWT library like 'jose'
 */

import { NextRequest } from 'next/server';

/**
 * Verify JWT token - stub implementation
 * Replace with actual JWT verification in production
 */
export async function verifyToken(token: string) {
  // In a real implementation, you would verify the token signature and expiration
  // For now, we'll return a mock payload for development
  if (!token || token === 'invalid') {
    return null;
  }
  
  // Mock payload - in reality, this would be decoded from the token
  return {
    userId: 'dev-user-id',
    tenantId: 'dev-tenant-id',
    platformRole: 'ADMIN',
    role: 'HOTEL',
    hotelId: 'dev-hotel-id',
    supplierId: null,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  };
}

/**
 * Extract token from authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}