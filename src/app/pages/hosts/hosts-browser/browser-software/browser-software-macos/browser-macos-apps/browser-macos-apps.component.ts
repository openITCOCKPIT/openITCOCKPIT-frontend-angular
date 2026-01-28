import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'oitc-browser-macos-apps',
    imports: [],
    templateUrl: './browser-macos-apps.component.html',
    styleUrl: './browser-macos-apps.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserMacosAppsComponent {
    public hostId: InputSignal<number> = input<number>(0);

}
