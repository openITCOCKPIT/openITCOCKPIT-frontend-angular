import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportersEditComponent } from './importers-edit.component';

describe('ImportersEditComponent', () => {
    let component: ImportersEditComponent;
    let fixture: ComponentFixture<ImportersEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportersEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ImportersEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
