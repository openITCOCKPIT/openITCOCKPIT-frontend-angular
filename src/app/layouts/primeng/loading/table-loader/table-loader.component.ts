import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { MatSort } from '@angular/material/sort';
import { TableDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-table-loader',
    standalone: true,
    imports: [
        TableModule,
        SkeletonModule,
        MatSort,
        TableDirective
    ],
    templateUrl: './table-loader.component.html',
    styleUrl: './table-loader.component.css'
})
export class TableLoaderComponent {

}
