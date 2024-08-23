import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/sign-in/sign-in.component").then(
        m => m.SignInComponent
      ),
    canActivateChild: [authGuard],
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./components/dashboard/dashboard.component").then(
            m => m.DashboardComponent
          ),
      },
    ],
  },

  {
    path: "home",
    redirectTo: "",
    pathMatch: "full",
  },

  {
    path: "callback",
    loadComponent: () =>
      import("./components/spotify-callback/spotify-callback.component").then(
        m => m.SpotifyCallbackComponent
      ),
  },

  {
    path: "me",
    children: [
      {
        path: "stats",
        loadComponent: () =>
          import("./components/stats/stats.component").then(
            m => m.StatsComponent
          ),
        children: [
          {
            path: "tracks",
            loadComponent: () =>
              import("./components/stats/top-tracks/top-tracks.component").then(
                m => m.TopTracksComponent
              ),
          },
          {
            path: "artists",
            loadComponent: () =>
              import(
                "./components/stats/top-artists/top-artists.component"
              ).then(m => m.TopArtistsComponent),
          },
        ],
      },

      {
        path: "discover",
        children: [
          {
            path: "",
            loadComponent: () =>
              import(
                "./components/track-discover/track-discover.component"
              ).then(m => m.TrackDiscoverComponent),
          },
          {
            path: ":genre",
            loadComponent: () =>
              import(
                "./components/track-discover/track-discover.component"
              ).then(m => m.TrackDiscoverComponent),
          },
        ],
      },
    ],
  },

  {
    path: "playlist/:id",
    loadComponent: () =>
      import("./components/playlist/playlist.component").then(
        m => m.PlaylistComponent
      ),
  },
];
