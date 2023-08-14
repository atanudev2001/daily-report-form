import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Employeetimesheet } from '../app/models/emp-ts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:3000/employeetimesheet';

  constructor(private http: HttpClient) { }

  getEmployees():Observable<Employeetimesheet[]> {
    return this.http.get<Employeetimesheet[]>(this.url);
  }

  addtask(employeetimesheet:any):Observable<any>{
    const headers = { 'content-type': 'application/json'}
    const data=JSON.stringify(employeetimesheet);
    // console.log(employeetimesheet);
    return this.http.post(this.url , data,{'headers':headers})
  }

  deleteassignment(employeetimesheet:Employeetimesheet):Observable<Employeetimesheet> {
    return this.http.delete<Employeetimesheet>(this.url +'/'+ employeetimesheet.id);
  }

  getdata(id:any):Observable<Employeetimesheet>{
    return this.http.get<Employeetimesheet>(this.url  +'/'+ id);
  }

  editassignment(id:any,employeetimesheet:any) {
    // const headers = { 'content-type': 'application/json'}
    // const data=JSON.stringify(employeetimesheet);
    return this.http.put(this.url+'/'+id,employeetimesheet );
  }
}
