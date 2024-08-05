import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { MusicPlayerComponent } from "./shared/components/music-player/music-player.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MusicPlayerService } from "./services/music-player.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    MusicPlayerComponent,
    FooterComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  isLoding: boolean;
  isTrack: boolean;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private musicPlayerService: MusicPlayerService
  ) {}

  ngOnInit() {
    this.ngxSpinnerService.spinnerObservable.subscribe(status => {
      if (status) {
        this.isLoding = status.show;
      }
    });

    this.musicPlayerService.track$.subscribe(track => {
      this.isTrack = !!track;
    });
  }
}
