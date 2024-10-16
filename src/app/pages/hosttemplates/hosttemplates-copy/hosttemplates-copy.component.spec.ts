import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosttemplatesCopyComponent } from './hosttemplates-copy.component';

describe('HosttemplatesCopyComponent', () => {
    let component: HosttemplatesCopyComponent;
    let fixture: ComponentFixture<HosttemplatesCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HosttemplatesCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HosttemplatesCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
