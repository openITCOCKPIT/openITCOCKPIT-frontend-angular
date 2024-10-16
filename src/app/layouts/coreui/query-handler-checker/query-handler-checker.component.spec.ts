import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryHandlerCheckerComponent } from './query-handler-checker.component';

describe('QueryHandlerCheckerComponent', () => {
    let component: QueryHandlerCheckerComponent;
    let fixture: ComponentFixture<QueryHandlerCheckerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QueryHandlerCheckerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(QueryHandlerCheckerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
