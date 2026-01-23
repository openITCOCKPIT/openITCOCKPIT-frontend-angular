import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApacheHttpComponent } from './apache-http.component';

describe('ApacheHttpComponent', () => {
    let component: ApacheHttpComponent;
    let fixture: ComponentFixture<ApacheHttpComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApacheHttpComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ApacheHttpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
