import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomapViewerComponent } from './automap-viewer.component';

describe('AutomapViewerComponent', () => {
    let component: AutomapViewerComponent;
    let fixture: ComponentFixture<AutomapViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutomapViewerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AutomapViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
