import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlasHostsComponent } from './slas-hosts.component';

describe('SlasHostsComponent', () => {
    let component: SlasHostsComponent;
    let fixture: ComponentFixture<SlasHostsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlasHostsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlasHostsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
