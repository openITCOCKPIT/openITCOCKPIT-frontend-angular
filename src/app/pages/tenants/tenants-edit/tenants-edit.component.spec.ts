import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsEditComponent } from './tenants-edit.component';

describe('TenantsEditComponent', () => {
    let component: TenantsEditComponent;
    let fixture: ComponentFixture<TenantsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TenantsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TenantsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
