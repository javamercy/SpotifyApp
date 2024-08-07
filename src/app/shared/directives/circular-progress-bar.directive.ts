import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from "@angular/core";

@Directive({
  selector: "[appCircularProgressBar]",
  standalone: true,
})
export class CircularProgressBarDirective implements OnChanges {
  @Input("appCircularProgressBar") progress: {
    percentage: number;
    color: string;
  } = { percentage: 0, color: "transparent" };

  private svg: SVGElement;
  private circleBg: SVGPathElement;
  private circle: SVGPathElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.svg = this.renderer.createElement("svg", "svg");
    this.circleBg = this.renderer.createElement("path", "svg");
    this.circle = this.renderer.createElement("path", "svg");

    this.renderer.setAttribute(this.svg, "viewBox", "0 0 36 36");
    this.renderer.setAttribute(this.circleBg, "class", "ek-circle-bg");
    this.renderer.setAttribute(
      this.circleBg,
      "d",
      "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    );

    this.renderer.setAttribute(this.circle, "class", "ek-circle");
    this.renderer.setAttribute(
      this.circle,
      "d",
      "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    );

    this.adjustSvg();
    this.renderer.setStyle(this.circle, "stroke", this.progress.color);

    this.renderer.appendChild(this.svg, this.circleBg);
    this.renderer.appendChild(this.svg, this.circle);
    this.renderer.appendChild(this.el.nativeElement, this.svg);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["progress"]) {
      this.renderer.setAttribute(
        this.circle,
        "stroke-dasharray",
        `${this.progress.percentage}, 100`
      );
      this.renderer.setStyle(this.circle, "stroke", this.progress.color);
    }
  }

  private adjustSvg(): void {
    const iconElement = this.el.nativeElement;

    if (iconElement) {
      const width = parseInt(iconElement.getAttribute("width") || "50", 10);
      const height = parseInt(iconElement.getAttribute("height") || "50", 10);

      this.renderer.setStyle(this.svg, "width", `${width + 5}px`);
      this.renderer.setStyle(this.svg, "height", `${height + 5}px`);
      this.renderer.setStyle(this.svg, "position", "absolute");
      this.renderer.setStyle(this.svg, "top", "50%");
      this.renderer.setStyle(this.svg, "left", "50%");
      this.renderer.setStyle(this.svg, "transform", "translate(-50%, -50%)");
    }
  }
}
