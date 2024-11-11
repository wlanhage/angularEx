import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CovidapiService {
  private countriesUrl = 'https://covid-api.com/api/regions?per_page=300&order=name&sort=asc';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get(this.countriesUrl)
  }

  getProvincesData(): Observable<any> {
    let url = `https://covid-api.com/api/reports`;
    return this.http.get(url);
  }

  getSingleCountry(iso: string): Observable<any> {
    let url = `https://covid-api.com/api/reports/total?iso=${iso}`;
    return this.http.get(url);
  }

  getSingleCountryWithDate(iso: string, date:string): Observable<any> {
    let url = `https://covid-api.com/api/reports/total?iso=${iso}&date=${date}`
    return this.http.get(url);
  }

  getProvincesFromCountry(iso: string): Observable<any> {
    let url = `https://covid-api.com/api/provinces/${iso}?per_page=100`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response.data.filter((province: any) => province.province && province.province.trim() !== '');
      })
    );
  }
}
