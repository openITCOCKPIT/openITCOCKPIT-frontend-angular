import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostdependenciesEditComponent } from './hostdependencies-edit.component';

describe('HostdependenciesEditComponent', () => {
    let component: HostdependenciesEditComponent;
    let fixture: ComponentFixture<HostdependenciesEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostdependenciesEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostdependenciesEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
