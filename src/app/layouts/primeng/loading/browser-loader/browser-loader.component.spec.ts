import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserLoaderComponent } from './browser-loader.component';

describe('BrowserLoaderComponent', () => {
    let component: BrowserLoaderComponent;
    let fixture: ComponentFixture<BrowserLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserLoaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowserLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
