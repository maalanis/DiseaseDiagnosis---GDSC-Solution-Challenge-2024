// disease-info.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiseaseInfoService {

  private apiUrl = 'http://localhost:3000/api/disease-info';
  constructor(private http: HttpClient) { }

  getDiseaseInfo(diseaseName: string): Observable<any> {
    // This will now be proxied to `http://localhost:3000/api/disease-info`
    return this.http.post('/api/disease-info', { diseaseName });
  }

}
