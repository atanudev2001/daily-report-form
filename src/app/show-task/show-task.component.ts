import { ApiService } from './../api.service';
import { Component, OnInit,AfterViewInit,ViewChild, Inject } from '@angular/core';
import { Employeetimesheet } from '../models/emp-ts';
import { Location } from "@angular/common";
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { MAT_DIALOG_DATA, MatDialog,MatDialogRef } from '@angular/material/dialog';
import {MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrls: ['./show-task.component.css'],
})

export class ShowTaskComponent implements OnInit {

  displayedColumns: string[] = ['employeeName', 'taskDate', 'assignedTask', 'taskDetails','action'];
  finaldata : any;
  @ViewChild(MatPaginator)_paginator!: MatPaginator;


  employee: Employeetimesheet[];
  employees: Employeetimesheet;
  // editdata: any;
  // taskform: any;



constructor(
  private apiService:ApiService,
  private location: Location,
  private matDialog:MatDialog,
  ) {
  this.employees = new Employeetimesheet();
  this.employee = [];

}


  ngOnInit(): void {
    this.getemployee()


  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.finaldata.filter = filterValue.trim().toLowerCase();

    if (this.finaldata._paginator) {
      this.finaldata.r;
    }
  }

  getemployee(){
    this.apiService.getEmployees()
    .subscribe((data: any)   => {
      // console.log(data);
      this.employee=data;
      this.finaldata = new MatTableDataSource<Employeetimesheet>(this.employee);
      this.finaldata.paginator = this._paginator;

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



    //1. Fetch the data from API using the id;
    //2. Save the data in the local storage
    //3. Read the data from local storage on init, when you open the shared component, by implementing that there not in this component.


  openeditdialog(id:number) {

    const dialogRef = this.matDialog.open(EmployeeFormComponent,{
      width:'700px',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'100ms',
      data:{id:id}
    });

    dialogRef.afterClosed().subscribe({
      next: val => {
        if(val){
          this.getemployee();
        }
      }
    });
  }

  back(){
    this.location.back()
   }
}


