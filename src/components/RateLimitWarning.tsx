'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Clock, Shield, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface RateLimitWarningProps {
  isDemo?: boolean;
  remainingRequests?: number;
  resetTime?: number;
}

export function RateLimitWarning({ isDemo, remainingRequests, resetTime }: RateLimitWarningProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!resetTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = resetTime - now;
      
      if (diff <= 0) {
        setTimeLeft('');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [resetTime]);

  if (isDemo) {
    return (
      <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <div className="flex items-center justify-between">
            <span>
              <strong>Demo Mode Active:</strong> Limited to 5 requests per minute. 
              Real insights may vary from demo responses.
            </span>
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Demo
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (remainingRequests !== undefined && remainingRequests <= 3) {
    return (
      <Alert className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <div className="flex items-center justify-between">
            <span>
              <strong>Rate Limit Warning:</strong> {remainingRequests} requests remaining.
              {timeLeft && ` Resets in ${timeLeft}`}
            </span>
            <Badge variant="outline" className="ml-2">
              <Clock className="w-3 h-3 mr-1" />
              {remainingRequests} left
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

interface CostWarningProps {
  totalRequests: number;
  estimatedCost: number;
}

export function CostWarning({ totalRequests, estimatedCost }: CostWarningProps) {
  if (totalRequests === 0) return null;

  return (
    <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <div className="flex items-center justify-between">
          <span>
            <strong>API Usage:</strong> {totalRequests} requests made. 
            Estimated cost: ~${estimatedCost.toFixed(4)}
          </span>
          <Badge variant="outline" className="ml-2">
            ${estimatedCost.toFixed(4)}
          </Badge>
        </div>
      </AlertDescription>
    </Alert>
  );
}
