import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-priority',
    imports: [
    FaIconComponent,
    NgClass
],
    templateUrl: './priority.component.html',
    styleUrl: './priority.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriorityComponent {
    public priority = input<number>(1)
    public onChange = output<number>();

    public priorityClass: string[] = [
        'text-muted',
        'text-muted',
        'text-muted',
        'text-muted',
        'text-muted'
    ];

    private colors: string[] = [
        'ok-soft',
        'ok',
        'warning',
        'critical-soft',
        'critical'
    ];

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.setPriorityClasses(this.priority());
        });
    }

    private setPriorityClasses(priority: number) {
        let index = priority - 1; // Adjust to array index
        let color = this.colors[index];
        for (let i = 0; i <= index; i++) {
            this.priorityClass[i] = color;
        }

        if (priority < 5) {
            for (let i = priority; i <= 5; i++) {
                this.priorityClass[i] = 'text-muted';
            }
        }
        this.cdr.markForCheck();
    }

    public hoverPriority(priority: number) {
        this.setPriorityClasses(priority);
    }

    public mouseleave() {
        this.setPriorityClasses(this.priority());
    }

    public setPriority(priority: number) {
        this.setPriorityClasses(priority);
        this.onChange.emit((priority));
    }
}

