import { Directive, ElementRef, Input, Renderer2, OnInit } from "@angular/core";
import { FastAverageColor } from "fast-average-color";

@Directive({
  selector: "[appAverageColor]",

  standalone: true,
})
export class AverageColorDirective implements OnInit {
  @Input("appAverageColor") imageUrl: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setAverageColor();
  }

  private setAverageColor() {
    const fac = new FastAverageColor();
    fac
      .getColorAsync(this.imageUrl)
      .then(color => {
        this.renderer.setStyle(
          this.el.nativeElement,
          "background-color",
          color.hex
        );
        const luminance = this.calculateLuminance(color.value);
        const textColor = luminance > 0.5 ? "#000" : "#FFF";
        this.renderer.setStyle(this.el.nativeElement, "color", textColor);
      })
      .catch(e => {
        console.error(e);
      });
  }

  private calculateLuminance([r, g, b]: number[]) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
}
