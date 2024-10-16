import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusmapsIndexComponent } from './statusmaps-index.component';

describe('StatusmapsIndexComponent', () => {
    let component: StatusmapsIndexComponent;
    let fixture: ComponentFixture<StatusmapsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatusmapsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatusmapsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
