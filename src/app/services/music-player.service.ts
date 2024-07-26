import { Injectable } from "@angular/core";
import { Track } from "../models/track.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MusicPlayerService {
  private trackSubject: BehaviorSubject<Track | null>;
  track$: Observable<Track | null>;

  constructor() {
    this.trackSubject = new BehaviorSubject<Track | null>(null);
    this.track$ = this.trackSubject.asObservable();
  }

  setTrack(track: Track) {
    this.trackSubject.next(track);
  }

  clearTrack() {
    this.trackSubject.next(null);
  }
}
