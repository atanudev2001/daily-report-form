import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowTaskComponent } from './show-task/show-task.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

const routes: Routes = [
  {path: '', component: EmployeeFormComponent},
  { path: 'showtask', component:ShowTaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() { }

}
