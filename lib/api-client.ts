const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export const DEFAULT_EVENT_ID = '44a856e6-c32e-4274-b19e-8f8ec465505f';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  mustChangePassword: boolean;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    status: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalTickets: number;
  totalSpeakers: number;
  totalExhibitors: number;
  mau: number;
  dau: number;
  gmv: number;
  topEventsByTickets: Array<{ eventId: string; title: string; count: number }>;
}

export interface Speaker {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  photoUrl?: string;
  eventId: string;
  order?: number;
}

export interface Exhibitor {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  eventId: string;
  order?: number;
}

export interface Sponsor {
  id: string;
  eventId: string;
  tier?: string;
  items?: Array<{ id: string; name: string; logoUrl?: string }>;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  eventId: string;
  day?: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  status: string;
  isApproved: boolean;
  startDate?: string;
  endDate?: string;
  createdById: string;
}

export interface Branding {
  primaryColor?: string;
  secondaryColor?: string;
  appearanceMode?: string;
  logoUrl?: string;
  bannerUrl?: string;
  backgroundUrl?: string;
  floorPlanUrl?: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  eventId: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function fetchAPI<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Session expired. Please log in again.' } } as ApiResponse<T>;
  }

  const json: ApiResponse<T> = await res.json();
  return json;
}

// ── authAPI ───────────────────────────────────────────────────────────────────

