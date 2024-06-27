import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'oitc-snmptt-list-index',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './snmptt-list-index.component.html',
  styleUrl: './snmptt-list-index.component.css'
})
export class SnmpttListIndexComponent implements OnInit{
    public ngOnInit(): void {
        console.log('HERE !!!');
    }

}
