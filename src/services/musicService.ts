import {
  ITUNES_SEARCH_BASE_URL,
  JAMENDO_CLIENT_ID,
  JAMENDO_TRACKS_BASE_URL,
} from "./constants";
import { type Song } from "../types/appTypes";

export const searchItunesMusic = async (query: string): Promise<any[]> => {
  const limit = 200;

  const response = await fetch(
    `${ITUNES_SEARCH_BASE_URL}?term=${encodeURIComponent(
      query,
    )}&entity=song&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  const data = await response.json();

  return data.results || [];
};

interface JamendoTrack {
  id: string;
  name: string;
  artist_name?: string;
  image?: string;
  audio?: string;
  album_name?: string;
  shareurl?: string;
}

const normalizeJamendoTrack = (track: JamendoTrack): Song => {
  const artwork = track.image || "";

  return {
    trackId: parseInt(track.id, 10) || Math.floor(Math.random() * 1000000), // Jamendo IDs can be strings
    trackName: track.name,
    artistName: track.artist_name || "Unknown Artist",
    artworkUrl60: artwork,
    artworkUrl100: artwork,
    previewUrl: track.audio || "",
    collectionName: track.album_name || "",
    externalUrl: track.shareurl || "",
    source: "jamendo",
  };
};

interface SearchJamendoOptions {
  clientId?: string;
  fullcount?: boolean;
  imagesize?: number;
  limit?: number;
  offset?: number;
  query: string;
  order?: string;
  audioformat?: string;
  signal?: AbortSignal;
}

interface JamendoResponse {
  headers: {
    status: string;
    error_message?: string;
    results_fullcount?: number;
    results_count?: number;
  };
  results: JamendoTrack[];
}

export const searchJamendoTracks = async ({
  clientId = JAMENDO_CLIENT_ID,
  fullcount = true,
  imagesize = 100,
  limit = 20,
  offset = 0,
  query,
  order = "relevance",
  audioformat = "mp32",
  signal,
}: SearchJamendoOptions): Promise<{
  items: Song[];
  next: number | null;
  offset: number;
  total: number;
}> => {
  if (!query?.trim()) {
    return { items: [], next: null, offset: 0, total: 0 };
  }

  if (!clientId?.trim()) {
    throw new Error("Jamendo client ID is required");
  }

  const response = await fetch(
    `${JAMENDO_TRACKS_BASE_URL}?client_id=${encodeURIComponent(
      clientId,
    )}&format=json&namesearch=${encodeURIComponent(
      query,
    )}&limit=${limit}&offset=${offset}&imagesize=${imagesize}&audioformat=${audioformat}&order=${encodeURIComponent(
      order,
    )}&fullcount=${fullcount}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Jamendo search failed with status ${response.status}`);
  }

  const data: JamendoResponse = await response.json();
  if (data.headers?.status === "failed") {
    throw new Error(data.headers?.error_message || "Jamendo search failed");
  }

  const items = (data.results || []).map(normalizeJamendoTrack);
  const total =
    data.headers?.results_fullcount || data.headers?.results_count || 0;
  const nextOffset = offset + items.length;
  const next = nextOffset < total ? nextOffset : null;

  return {
    items,
    next,
    offset,
    total,
  };
};

export const searchMusic = async (query: string): Promise<Song[]> => {
  const data = await searchJamendoTracks({ query });
  return data.items;
};
