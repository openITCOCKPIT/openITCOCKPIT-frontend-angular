import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'oitc-browser-windows-apps',
    imports: [],
    templateUrl: './browser-windows-apps.component.html',
    styleUrl: './browser-windows-apps.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserWindowsAppsComponent {
    public hostId: InputSignal<number> = input<number>(0);

}
