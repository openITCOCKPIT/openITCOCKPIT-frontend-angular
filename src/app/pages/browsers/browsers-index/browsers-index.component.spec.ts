import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsersIndexComponent } from './browsers-index.component';

describe('BrowsersIndexComponent', () => {
    let component: BrowsersIndexComponent;
    let fixture: ComponentFixture<BrowsersIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowsersIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowsersIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
