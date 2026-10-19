import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsSummaryLoaderComponent } from './operations-summary-loader.component';

describe('ProxmoxBrowserLoaderComponent', () => {
    let component: OperationsSummaryLoaderComponent;
    let fixture: ComponentFixture<OperationsSummaryLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OperationsSummaryLoaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OperationsSummaryLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
