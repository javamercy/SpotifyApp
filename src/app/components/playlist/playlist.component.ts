import { Component, OnInit, OnDestroy } from "@angular/core";
import { Playlist } from "../../models/playlist.model";
import { PlaylistService } from "../../services/playlist.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SharedModule } from "../../shared/modules/shared.module";
import { UserService } from "../../services/user.service";
import { User } from "../../models/user.model";
import { MsToTimePipe } from "../../pipes/ms-to-time.pipe";
import { MusicPlayerService } from "../../services/music-player.service";
import { PlaylistTrackItem } from "../../models/playlist-track-item.model";
import { ToastrService } from "ngx-toastr";
import { Track } from "../../models/track.model";
import { StripHtmlPipe } from "../../pipes/strip-html.pipe";
import { MusicPlayerComponent } from "../../shared/components/music-player/music-player.component";

@Component({
  selector: "app-playlist",
  standalone: true,
  imports: [SharedModule, MsToTimePipe, StripHtmlPipe, MusicPlayerComponent],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.css",
})
export class PlaylistComponent implements OnInit, OnDestroy {
  playlist: Playlist;
  owner: User;
  selectedTrack: PlaylistTrackItem;
  currentlyPlayingTrack: Track;
  isPlaying: boolean;
  isPlaylistLoaded: boolean;
  savedTracks: Map<string, boolean> = new Map<string, boolean>();

  private readonly subscriptions: Subscription = new Subscription();

  constructor(
    private playlistService: PlaylistService,
    private userService: UserService,
    private musicPlayerService: MusicPlayerService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params => {
        const id = params["id"];
        this.getPlaylist(id);
      })
    );

    this.subscriptions.add(
      this.musicPlayerService.track$.subscribe({
        next: track => {
          this.currentlyPlayingTrack = track;
        },
      })
    );

    this.subscriptions.add(
      this.musicPlayerService.isPlaying$.subscribe({
        next: isPlaying => {
          this.isPlaying = isPlaying;
        },
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getPlaylist(id: string) {
    this.subscriptions.add(
      this.playlistService.getById(id).subscribe({
        next: playlist => {
          this.playlist = playlist;
          this.getOwner(playlist.owner.id);
          this.isPlaylistLoaded = true;
          this.getSavedTracks(playlist.tracks.items.map(item => item.track.id));
        },
      })
    );
  }

  getOwner(id: string) {
    this.subscriptions.add(
      this.userService.getById(id).subscribe({
        next: owner => {
          this.owner = owner;
        },
        error: error => console.error(error),
      })
    );
  }

  play(track: PlaylistTrackItem) {
    this.musicPlayerService.play(track.track);
  }

  getJoinedArtists(artists: { name: string }[]) {
    if (!artists || artists.length == 0) return "";
    return artists.map(artist => artist.name).join(", ");
  }

  setSelectedTrack(track: PlaylistTrackItem, event: Event) {
    event.stopPropagation();
    this.selectedTrack = track;
  }

  save(track: PlaylistTrackItem) {
    this.userService.saveTrack(track.track.id).subscribe({
      next: () => {
        this.selectedTrack = null;
        this.savedTracks.set(track.track.id, true);
      },
      error: error => console.error(error),
    });
  }

  unsave(track: PlaylistTrackItem) {
    this.userService.unsaveTrack(track.track.id).subscribe({
      next: () => {
        this.selectedTrack = null;
        this.savedTracks.set(track.track.id, false);
      },
      error: error => console.error(error),
    });
  }

  getSavedTracks(trackIds: string[]) {
    this.subscriptions.add(
      this.userService.getSavedTracks(trackIds).subscribe({
        next: likedTracks => {
          trackIds.forEach((id, index) => {
            this.savedTracks.set(id, likedTracks[index]);
          });
        },
        error: error => console.error(error),
      })
    );
  }

  isTrackSaved(track: PlaylistTrackItem) {
    return this.savedTracks.get(track.track.id);
  }

  getListItemBgClass(track: PlaylistTrackItem) {
    if (!track) return "";
    if (
      this.currentlyPlayingTrack &&
      this.currentlyPlayingTrack.id == track.track.id
    ) {
      return "var(--mint-cream)";
    } else {
      return "";
    }
  }

  togglePlayback(e: Event) {
    e.stopPropagation();
    this.musicPlayerService.toggle();
  }

  likePlaylist() {
    throw new Error("Method not implemented.");
  }

  redirecToSpotify() {
    window.open(
      this.playlist.external_urls.spotify,
      "_blank",
      "noopener noreferrer"
    );
  }

  onHeartClick(track: PlaylistTrackItem, e: Event) {
    e.stopPropagation();
    this.unsave(track);
  }
}
