import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsCopyComponent } from './hosts-copy.component';

describe('HostsCopyComponent', () => {
    let component: HostsCopyComponent;
    let fixture: ComponentFixture<HostsCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
