import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCsvDataComponent } from './import-csv-data.component';

describe('ImportITopDataComponent', () => {
    let component: ImportCsvDataComponent;
    let fixture: ComponentFixture<ImportCsvDataComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportCsvDataComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ImportCsvDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
