import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsBrowserMenuComponent } from './hosts-browser-menu.component';

describe('HostsBrowserMenuComponent', () => {
    let component: HostsBrowserMenuComponent;
    let fixture: ComponentFixture<HostsBrowserMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsBrowserMenuComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsBrowserMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
