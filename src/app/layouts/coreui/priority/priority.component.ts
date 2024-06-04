import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgForOf } from '@angular/common';

@Component({
    selector: 'oitc-priority',
    standalone: true,
    imports: [
        FaIconComponent,
        NgClass,
        NgForOf
    ],
    templateUrl: './priority.component.html',
    styleUrl: './priority.component.css'
})
export class PriorityComponent implements OnChanges {
    @Input() priority: number = 1;
    @Output() onChange: EventEmitter<number> = new EventEmitter<number>();

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

    ngOnChanges(changes: SimpleChanges) {
        if (changes['priority']) {
            this.setPriorityClasses(changes['priority'].currentValue);
        }
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
    }

    public hoverPriority(priority: number) {
        this.setPriorityClasses(priority);
    }

    public mouseleave() {
        this.setPriorityClasses(this.priority);
    }

    public setPriority(priority: number) {
        this.priority = priority;
        //this.setPriorityClasses(priority); // done via ngOnChanges
        this.onChange.emit((priority));
    }
}
