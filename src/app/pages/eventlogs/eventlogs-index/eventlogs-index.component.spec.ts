import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventlogsIndexComponent } from './eventlogs-index.component';

describe('SystemHealthUsersIndexComponent', () => {
    let component: EventlogsIndexComponent;
    let fixture: ComponentFixture<EventlogsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventlogsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventlogsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
