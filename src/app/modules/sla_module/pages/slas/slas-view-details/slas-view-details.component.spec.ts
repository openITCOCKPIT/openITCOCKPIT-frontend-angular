import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlasViewDetailsComponent } from './slas-view-details.component';

describe('SlasViewDetailsComponent', () => {
    let component: SlasViewDetailsComponent;
    let fixture: ComponentFixture<SlasViewDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlasViewDetailsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlasViewDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
