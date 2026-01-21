import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsPiechartWidget180Component } from './hosts-piechart-widget180.component';

describe('HostsPiechartWidget180Component', () => {
    let component: HostsPiechartWidget180Component;
    let fixture: ComponentFixture<HostsPiechartWidget180Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsPiechartWidget180Component]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsPiechartWidget180Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
