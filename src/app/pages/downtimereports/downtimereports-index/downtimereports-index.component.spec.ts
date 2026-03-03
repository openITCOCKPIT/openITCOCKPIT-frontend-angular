import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimereportsIndexComponent } from './downtimereports-index.component';

describe('DowntimereportsIndexComponent', () => {
    let component: DowntimereportsIndexComponent;
    let fixture: ComponentFixture<DowntimereportsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DowntimereportsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DowntimereportsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
