import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { Employeetimesheet } from '../models/emp-ts';
import { Location } from "@angular/common";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrls: ['./show-task.component.css']
})
export class ShowTaskComponent implements OnInit {
  employee: Employeetimesheet[];
  employees: Employeetimesheet;
constructor(private apiService:ApiService,private location: Location,private matDialog:MatDialog) {
  this.employees = new Employeetimesheet();
  this.employee = [];
}
  ngOnInit(): void {
    this.getemployee()
  }

  getemployee(){
    this.apiService.getEmployees()
    .subscribe((data: any)   => {
      // console.log(data);
      this.employee=data;
  });
  }
  deletetask(employees:Employeetimesheet){
    if(confirm('Are you sure you want to delete?')){
      this.apiService.deleteassignment(employees).subscribe(data =>{
        // console.log(employees.id);
        this.getemployee();
      });
    }
  }

  openeditdialog(employees:Employeetimesheet){
    this.matDialog.open(EmployeeFormComponent,{
      width: '500px',
      height: '500px',
    });
    this.apiService.getdata(employees).subscribe(data =>{
      console.log(data);
      // this.getemployee();
    });

  }
  back(){
    this.location.back()
   }
}
