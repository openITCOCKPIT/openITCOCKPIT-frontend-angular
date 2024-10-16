import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsAddComponent } from './hosts-add.component';

describe('HostsAddComponent', () => {
    let component: HostsAddComponent;
    let fixture: ComponentFixture<HostsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
