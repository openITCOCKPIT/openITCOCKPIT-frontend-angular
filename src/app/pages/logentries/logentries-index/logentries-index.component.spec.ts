import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogentriesIndexComponent } from './logentries-index.component';

describe('LogentriesIndexComponent', () => {
    let component: LogentriesIndexComponent;
    let fixture: ComponentFixture<LogentriesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LogentriesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LogentriesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
