import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadInterfaceModalComponent } from './reload-interface-modal.component';

describe('ReloadInterfaceComponent', () => {
    let component: ReloadInterfaceModalComponent;
    let fixture: ComponentFixture<ReloadInterfaceModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReloadInterfaceModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ReloadInterfaceModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
