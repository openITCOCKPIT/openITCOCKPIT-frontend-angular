import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsBrowserServicesListComponent } from './hosts-browser-services-list.component';

describe('HostsBrowserServicesListComponent', () => {
    let component: HostsBrowserServicesListComponent;
    let fixture: ComponentFixture<HostsBrowserServicesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsBrowserServicesListComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsBrowserServicesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
