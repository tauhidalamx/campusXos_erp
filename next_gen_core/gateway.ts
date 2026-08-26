import { Request, Response, NextFunction } from 'express';

export interface TenantContext {
  id: string;
  name: string;
  domain: string;
  tier: 'standard' | 'enterprise' | 'dedicated';
}

export interface UserSession {
  userId: string;
  tenantId: string;
  role: 'admin' | 'hod' | 'faculty' | 'student';
  email: string;
}

export class ApiGatewayRouter {
  // Mock Redis Caching client
  private static tenantCache = new Map<string, TenantContext>([
    ['mit.campusx.edu', { id: 'tenant_001', name: 'MIT CampusX Campus', domain: 'mit.campusx.edu', tier: 'dedicated' }],
    ['stanford.campusx.edu', { id: 'tenant_002', name: 'Stanford CampusX', domain: 'stanford.campusx.edu', tier: 'enterprise' }],
    ['localhost', { id: 'tenant_default', name: 'Local Dev University', domain: 'localhost', tier: 'standard' }]
  ]);

  private static rateLimitStore = new Map<string, number[]>(); // Sliding window tracker

  /**
   * 1. Multi-Tenant CNAME Host Routing Middleware
   */
  public static tenantRouter(req: Request, res: Response, next: NextFunction) {
    const hostHeader = req.headers.host || 'localhost';
    const cleanHost = hostHeader.split(':')[0]; // Strip port

    const tenant = ApiGatewayRouter.tenantCache.get(cleanHost) || {
      id: 'tenant_default',
      name: 'Default CampusX Portal',
      domain: cleanHost,
      tier: 'standard'
    };

    // Attach to request context
    req.headers['x-tenant-id'] = tenant.id;
    (req as any).tenant = tenant;
    
    next();
  }

  /**
   * 2. Sliding Window API Rate Limiter (Simulated Redis Integration)
   */
  public static checkRateLimit(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    const clientIp = req.ip || '127.0.0.1';
    const limitKey = `rate_limit:${tenantId}:${clientIp}`;

    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const maxRequests = 100; // Limit per minute

    let timestamps = ApiGatewayRouter.rateLimitStore.get(limitKey) || [];
    // Remove outdated timestamps
    timestamps = timestamps.filter(ts => now - ts < windowMs);

    if (timestamps.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'API rate limit exceeded. Please try again later.',
        retryAfter: '60s'
      });
    }

    timestamps.push(now);
    ApiGatewayRouter.rateLimitStore.set(limitKey, timestamps);
    
    // Set response headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - timestamps.length);

    next();
  }

  /**
   * 3. Zero-Trust Access Token Verification (JWKS Simulator)
   */
  public static authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Access token missing' });
    }

    try {
      // Simulate cryptographic RS256 validation against local keys registry
      if (token.startsWith('eyJWT_')) {
        const payloadDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
        
        (req as any).user = {
          userId: payloadDecoded.sub,
          tenantId: req.headers['x-tenant-id'],
          role: payloadDecoded.role,
          email: payloadDecoded.email
        } as UserSession;

        next();
      } else {
        throw new Error('Invalid signature');
      }
    } catch (e) {
      return res.status(403).json({ error: 'Forbidden', message: 'Invalid or expired token signature' });
    }
  }

  /**
   * 4. RBAC Policy Engine Integration
   */
  public static checkRBAC(action: string, resource: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user as UserSession;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Dynamic rule evaluation matrix (Casbin pattern)
      const isAllowed = ApiGatewayRouter.evaluateCasbin(user.role, resource, action);
      if (!isAllowed) {
        return res.status(403).json({
          error: 'Access Denied',
          message: `Role ${user.role} is not permitted to perform ${action} on ${resource}`
        });
      }

      next();
    };
  }

  private static evaluateCasbin(role: string, resource: string, action: string): boolean {
    const policies: Array<{ r: string; res: string; act: string }> = [
      { r: 'admin', res: '*', act: '*' },
      { r: 'hod', res: 'grades', act: 'approve' },
      { r: 'hod', res: 'timetable', act: 'write' },
      { r: 'faculty', res: 'attendance', act: 'write' },
      { r: 'faculty', res: 'grades', act: 'write' },
      { r: 'student', res: 'attendance', act: 'read' },
      { r: 'student', res: 'grades', act: 'read' }
    ];

    return policies.some(p => 
      (p.r === role || p.r === '*') && 
      (p.res === resource || p.res === '*') && 
      (p.act === action || p.act === '*')
    );
  }
}
