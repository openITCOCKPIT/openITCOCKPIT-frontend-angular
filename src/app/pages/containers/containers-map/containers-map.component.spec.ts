import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersMapComponent } from './containers-map.component';

describe('ContainersMapComponent', () => {
    let component: ContainersMapComponent;
    let fixture: ComponentFixture<ContainersMapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContainersMapComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ContainersMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
