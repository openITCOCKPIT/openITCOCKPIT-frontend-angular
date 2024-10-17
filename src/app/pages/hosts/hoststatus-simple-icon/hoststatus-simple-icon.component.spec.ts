import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoststatusSimpleIconComponent } from './hoststatus-simple-icon.component';

describe('HoststatusIconComponent', () => {
    let component: HoststatusSimpleIconComponent;
    let fixture: ComponentFixture<HoststatusSimpleIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HoststatusSimpleIconComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HoststatusSimpleIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
