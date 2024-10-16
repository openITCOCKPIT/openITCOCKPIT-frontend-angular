import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedHostsIndexComponent } from './deleted-hosts-index.component';

describe('DeletedHostsIndexComponent', () => {
    let component: DeletedHostsIndexComponent;
    let fixture: ComponentFixture<DeletedHostsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DeletedHostsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DeletedHostsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
