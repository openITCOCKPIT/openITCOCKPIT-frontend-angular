import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnDestroy,
    OnInit,
    output
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../layouts/coreui/layout.service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-iframe',
    imports: [
        TranslocoDirective
    ],
    templateUrl: './iframe.component.html',
    styleUrl: './iframe.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IframeComponent implements OnInit, OnDestroy {

    public url = input<string>('');
    public height = input<string>('100vh');
    public loaded = output<void>();

    public trustedUrl: SafeResourceUrl | null = null;
    public isFrameLoading = true;
    public isDarkTheme = false;

    private lastRawUrl = '';
    private loadTimeout?: ReturnType<typeof setTimeout>;
    private subscriptions = new Subscription();

    private cdr = inject(ChangeDetectorRef);
    private layoutService = inject(LayoutService);

    public constructor(private sanitizer: DomSanitizer) {
        effect(() => {
            const currentUrl = this.url();

            if (!currentUrl) {
                this.trustedUrl = null;
                this.lastRawUrl = '';
                this.isFrameLoading = false;
                this.cdr.markForCheck();
                return;
            }

            if (currentUrl === this.lastRawUrl) {
                return;
            }

            this.isFrameLoading = true;
            this.lastRawUrl = currentUrl;
            this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(currentUrl);

            this.cdr.markForCheck();
        });
    }

    public ngOnInit(): void {
        this.isDarkTheme = this.layoutService.getTheme() === 'dark';

        this.subscriptions.add(
            this.layoutService.theme$.subscribe((theme: string) => {
                this.isDarkTheme = theme === 'dark';
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }
    }

    public onFrameLoad(): void {
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }

        this.loadTimeout = setTimeout(() => {
            this.isFrameLoading = false;
            this.loaded.emit();
            this.cdr.markForCheck();
        }, 700);
    }
}
