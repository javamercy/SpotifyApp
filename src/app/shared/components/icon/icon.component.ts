import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-icon",
  standalone: true,
  imports: [CommonModule],
  template: ` <svg
    [attr.width]="width"
    [attr.height]="height"
    [attr.viewBox]="viewBox"
    [ngStyle]="{ fill: color }"
    class="ek-icon">
    <use [attr.xlink:href]="path"></use>
  </svg>`,
  styles: [
    `
      .ek-icon {
        display: inline-block !important;
        vertical-align: middle !important;
      }
    `,
  ],
})
export class IconComponent {
  @Input() path: string;
  @Input() width = "24";
  @Input() height = "24";
  @Input() color = "currentColor";
  @Input() viewBox = "0 0 16 16";
}
