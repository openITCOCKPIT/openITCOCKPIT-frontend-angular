import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsIndexComponent } from './commands-index.component';

describe('CommandsIndexComponent', () => {
    let component: CommandsIndexComponent;
    let fixture: ComponentFixture<CommandsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommandsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CommandsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
