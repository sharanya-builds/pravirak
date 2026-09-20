import type { AnalysisContext } from '../utils/buildAnalysisContext';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem('pravirak_token');
}

async function request<T>(path: string, options: RequestInit = {}, timeoutMs = 20000): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined)
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, signal: controller.signal });
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') {
      throw new ApiError('The PRAVIRAK server took too long to respond. Please try again.', 0);
    }
    throw new ApiError(
      `Could not reach the PRAVIRAK server at ${API_BASE_URL}. Check your connection, or that VITE_API_BASE_URL is set correctly, and try again.`,
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    throw new ApiError(body?.error || `Request failed (${res.status})`, res.status);
  }
  return body as T;
}

export interface AuthUser {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
}

export const authApi = {
  register: (payload: { name: string; phone?: string; email?: string; password: string }) =>
    request<{ user: AuthUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload: { identifier: string; password: string }) =>
    request<{ user: AuthUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  me: () => request<{ user: AuthUser }>('/auth/me')
};

export interface SavedBusiness {
  id: number;
  businessIdea: string;
  category: string | null;
  locationId: string | null;
  locationName: string | null;
  ownCapital: number | null;
  status: string;
  decision: string | null;
  snapshot: any;
  createdAt: string;
  updatedAt: string;
}

export const businessApi = {
  list: () => request<{ businesses: SavedBusiness[] }>('/businesses'),
  get: (id: number) => request<{ business: SavedBusiness }>(`/businesses/${id}`),
  save: (payload: Partial<SavedBusiness>) =>
    request<{ business: SavedBusiness }>('/businesses', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  remove: (id: number) => request<{ deleted: boolean }>(`/businesses/${id}`, { method: 'DELETE' })
};

export interface GroundedScheme {
  name: string;
  issuingAuthority?: string;
  summary: string;
  eligibilityHighlights?: string[];
  benefitHighlights?: string[];
  sourceName?: string;
  sourceUrl: string;
  freshness?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SchemeRecommendationResult {
  grounded: boolean;
  groundedViaSearch?: boolean;
  reason?: string;
  generatedAt?: string;
  model?: string;
  schemes: GroundedScheme[];
  groundingSources?: { title?: string; uri: string }[];
}

export const schemeApi = {
  recommend: (payload: { businessIdea: string; category?: string; ownCapital: number; city?: string; state?: string }) =>
    request<SchemeRecommendationResult>(
      '/schemes/recommend',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      },
      30000 // LLM + search grounding can legitimately take longer than the default timeout
    )
};

export interface SavedReport {
  id: number;
  businessId: number;
  title: string;
  generatedAt: string;
  businessIdea: string;
  status: string;
  decision: string | null;
}

export const reportApi = {
  list: () => request<{ reports: SavedReport[] }>('/reports'),
  create: (payload: { businessId: number; title?: string }) =>
    request<{ report: SavedReport }>('/reports', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export interface AdvisorAskPayload {
  question: string;
  language?: string;
  /** Compact deterministic context produced by buildAnalysisContext(). Preferred over the legacy flat fields. */
  analysisContext?: AnalysisContext;

  // Legacy flat fields — still accepted by the backend fallback
  businessIdea?: string;
  category?: string;
  location?: any;
  financials?: any;
  decision?: any;
}

export interface AdvisorAskResponse {
  answer: string;
  grounded?: boolean;
  fallback?: boolean;
  model?: string;
}

export const advisorApi = {
  ask: (payload: AdvisorAskPayload) =>
    request<AdvisorAskResponse>(
      '/advisor/ask',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      },
      25000
    )
};

