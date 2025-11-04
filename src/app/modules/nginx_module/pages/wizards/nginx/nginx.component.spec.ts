import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NginxComponent } from './nginx.component';

describe('NginxComponent', () => {
    let component: NginxComponent;
    let fixture: ComponentFixture<NginxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NginxComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NginxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
