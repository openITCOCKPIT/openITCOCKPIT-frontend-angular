import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfdataTextItemComponent } from './perfdata-text-item.component';

describe('PerfdataTextItemComponent', () => {
    let component: PerfdataTextItemComponent;
    let fixture: ComponentFixture<PerfdataTextItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PerfdataTextItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PerfdataTextItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
