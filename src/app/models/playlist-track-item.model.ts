import { Track } from "./track.model";
import { User } from "./user.model";

export class PlaylistTrackItem {
  added_at: string;
  added_by: User;
  is_local: boolean;
  primary_color: string;
  track: Track;
  video_thumbnail: {
    url: string;
  };
  constructor(
    added_at: string,
    added_by: User,
    is_local: boolean,
    primary_color: string,
    track: Track,
    video_thumbnail: { url: string }
  ) {
    this.added_at = added_at;
    this.added_by = added_by;
    this.is_local = is_local;
    this.primary_color = primary_color;
    this.track = track;
    this.video_thumbnail = video_thumbnail;
  }
}
