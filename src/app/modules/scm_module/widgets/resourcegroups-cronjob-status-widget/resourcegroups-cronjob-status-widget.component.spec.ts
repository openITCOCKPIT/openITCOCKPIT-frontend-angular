import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcegroupsCronjobStatusWidgetComponent } from './resourcegroups-cronjob-status-widget.component';

describe('ResourcegroupsCronjobStatusWidgetComponent', () => {
    let component: ResourcegroupsCronjobStatusWidgetComponent;
    let fixture: ComponentFixture<ResourcegroupsCronjobStatusWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResourcegroupsCronjobStatusWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ResourcegroupsCronjobStatusWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
