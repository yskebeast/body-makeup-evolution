export const customFetch = async <TData>(url: string, options: RequestInit = {}): Promise<TData> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const requestUrl = new URL(url, baseUrl);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(requestUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data: TData = await response.json();
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return Promise.reject(error);
    }

    console.error("customFetch Error:", error);
    throw error;
  }
};
