import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';

@Component({
  selector: 'oitc-parent-outages-widget',
  imports: [],
  templateUrl: './parent-outages-widget.component.html',
  styleUrl: './parent-outages-widget.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentOutagesWidgetComponent extends BaseWidgetComponent{

}
