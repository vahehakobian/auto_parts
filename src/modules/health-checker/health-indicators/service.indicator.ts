import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class ServiceHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  isHealthy(eventName: string): HealthIndicatorResult {
    try {
      return {
        ['eventName']: { status: 'up' },
      };
    } catch (error) {
      throw new HealthCheckError(`${eventName} failed`, {
        [eventName]: error,
      });
    }
  }
}
