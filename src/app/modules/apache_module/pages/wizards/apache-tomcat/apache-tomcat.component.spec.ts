import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApacheTomcatComponent } from './apache-tomcat.component';

describe('ApacheTomcatComponent', () => {
    let component: ApacheTomcatComponent;
    let fixture: ComponentFixture<ApacheTomcatComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApacheTomcatComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ApacheTomcatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
