import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostParentsChildrenTreeComponent } from './host-parents-children-tree.component';

describe('HostParentsChildrenTreeComponent', () => {
    let component: HostParentsChildrenTreeComponent;
    let fixture: ComponentFixture<HostParentsChildrenTreeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostParentsChildrenTreeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostParentsChildrenTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
