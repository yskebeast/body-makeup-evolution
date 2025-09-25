export const fetcher = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not defined");
  }

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch error details:", {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorText,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
};
