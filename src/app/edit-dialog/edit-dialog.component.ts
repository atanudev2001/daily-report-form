import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Employeetimesheet } from '../models/emp-ts';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  employee:Employeetimesheet[] | undefined;
  employees = new Employeetimesheet();



  constructor(public apiService:ApiService,public route:ActivatedRoute,public router:Router,private matDialog:MatDialog){}
  ngOnInit(){

  }

  savetask(employees:Employeetimesheet){
    this.apiService.editassignment(employees).subscribe(data =>{
      // this.getemployee();
      this.employees=data;
    });
  }
  canceldialog(){
    this.matDialog.closeAll();
  }
}
