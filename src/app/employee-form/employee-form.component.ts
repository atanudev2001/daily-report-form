import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { Employeetimesheet } from '../models/emp-ts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],

})
export class EmployeeFormComponent implements OnInit {

  employee: Employeetimesheet[];
  employees: Employeetimesheet;


  constructor(private apiService:ApiService,private router: Router) {
    this.employees = new Employeetimesheet();
    this.employee = [];

  }
  ngOnInit(): void {
    this.getemployee();
  }


  getemployee(){
      this.apiService.getEmployees()
      .subscribe(data   => {
        // console.log(data);
        this.employee=data;
    });
  }


  detailsadd(){
    this.apiService.addtask(this.employees).subscribe(data =>{
      // console.log(data);
      this.getemployee();
    });
    this.router.navigate(['showtask']);

  }

}
