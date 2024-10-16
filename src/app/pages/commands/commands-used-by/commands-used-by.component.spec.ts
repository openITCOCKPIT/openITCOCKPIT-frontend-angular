import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsUsedByComponent } from './commands-used-by.component';

describe('CommandsUsedByComponent', () => {
    let component: CommandsUsedByComponent;
    let fixture: ComponentFixture<CommandsUsedByComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommandsUsedByComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CommandsUsedByComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
