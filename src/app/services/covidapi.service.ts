import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CovidapiService {
  private countriesUrl = 'https://covid-api.com/api/regions?per_page=300&order=iso&sort=asc';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get(this.countriesUrl)
  }

  getSingleCountry(iso: string, date?: string): Observable<any> {
    let url = `https://covid-api.com/api/reports/total?iso=${iso}`;
    if (date) {
      url += `&date=${date}`;
    }
    return this.http.get(url);
  }

  getProvincesFromCountry(iso: string, date?:string): Observable<any> {
    let url = `https://covid-api.com/api/provinces/${iso}?per_page=100`;
    if (date) {
      url += `&date=${date}`;
    }
    console.log(this.http.get(url))
    return this.http.get(url);
  }
}
