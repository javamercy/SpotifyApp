import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { AverageColorDirective } from "../directives/average-color.directive";

@NgModule({
  declarations: [],
  imports: [CommonModule, NavbarComponent, AverageColorDirective],
  exports: [CommonModule, NavbarComponent, AverageColorDirective],
})
export class SharedModule {}
