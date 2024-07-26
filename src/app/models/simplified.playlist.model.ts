import { Image } from "./image.model";
import { Track } from "./track.model";
import { User } from "./user.model";

export interface SimplifiedPlaylist {
  collaborative: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: User;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: Track[];
  type: string;
  uri: string;
}
