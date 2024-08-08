import { Injectable } from "@angular/core";
import { Track } from "../models/track.model";
import { BehaviorSubject, Observable, shareReplay } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MusicPlayerService {
  private trackSubject: BehaviorSubject<Track | null> =
    new BehaviorSubject<Track | null>(null);
  track$: Observable<Track | null> = this.trackSubject
    .asObservable()
    .pipe(shareReplay(1));
  private isPlayingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isPlaying$: Observable<boolean> = this.isPlayingSubject
    .asObservable()
    .pipe(shareReplay(1));

  play(track: Track) {
    this.isPlayingSubject.next(true);
    this.trackSubject.next(track);
  }

  toggle() {
    this.isPlayingSubject.next(!this.isPlayingSubject.value);
  }

  pause() {
    this.isPlayingSubject.next(false);
  }

  clear() {
    this.trackSubject.next(null);
    this.isPlayingSubject.next(false);
  }
}
