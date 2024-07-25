import { Component, OnInit, OnDestroy } from "@angular/core";
import { Playlist } from "../../models/playlist.mode";
import { PlaylistService } from "../../services/playlist.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SharedModule } from "../../shared/modules/shared.module";
import { UserService } from "../../services/user.service";
import { User } from "../../models/user.model";
import { MsToTimePipe } from "../../pipes/ms-to-time.pipe";

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

  constructor(
    private playlistService: PlaylistService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = new Subscription();
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
                console.log(playlist.tracks);

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
}
