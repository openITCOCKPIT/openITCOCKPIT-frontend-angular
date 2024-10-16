import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserMenuLoaderComponent } from './browser-menu-loader.component';

describe('BrowserMenuLoaderComponent', () => {
    let component: BrowserMenuLoaderComponent;
    let fixture: ComponentFixture<BrowserMenuLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserMenuLoaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowserMenuLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
