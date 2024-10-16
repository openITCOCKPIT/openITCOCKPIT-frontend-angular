import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsettingsIndexComponent } from './systemsettings-index.component';

describe('SystemsettingsIndexComponent', () => {
    let component: SystemsettingsIndexComponent;
    let fixture: ComponentFixture<SystemsettingsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SystemsettingsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SystemsettingsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
