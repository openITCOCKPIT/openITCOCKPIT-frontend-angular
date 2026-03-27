import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEchartComponent } from './test-echart.component';

describe('TestEchartComponent', () => {
    let component: TestEchartComponent;
    let fixture: ComponentFixture<TestEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestEchartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TestEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
