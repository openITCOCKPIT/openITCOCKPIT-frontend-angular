import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosttemplatesAddComponent } from './hosttemplates-add.component';

describe('HosttemplatesAddComponent', () => {
    let component: HosttemplatesAddComponent;
    let fixture: ComponentFixture<HosttemplatesAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HosttemplatesAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HosttemplatesAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
