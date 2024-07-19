import { AlbumType } from "../enums/album-type";
import { Image } from "./image.model";
import { ListResponse } from "./list-response.model";
import { Track } from "./track.model";

export class Album {
  album_type: AlbumType;
  total_tracks: number;
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  artists: {
    external_urls: { spotify: string };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  tracks: ListResponse<Track>;
  uri: string;
  copyrights: { text: string; type: string }[];
  external_ids: { upc: string; ean: string; isrc: string };
  genres: string[];
  label: string;
  popularity: number;
}
