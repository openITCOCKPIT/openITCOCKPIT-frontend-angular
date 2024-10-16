import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosttemplatesEditComponent } from './hosttemplates-edit.component';

describe('HosttemplatesEditComponent', () => {
    let component: HosttemplatesEditComponent;
    let fixture: ComponentFixture<HosttemplatesEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HosttemplatesEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HosttemplatesEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
