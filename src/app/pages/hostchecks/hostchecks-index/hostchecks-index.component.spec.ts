import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostchecksIndexComponent } from './hostchecks-index.component';

describe('HostchecksIndexComponent', () => {
    let component: HostchecksIndexComponent;
    let fixture: ComponentFixture<HostchecksIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostchecksIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostchecksIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
