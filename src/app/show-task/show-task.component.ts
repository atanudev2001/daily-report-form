import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { Employeetimesheet } from '../models/emp-ts';
import { Location } from "@angular/common";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrls: ['./show-task.component.css']
})
export class ShowTaskComponent implements OnInit {

constructor(private apiService:ApiService,private location: Location,private matDialog:MatDialog) {}
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
      console.log(data);
      this.getemployee();
    });
  }

  openeditdialog(){
    this.matDialog.open(EditDialogComponent)
  }
  back(){
    this.location.back()
   }
}
