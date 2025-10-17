export type HealthStatus = 'ok';

export interface HealthResponse {
  status: HealthStatus;
  uptime: number;
  timestamp: string;
}

export const buildHealthResponse = (): HealthResponse => ({
  status: 'ok',
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
});

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 25;

export const normalizePagination = (page?: number, pageSize: number = DEFAULT_PAGE_SIZE): PaginationParams => ({
  page: Math.max(1, page ?? 1),
  pageSize: Math.min(Math.max(1, pageSize), 100)
});
