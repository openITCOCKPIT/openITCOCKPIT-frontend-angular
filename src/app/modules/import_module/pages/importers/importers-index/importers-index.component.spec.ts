import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportersIndexComponent } from './importers-index.component';

describe('ImportersIndexComponent', () => {
    let component: ImportersIndexComponent;
    let fixture: ComponentFixture<ImportersIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportersIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ImportersIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
