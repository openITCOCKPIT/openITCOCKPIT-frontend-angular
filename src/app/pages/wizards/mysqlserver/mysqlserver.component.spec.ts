import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysqlserverComponent } from './mysqlserver.component';

describe('MysqlserverComponent', () => {
    let component: MysqlserverComponent;
    let fixture: ComponentFixture<MysqlserverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MysqlserverComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MysqlserverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
