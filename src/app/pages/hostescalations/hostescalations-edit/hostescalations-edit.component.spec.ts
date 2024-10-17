import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostescalationsEditComponent } from './hostescalations-edit.component';

describe('HostescalationsEditComponent', () => {
    let component: HostescalationsEditComponent;
    let fixture: ComponentFixture<HostescalationsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostescalationsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostescalationsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