export const authAPI = {
  login(payload: LoginPayload) {
    return fetchAPI<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout() {
    return fetchAPI<void>('/auth/logout', { method: 'DELETE' });
  },

  refresh(refreshToken: string) {
    return fetchAPI<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  register(payload: { email: string; password: string; fullName: string }) {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  forgotPassword(email: string) {
    return fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(payload: { token: string; password: string }) {
    return fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return fetchAPI('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getSessions() {
    return fetchAPI('/auth/sessions');
  },

  revokeSession(sessionId: string) {
    return fetchAPI(`/auth/sessions/${sessionId}`, { method: 'DELETE' });
  },
};

// ── dashboardAPI ──────────────────────────────────────────────────────────────

export const dashboardAPI = {
  getDashboard() {
    return fetchAPI<DashboardStats>('/admin/dashboard');
  },

  getOverview() {
    return fetchAPI<DashboardStats>('/admin/overview');
  },
};

// ── eventAPI ──────────────────────────────────────────────────────────────────

export const eventAPI = {
  getPublished(opts?: PaginationOptions) {
    const q = new URLSearchParams(opts as Record<string, string>).toString();
    return fetchAPI<Event[]>(`/events/published${q ? `?${q}` : ''}`);
  },

  getMyEvents() {
    return fetchAPI<Event[]>('/events/admin/my-events');
  },

  getById(eventId: string) {
    return fetchAPI<Event>(`/events/${eventId}`);
  },

  getDetail(eventId: string) {
    return fetchAPI<Event>(`/events/${eventId}/detail`);
  },

  create(payload: Partial<Event>) {
    return fetchAPI<Event>('/events/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(eventId: string, payload: Partial<Event>) {
    return fetchAPI<Event>(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  updateStatus(eventId: string, status: string) {
    return fetchAPI(`/events/${eventId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getAnalytics(eventId: string) {
    return fetchAPI(`/events/admin/${eventId}/analytics`);
  },

  getCountdown(eventId: string) {
    return fetchAPI(`/events/${eventId}/countdown`);
  },

  getLiveStream(eventId: string) {
    return fetchAPI(`/events/${eventId}/live`);
  },

  getMap(eventId: string) {
    return fetchAPI(`/events/${eventId}/map`);
  },

  addStaff(eventId: string, payload: { userId: string; role: string }) {
    return fetchAPI(`/events/${eventId}/staff`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  broadcast(eventId: string, payload: { title: string; body: string }) {
    return fetchAPI(`/events/${eventId}/notifications/broadcast`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ── agendaAPI ─────────────────────────────────────────────────────────────────

export const agendaAPI = {
  getAgenda(eventId: string) {
    return fetchAPI<Session[]>(`/events/${eventId}/agenda`);
  },

  getAgendaFlat(eventId: string) {
    return fetchAPI<Session[]>(`/events/${eventId}/agenda/flat`);
  },

  getAgendaDays(eventId: string) {
    return fetchAPI(`/events/${eventId}/agenda/days`);
  },

  getSession(sessionId: string) {
    return fetchAPI<Session>(`/sessions/${sessionId}`);
  },

  createSession(payload: Partial<Session>) {
    return fetchAPI<Session>('/sessions/admin/create/session', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  bulkCreateSessions(sessions: Partial<Session>[]) {
    return fetchAPI('/sessions/admin/bulk-create/sessions', {
      method: 'POST',
      body: JSON.stringify({ sessions }),
    });
  },

  updateSession(sessionId: string, payload: Partial<Session>) {
    return fetchAPI<Session>(`/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  bookmarkSession(sessionId: string) {
    return fetchAPI(`/sessions/${sessionId}/bookmark`, { method: 'POST' });
  },

  unbookmarkSession(sessionId: string) {
    return fetchAPI(`/sessions/${sessionId}/bookmark`, { method: 'DELETE' });
  },

  setBookmarkReminder(sessionId: string, payload: { reminderAt: string }) {
    return fetchAPI(`/sessions/${sessionId}/bookmark/reminder`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteSession(sessionId: string) {
    return fetchAPI(`/sessions/${sessionId}`, { method: 'DELETE' });
  },

  getMyBookmarks() {
    return fetchAPI<Session[]>('/sessions/me/bookmarks');
  },
};

// ── speakersAPI ───────────────────────────────────────────────────────────────

export const speakersAPI = {
  getSpeakers(eventId: string) {
    return fetchAPI<Speaker[]>(`/events/${eventId}/speakers`);
  },

  getSpeaker(speakerId: string) {
    return fetchAPI<Speaker>(`/speakers/${speakerId}`);
  },

  getSpeakersByEvent(eventId: string) {
    return fetchAPI<Speaker[]>(`/speakers/admin/getspeakers/${eventId}`);
  },

  createSpeaker(eventId: string, payload: Partial<Speaker>) {
    return fetchAPI<Speaker>(`/speakers/admin/${eventId}/create/speaker`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  bulkCreateSpeakers(eventId: string, speakers: Partial<Speaker>[]) {
    return fetchAPI(`/speakers/admin/${eventId}/bulk-create`, {
      method: 'POST',
      body: JSON.stringify({ speakers }),
    });
  },

  updateSpeaker(speakerId: string, payload: Partial<Speaker>) {
    return fetchAPI<Speaker>(`/speakers/${speakerId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteSpeaker(eventId: string, speakerId: string) {
    return fetchAPI(`/events/${eventId}/speakers/${speakerId}`, {
      method: 'DELETE',
    });
  },

  reorderSpeakers(eventId: string, order: string[]) {
    return fetchAPI(`/events/${eventId}/speakers/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ order }),
    });
  },

  uploadPhoto(eventId: string, speakerId: string, formData: FormData) {
    return fetch(`${BASE_URL}/events/${eventId}/speakers/${speakerId}/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
      },
      body: formData,
    }).then((r) => r.json());
  },
};

// ── exhibitorsAPI ─────────────────────────────────────────────────────────────

export const exhibitorsAPI = {
  getExhibitors(eventId: string) {
    return fetchAPI<Exhibitor[]>(`/events/${eventId}/exhibitors`);
  },

  getExhibitor(exhibitorId: string) {
    return fetchAPI<Exhibitor>(`/exhibitors/${exhibitorId}`);
  },

  createExhibitor(eventId: string, payload: Partial<Exhibitor>) {
    return fetchAPI<Exhibitor>(`/exhibitors/${eventId}/Create/exhibitor`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  bulkCreateExhibitors(eventId: string, exhibitors: Partial<Exhibitor>[]) {
    return fetchAPI(`/exhibitors/${eventId}/bulk-create`, {
      method: 'POST',
      body: JSON.stringify({ exhibitors }),
    });
  },

  updateExhibitor(exhibitorId: string, payload: Partial<Exhibitor>) {
    return fetchAPI<Exhibitor>(`/exhibitors/${exhibitorId}/update/exhibitor`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  deleteExhibitor(exhibitorId: string) {
    return fetchAPI(`/exhibitors/${exhibitorId}`, { method: 'DELETE' });
  },

  reorderExhibitors(eventId: string, order: string[]) {
    return fetchAPI(`/exhibitors/${eventId}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ order }),
    });
  },

  uploadLogo(eventId: string, exhibitorId: string, formData: FormData) {
    return fetch(
      `${BASE_URL}/events/${eventId}/exhibitors/${exhibitorId}/logo`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
        },
        body: formData,
      },
    ).then((r) => r.json());
  },
};

// ── brandingAPI ───────────────────────────────────────────────────────────────

export const brandingAPI = {
  getBranding(eventId: string) {
    return fetchAPI<Branding>(`/events/${eventId}/branding`);
  },

  updateBranding(eventId: string, payload: Partial<Branding>) {
    return fetchAPI<Branding>(`/events/${eventId}/branding`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  uploadLogo(eventId: string, formData: FormData) {
    return fetch(`${BASE_URL}/events/${eventId}/branding/logo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
      },
      body: formData,
    }).then((r) => r.json());
  },

  uploadBanner(eventId: string, formData: FormData) {
    return fetch(`${BASE_URL}/events/${eventId}/branding/banner`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
      },
      body: formData,
    }).then((r) => r.json());
  },

  uploadBackground(eventId: string, formData: FormData) {
    return fetch(`${BASE_URL}/events/${eventId}/branding/background`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
      },
      body: formData,
    }).then((r) => r.json());
  },

  uploadFloorPlan(eventId: string, formData: FormData) {
    return fetch(`${BASE_URL}/events/${eventId}/branding/floor-plan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
      },
      body: formData,
    }).then((r) => r.json());
  },
};

// ── ticketsAPI ────────────────────────────────────────────────────────────────

export const ticketsAPI = {
  getMyTickets() {
    return fetchAPI<TicketType[]>('/tickets/my');
  },

  getEventTickets(eventId: string) {
    return fetchAPI<TicketType[]>(`/tickets/events/${eventId}/tickets`);
  },

  getTicket(ticketId: string) {
    return fetchAPI<TicketType>(`/tickets/${ticketId}`);
  },

  getTicketTypes(eventId: string) {
    return fetchAPI(`/events/${eventId}/ticket-types`);
  },

  createTicketType(eventId: string, payload: object) {
    return fetchAPI(`/events/${eventId}/ticket-types`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateTicketType(eventId: string, ticketTypeId: string, payload: object) {
    return fetchAPI(`/events/${eventId}/ticket-types/${ticketTypeId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteTicketType(eventId: string, ticketTypeId: string) {
    return fetchAPI(`/events/${eventId}/ticket-types/${ticketTypeId}`, { method: 'DELETE' });
  },
};

// ── sponsorsAPI ───────────────────────────────────────────────────────────────

export const sponsorsAPI = {
  getSponsors(eventId: string) {
    return fetchAPI(`/events/${eventId}/sponsors`);
  },

  upsertSponsor(payload: Partial<Sponsor>) {
    return fetchAPI<Sponsor>('/sponsors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ── notificationsAPI ──────────────────────────────────────────────────────────

export const notificationsAPI = {
  getAll(opts?: PaginationOptions) {
    const q = new URLSearchParams(opts as Record<string, string>).toString();
    return fetchAPI<Notification[]>(`/notifications${q ? `?${q}` : ''}`);
  },

  getById(notificationId: string) {
    return fetchAPI<Notification>(`/notifications/${notificationId}`);
  },

  markRead(notificationId: string) {
    return fetchAPI(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  markAllRead() {
    return fetchAPI('/notifications/read-all', { method: 'PATCH' });
  },

  getPreferences() {
    return fetchAPI<NotificationPreferences>('/notifications/preferences');
  },

  updatePreferences(payload: Partial<NotificationPreferences>) {
    return fetchAPI('/notifications/preferences', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

// ── storageAPI ────────────────────────────────────────────────────────────────

export const storageAPI = {
  upload(formData: FormData) {
    return fetch(`${BASE_URL}/storage/uploads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
      },
      body: formData,
    }).then((r) => r.json());
  },
};

// ── checkInAPI ────────────────────────────────────────────────────────────────

const checkInAPI = {
  getEventStatus: (eventId: string) =>
    fetchAPI(`/check-in/event/${eventId}/status`),
};

export { checkInAPI };

// ── adminAPI ──────────────────────────────────────────────────────────────────

const adminAPI = {
  inviteMember(payload: { email: string; fullName: string; role?: string }) {
    return fetchAPI('/admin/invite', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export { adminAPI };

// ── importAPI ─────────────────────────────────────────────────────────────────

const importAPI = {
  importSpeakers: (eventId: string, file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return fetch(`${BASE_URL}/events/${eventId}/import/speakers`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
      body: fd,
    }).then(r => r.json());
  },
  importExhibitors: (eventId: string, file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return fetch(`${BASE_URL}/events/${eventId}/import/exhibitors`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
      body: fd,
    }).then(r => r.json());
  },
  importSessions: (eventId: string, file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return fetch(`${BASE_URL}/events/${eventId}/import/sessions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
      body: fd,
    }).then(r => r.json());
  },
};

export { importAPI };
