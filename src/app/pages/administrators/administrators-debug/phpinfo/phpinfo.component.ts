import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdministratorsService } from '../../administrators.service';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';

@Component({
    selector: 'oitc-phpinfo',
    imports: [
        TrustAsHtmlPipe
    ],
    templateUrl: './phpinfo.component.html',
    styleUrl: './phpinfo.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhpinfoComponent implements OnInit, OnDestroy {

    public phpinfoHtml: string = '';

    public readonly AdministratorsService = inject(AdministratorsService);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.subscriptions.add(this.AdministratorsService.getPhpinfo().subscribe(response => {
            this.phpinfoHtml = response;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
