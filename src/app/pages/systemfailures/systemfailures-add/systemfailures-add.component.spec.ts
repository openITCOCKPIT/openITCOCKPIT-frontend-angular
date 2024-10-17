import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemfailuresAddComponent } from './systemfailures-add.component';

describe('SystemfailuresAddComponent', () => {
    let component: SystemfailuresAddComponent;
    let fixture: ComponentFixture<SystemfailuresAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SystemfailuresAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SystemfailuresAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
