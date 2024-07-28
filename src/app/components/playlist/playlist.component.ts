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

@Component({
  selector: "app-playlist",
  standalone: true,
  imports: [SharedModule, MsToTimePipe],
  templateUrl: "./playlist.component.html",
  styleUrl: "./playlist.component.css",
})
export class PlaylistComponent implements OnInit, OnDestroy {
  playlist: Playlist;
  subscription: Subscription;
  owner: User;
  genres: Map<string, number>;

  constructor(
    private playlistService: PlaylistService,
    private userService: UserService,
    private musicPlayerService: MusicPlayerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = new Subscription();
    this.genres = new Map<string, number>();
  }

  ngOnInit() {
    this.getPlaylist();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPlaylist() {
    this.subscription.add(
      this.activatedRoute.params.subscribe({
        next: params => {
          this.subscription.add(
            this.playlistService.getById(params["id"]).subscribe({
              next: playlist => {
                this.playlist = playlist;
                console.log(playlist);

                this.getOwner(playlist.owner.id);
              },
            })
          );
        },
      })
    );
  }

  getOwner(id: string) {
    this.subscription.add(
      this.userService.getById(id).subscribe({
        next: owner => {
          this.owner = owner;
        },
        error: error => console.error(error),
      })
    );
  }

  play(track: PlaylistTrackItem) {
    this.musicPlayerService.setTrack(track.track);
  }
}
