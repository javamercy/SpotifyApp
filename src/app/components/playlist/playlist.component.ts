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

@Component({
  selector: "app-playlist",
  standalone: true,
  imports: [SharedModule, MsToTimePipe],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.css",
})
export class PlaylistComponent implements OnInit, OnDestroy {
  playlist: Playlist;
  owner: User;
  selectedTrack: PlaylistTrackItem;
  currentlyPlayingTrack: Track;
  isPlaying: boolean;

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

  like(track: PlaylistTrackItem) {
    this.userService.saveTrack(track.track.id).subscribe({
      next: () => {
        this.toastrService.success("Track saved to your library", null, {
          tapToDismiss: true,
          positionClass: "toast-bottom-full-width",
          timeOut: 2500,
          progressBar: true,
          closeButton: false,
        });
        this.selectedTrack = null;
      },
      error: error => console.error(error),
    });
  }

  getListItemBgClass(track: PlaylistTrackItem) {
    if (!track) return "";
    if (
      this.currentlyPlayingTrack &&
      this.currentlyPlayingTrack.id == track.track.id
    ) {
      return "bg-body-tertiary";
    } else {
      return "";
    }
  }

  togglePlayback(e: Event) {
    e.stopPropagation();
    this.musicPlayerService.toggle();
  }
}
