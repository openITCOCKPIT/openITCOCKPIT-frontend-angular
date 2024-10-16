import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimeSimpleIconComponent } from './downtime-simple-icon.component';

describe('DowntimeSimpleIconComponent', () => {
    let component: DowntimeSimpleIconComponent;
    let fixture: ComponentFixture<DowntimeSimpleIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DowntimeSimpleIconComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DowntimeSimpleIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
