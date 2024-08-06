import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconComponent } from "../components/icon/icon.component";

@NgModule({
  declarations: [],
  imports: [CommonModule, IconComponent],
  exports: [CommonModule, IconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
