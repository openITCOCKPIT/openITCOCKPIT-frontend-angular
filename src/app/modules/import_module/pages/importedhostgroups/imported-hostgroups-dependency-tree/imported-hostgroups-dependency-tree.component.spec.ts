import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedHostgroupsDependencyTreeComponent } from './imported-hostgroups-dependency-tree.component';

describe('ImportedHostgroupsDependencyTreeComponent', () => {
    let component: ImportedHostgroupsDependencyTreeComponent;
    let fixture: ComponentFixture<ImportedHostgroupsDependencyTreeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImportedHostgroupsDependencyTreeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ImportedHostgroupsDependencyTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
