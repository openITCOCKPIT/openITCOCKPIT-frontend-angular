import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostdependenciesTreeComponent } from './hostdependencies-tree.component';

describe('HostdependenciesTreeComponent', () => {
    let component: HostdependenciesTreeComponent;
    let fixture: ComponentFixture<HostdependenciesTreeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostdependenciesTreeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostdependenciesTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
