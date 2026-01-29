import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesComponent } from './kubernetes.component';

describe('StorageComponent', () => {
    let component: KubernetesComponent;
    let fixture: ComponentFixture<KubernetesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KubernetesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(KubernetesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
