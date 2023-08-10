import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Employeetimesheet } from '../models/emp-ts';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent {
  employee:Employeetimesheet[] | undefined;
  employees = new Employeetimesheet();

  constructor(private apiService:ApiService){}

  savetask(employees:Employeetimesheet){
    this.apiService.editassignment(employees).subscribe(data =>{
      // this.getemployee();
      this.employees=data;
    });
  }
}
