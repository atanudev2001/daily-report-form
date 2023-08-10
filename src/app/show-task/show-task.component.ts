import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { Employeetimesheet } from '../models/emp-ts';
import { Location } from "@angular/common";

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrls: ['./show-task.component.css']
})
export class ShowTaskComponent implements OnInit {

  // location: any;



constructor(private apiService:ApiService,private location: Location) {}
  ngOnInit(): void {
    this.getemployee()
  }

employee:Employeetimesheet[] | undefined;
employees = new Employeetimesheet();
  getemployee(){
    this.apiService.getEmployees()
    .subscribe((data: any)   => {
      // console.log(data);
      this.employee=data;
  });
  }
  deletetask(employees:Employeetimesheet){
    alert("Do you want to delete the task?")
    this.apiService.deleteassignment(employees).subscribe(data =>{
      // console.log(data);
      this.getemployee();
    });
  }
  // edittask(employees:Employeetimesheet){
  //   this.apiService.editassignment(employees).subscribe(data =>{
  //     this.getemployee();
  //   });
  // }

  back(){
    this.location.back()
   }
}
