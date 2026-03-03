import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantreportViewerComponent } from './instantreport-viewer.component';

describe('InstantreportViewerComponent', () => {
    let component: InstantreportViewerComponent;
    let fixture: ComponentFixture<InstantreportViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InstantreportViewerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InstantreportViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
