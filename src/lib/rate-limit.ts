// Simple in-memory rate limiting (for demo purposes)
const requests = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitOptions {
  limit?: number;
  window?: number; // in milliseconds
}

export function rateLimit(options: RateLimitOptions = {}) {
  const limit = options.limit || 10; // 10 requests
  const window = options.window || 60 * 1000; // per minute

  return {
    check: (
      identifier: string
    ): { success: boolean; error?: string; reset?: number } => {
      const now = Date.now();
      const record = requests.get(identifier);

      if (!record || now > record.resetTime) {
        // First request or window expired
        requests.set(identifier, { count: 1, resetTime: now + window });
        return { success: true };
      }

      if (record.count >= limit) {
        return {
          success: false,
          error: "Rate limit exceeded. Try again later.",
          reset: record.resetTime,
        };
      }

      // Increment count
      record.count++;
      return { success: true };
    },
  };
}

// Demo mode protection
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

export function getClientIP(request: Request): string {
  // Get client IP for rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "unknown";
}
