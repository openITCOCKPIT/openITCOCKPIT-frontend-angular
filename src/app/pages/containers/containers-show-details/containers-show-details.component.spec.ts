import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersShowDetailsComponent } from './containers-show-details.component';

describe('ContainersShowDetailsComponent', () => {
    let component: ContainersShowDetailsComponent;
    let fixture: ComponentFixture<ContainersShowDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContainersShowDetailsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ContainersShowDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
