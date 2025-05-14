import { queryClient } from "./queryClient";

// Get the API base URL from environment variables or use a default
const getApiUrl = () => {
  // When in development or using Vite's dev server with proxy
  if (import.meta.env.DEV) {
    return '';
  }
  // In production, use the environment variable or our deployed backend URL
  return import.meta.env.VITE_API_URL || 'https://email-backend-lhx2.onrender.com';
};

// Base API functions
export async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const apiUrl = getApiUrl();
  const fullUrl = url.startsWith('/') ? `${apiUrl}${url}` : `${apiUrl}/${url}`;
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}

// Authentication API calls
export async function login(username: string, password: string) {
  return fetchAPI<{ id: number; username: string; gmailConnected: boolean }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }
  );
}

export async function logout() {
  return fetchAPI<{ message: string }>("/api/auth/logout", {
    method: "POST",
  });
}

// Gmail API calls
export async function getGmailAuthUrl() {
  return fetchAPI<{ authUrl: string }>("/api/gmail/auth");
}

export async function getGmailStatus() {
  return fetchAPI<{ connected: boolean; email: string | null }>("/api/gmail/status");
}

// Email API calls
export async function sendEmail(data: {
  subject: string;
  body: string;
  to?: string;
  listId?: number;
  scheduledFor?: string;
}) {
  const response = await fetchAPI("/api/emails", {
    method: "POST",
    body: JSON.stringify(data),
  });
  
  // Invalidate queries after sending an email
  await queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
  if (data.scheduledFor) {
    await queryClient.invalidateQueries({ queryKey: ["/api/emails/scheduled"] });
  }
  
  return response;
}

export async function getEmails(status?: string) {
  const url = status ? `/api/emails?status=${status}` : "/api/emails";
  return fetchAPI<any[]>(url);
}

export async function getScheduledEmails() {
  return fetchAPI<any[]>("/api/emails/scheduled");
}

export async function deleteEmail(id: number) {
  const response = await fetchAPI(`/api/emails/${id}`, {
    method: "DELETE",
  });
  
  // Invalidate queries after deleting an email
  await queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
  await queryClient.invalidateQueries({ queryKey: ["/api/emails/scheduled"] });
  
  return response;
}

// Recipient API calls
export async function createRecipient(data: {
  email: string;
  name?: string;
  listId?: number;
}) {
  const response = await fetchAPI("/api/recipients", {
    method: "POST",
    body: JSON.stringify(data),
  });
  
  // Invalidate queries after creating a recipient
  await queryClient.invalidateQueries({ queryKey: ["/api/recipients"] });
  
  return response;
}

export async function getRecipients(listId?: number) {
  const url = listId ? `/api/recipients?listId=${listId}` : "/api/recipients";
  return fetchAPI<any[]>(url);
}

export async function deleteRecipient(id: number) {
  const response = await fetchAPI(`/api/recipients/${id}`, {
    method: "DELETE",
  });
  
  // Invalidate queries after deleting a recipient
  await queryClient.invalidateQueries({ queryKey: ["/api/recipients"] });
  
  return response;
}

// Recipient List API calls
export async function createRecipientList(data: {
  name: string;
  description?: string;
}) {
  const response = await fetchAPI("/api/recipient-lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
  
  // Invalidate queries after creating a list
  await queryClient.invalidateQueries({ queryKey: ["/api/recipient-lists"] });
  
  return response;
}

export async function getRecipientLists() {
  return fetchAPI<any[]>("/api/recipient-lists");
}

export async function deleteRecipientList(id: number) {
  const response = await fetchAPI(`/api/recipient-lists/${id}`, {
    method: "DELETE",
  });
  
  // Invalidate queries after deleting a list
  await queryClient.invalidateQueries({ queryKey: ["/api/recipient-lists"] });
  
  return response;
}

// Analytics API calls
export async function getAnalyticsOverview() {
  return fetchAPI<{
    totalSent: number;
    scheduled: number;
    openRate: string;
  }>("/api/analytics/overview");
}
