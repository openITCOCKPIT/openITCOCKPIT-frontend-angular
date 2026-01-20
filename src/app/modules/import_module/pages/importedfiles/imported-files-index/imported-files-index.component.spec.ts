import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedFilesIndexComponent } from './imported-files-index.component';

describe('ImportedFilesIndexComponent', () => {
    let component: ImportedFilesIndexComponent;
    let fixture: ComponentFixture<ImportedFilesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportedFilesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ImportedFilesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
