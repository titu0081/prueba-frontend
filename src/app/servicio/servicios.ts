import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.baseUrl;

  private jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(private http: HttpClient) {}

  // GET
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, {
      headers: this.jsonHeaders,
    });
  }

  // POST
  post(endpoint: string, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, body, {
      headers: this.jsonHeaders,
    });
  }

  // PUT
  put(endpoint: string, body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}`, body, {
      headers: this.jsonHeaders,
    });
  }

  // DELETE
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}`, {
      headers: this.jsonHeaders,
    });
  }
}
