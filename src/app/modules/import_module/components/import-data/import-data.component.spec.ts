import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDataComponent } from './import-data.component';

describe('ImportITopDataComponent', () => {
    let component: ImportDataComponent;
    let fixture: ComponentFixture<ImportDataComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportDataComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ImportDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
