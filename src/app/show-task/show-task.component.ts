import { ApiService } from './../api.service';
import { Component, OnInit,AfterViewInit,ViewChild, Inject } from '@angular/core';
import { Employeetimesheet } from '../models/emp-ts';
import { Location } from "@angular/common";
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource } from '@angular/material/table';

// import * as alertify from 'alertifyjs'


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
      this.finaldata.r.firstPage();
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


  openeditdialog(id:any){
    this.matDialog.open(EmployeeFormComponent,{
      width:'700px',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'100ms',
      data:{id:id}
    });

  }
  back(){
    this.location.back()
   }
}


