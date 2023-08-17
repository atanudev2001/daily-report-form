import { ApiService } from './../api.service';
import { Component,  OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Employeetimesheet } from '../models/emp-ts';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
// @Injectable ({ providedIn:'root' })
export class EmployeeFormComponent implements OnInit {
  employee: Employeetimesheet[];
  employees: Employeetimesheet;

  editdata: any;
  finaldata: any;
  // private _paginator: any;

  constructor(
    private builder: FormBuilder,
    private apiService: ApiService,
    // private route: ActivatedRoute,
    private router: Router,
    // public dialog:MatDialog,
    public dialog:MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.employees = new Employeetimesheet();
    this.employee = [];
  }

  taskform = this.builder.group({
    id: this.builder.control({ value: '', disabled: true }),
    employeeName: this.builder.control('', Validators.required),
    taskDate: this.builder.control('', Validators.required),
    assignedTask: this.builder.control('', Validators.required),
    taskDetails: this.builder.control('', Validators.required),
  });


  ngOnInit(): void {
    // this.getemployee();
    if (this.data.id != '' && this.data.id != null) {
      this.apiService.getdata(this.data.id).subscribe((res) => {
        this.editdata = res;
        this.taskform.setValue({
          id: this.editdata.id,
          employeeName: this.editdata.employeeName,
          taskDate: this.editdata.taskDate,
          assignedTask: this.editdata.assignedTask,
          taskDetails: this.editdata.taskDetails,
        });
      });
    }
  }


  create(){
    if (this.taskform.valid) {
      this.apiService.addtask(this.taskform.value).subscribe((data) => {
        alert('Task added successfully');
      });
      this.router.navigate(['showtask']);
    }
    else {
      alert('Form not valid');
    }
  }

  detailsadd() {
    const editid = this.taskform.getRawValue().id;
    if( editid != '' && editid != null) {
      this.apiService.editassignment(editid,this.taskform.getRawValue()).subscribe(res => {
        alert('Updated Successfully');
        this.dialog.close(true);

      });
    }
    else {
      this.create();
    }

  }


  // detailsadd() {
  //   if (this.taskform.valid) {
  //     const editid = this.taskform.getRawValue().id;
  //     if (editid != '' && editid != null) {
  //       this.apiService.editassignment(editid,this.taskform.getRawValue()).subscribe(res => {
  //         alert('Updated Successfully');
  //         this.dialog.closeAll();
  //       });
  //     }
  //     else{
  //       this.apiService.addtask(this.taskform.value).subscribe((data) => {
  //         alert('Task added successfully');
  //       });
  //       this.router.navigate(['showtask']);
  //     }

  //   }
  //   else {
  //     alert('Form not valid');
  //   }
  // }

  cancel(){
    this.dialog.close();
    // localStorage.removeItem('data');
  }
}
