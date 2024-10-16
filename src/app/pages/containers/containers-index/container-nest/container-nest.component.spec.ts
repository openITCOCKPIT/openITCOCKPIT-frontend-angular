import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerNestComponent } from './container-nest.component';

describe('ContainerNestComponent', () => {
    let component: ContainerNestComponent;
    let fixture: ComponentFixture<ContainerNestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContainerNestComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ContainerNestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
