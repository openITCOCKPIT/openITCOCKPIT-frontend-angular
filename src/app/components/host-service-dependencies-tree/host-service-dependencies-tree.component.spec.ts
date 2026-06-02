import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostServiceDependenciesTreeComponent } from './host-service-dependencies-tree.component';

describe('HostServiceDependenciesTreeComponent', () => {
    let component: HostServiceDependenciesTreeComponent;
    let fixture: ComponentFixture<HostServiceDependenciesTreeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostServiceDependenciesTreeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostServiceDependenciesTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
