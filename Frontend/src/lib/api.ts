const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const fetchJson = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url.startsWith("http") ? url : `${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      message = await response.text() || message;
    } catch {
      // Ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};

export const authApi = {
  login: (data: any) => fetchJson<any>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  register: (data: any) => fetchJson<any>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
};

