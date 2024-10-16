import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosttemplatesIndexComponent } from './hosttemplates-index.component';

describe('HosttemplatesIndexComponent', () => {
    let component: HosttemplatesIndexComponent;
    let fixture: ComponentFixture<HosttemplatesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HosttemplatesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HosttemplatesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
