import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsEditComponent } from './hosts-edit.component';

describe('HostsEditComponent', () => {
    let component: HostsEditComponent;
    let fixture: ComponentFixture<HostsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
