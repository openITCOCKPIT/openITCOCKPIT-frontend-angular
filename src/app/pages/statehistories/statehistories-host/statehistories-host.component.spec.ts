import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatehistoriesHostComponent } from './statehistories-host.component';

describe('StatehistoriesHostComponent', () => {
    let component: StatehistoriesHostComponent;
    let fixture: ComponentFixture<StatehistoriesHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatehistoriesHostComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatehistoriesHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
