import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsConfigImportModalComponent } from './columns-config-import-modal.component';

describe('ColumnsConfigImportModalComponent', () => {
    let component: ColumnsConfigImportModalComponent;
    let fixture: ComponentFixture<ColumnsConfigImportModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColumnsConfigImportModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ColumnsConfigImportModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
