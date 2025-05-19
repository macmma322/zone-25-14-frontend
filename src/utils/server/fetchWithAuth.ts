export async function fetchWithAuth(endpoint: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}
