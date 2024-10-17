import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersIndexComponent } from './containers-index.component';

describe('ContainersIndexComponent', () => {
    let component: ContainersIndexComponent;
    let fixture: ComponentFixture<ContainersIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContainersIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ContainersIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
