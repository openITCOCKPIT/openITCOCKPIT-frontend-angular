import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimesServiceComponent } from './downtimes-service.component';

describe('DowntimesServiceComponent', () => {
    let component: DowntimesServiceComponent;
    let fixture: ComponentFixture<DowntimesServiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DowntimesServiceComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DowntimesServiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
