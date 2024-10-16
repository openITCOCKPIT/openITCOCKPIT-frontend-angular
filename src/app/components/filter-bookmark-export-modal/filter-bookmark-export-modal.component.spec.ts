import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsConfigExportModalComponent } from './filter-bookmark-export-modal.component';

describe('ColumnsConfigExportModalComponent', () => {
    let component: ColumnsConfigExportModalComponent;
    let fixture: ComponentFixture<ColumnsConfigExportModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColumnsConfigExportModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ColumnsConfigExportModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
