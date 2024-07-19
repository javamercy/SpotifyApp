import { Album } from "./album.model";
import { Artist } from "./artist.model";

export class Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string; ean: string; upc: string };
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: Track;
  restrictions: { reason: string };
  name: string;
  popularity: number;
  preview_url?: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}
