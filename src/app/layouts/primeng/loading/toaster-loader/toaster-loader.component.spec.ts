import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToasterLoaderComponent } from './toaster-loader.component';

describe('ToasterLoaderComponent', () => {
    let component: ToasterLoaderComponent;
    let fixture: ComponentFixture<ToasterLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToasterLoaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ToasterLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
