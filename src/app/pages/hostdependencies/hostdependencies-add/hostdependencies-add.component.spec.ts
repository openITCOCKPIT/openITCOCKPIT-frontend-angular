import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostdependenciesAddComponent } from './hostdependencies-add.component';

describe('HostdependenciesAddComponent', () => {
    let component: HostdependenciesAddComponent;
    let fixture: ComponentFixture<HostdependenciesAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostdependenciesAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostdependenciesAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
