import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenstreetmapIndexComponent } from './openstreetmap-index.component';

describe('OpenstreetmapIndexComponent', () => {
    let component: OpenstreetmapIndexComponent;
    let fixture: ComponentFixture<OpenstreetmapIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OpenstreetmapIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OpenstreetmapIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
