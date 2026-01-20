import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsBrowserModalComponent } from './hosts-browser-modal.component';

describe('HostsBrowserModalComponent', () => {
    let component: HostsBrowserModalComponent;
    let fixture: ComponentFixture<HostsBrowserModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsBrowserModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsBrowserModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
