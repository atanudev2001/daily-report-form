import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Employeetimesheet } from '../app/models/emp-ts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:3000/';


  constructor(private http: HttpClient) { }

  getEmployees():Observable<Employeetimesheet[]> {
    return this.http.get<Employeetimesheet[]>(this.url + 'employeetimesheet');
  }

  addtask(employeetimesheet:Employeetimesheet):Observable<any>{
    const headers = { 'content-type': 'application/json'}
    const data=JSON.stringify(employeetimesheet);
    // console.log(employeetimesheet);
    return this.http.post(this.url + 'employeetimesheet', data,{'headers':headers})
  }

  deleteassignment(employeetimesheet:Employeetimesheet):Observable<Employeetimesheet> {
    return this.http.delete<Employeetimesheet>(this.url+ 'employeetimesheet' +'/'+ employeetimesheet.id);
  }

  editassignment(employeetimesheet:Employeetimesheet){
  }
}
