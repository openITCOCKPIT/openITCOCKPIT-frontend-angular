import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimeIconComponent } from './downtime-icon.component';

describe('DowntimeIconComponent', () => {
    let component: DowntimeIconComponent;
    let fixture: ComponentFixture<DowntimeIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DowntimeIconComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DowntimeIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
