import { Component } from "@angular/core";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [IconComponent],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.css",
})
export class FooterComponent {
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}
