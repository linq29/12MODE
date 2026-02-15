import type { Shrine } from "@12mode/shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function fetchShrines(): Promise<Shrine[]> {
  const response = await fetch(`${API_BASE_URL}/api/shrines`);
  if (!response.ok) {
    throw new Error(`Failed to fetch shrines: ${response.status}`);
  }

  const payload = (await response.json()) as { shrines: Shrine[] };
  return payload.shrines;
}

export async function fetchShrine(spotId: number): Promise<Shrine | null> {
  const response = await fetch(`${API_BASE_URL}/api/shrines/${spotId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch shrine ${spotId}: ${response.status}`);
  }

  const payload = (await response.json()) as { shrine: Shrine };
  return payload.shrine;
}
