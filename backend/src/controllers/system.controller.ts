import { Request, Response } from 'express';
import os from 'os';

export class SystemController {
  /**
   * GET /api/v1/system/status
   * Real-time server telemetry (CPU, Memory, Uptime, OS)
   */
  static getStatus(req: Request, res: Response) {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

    const systemTelemetry = {
      status: 'HEALTHY',
      serverTime: new Date().toISOString(),
      processUptimeSeconds: Math.floor(process.uptime()),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        hostname: os.hostname(),
      },
      memory: {
        totalMB: Math.round(totalMem / (1024 * 1024)),
        usedMB: Math.round(usedMem / (1024 * 1024)),
        freeMB: Math.round(freeMem / (1024 * 1024)),
        usagePercent: `${memoryUsagePercent}%`,
      },
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
    };

    return res.status(200).json({
      message: 'DevPulse Enterprise System Status OK',
      data: systemTelemetry,
    });
  }
}
