import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { pais, paisSmall } from '../interface/pais.interface';



@Injectable({
  providedIn: 'root'
})


export class PaisesService {
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private url = environment.urlAll;
  private paisesRegion = 'fields=alpha2Code,name';
  private alfa = 'alpha/';

  constructor(private http: HttpClient ) { }
  get regiones(): string[]{
    return [...this._regiones];
  }

  getPaisesRegion( region:string): Observable <paisSmall[]>{
    return this.http.get<paisSmall[]>(`${this.url}region/${region}?${this.paisesRegion}`);
  }

  getPaiseCodigo( codigo: string): Observable<pais | null>{
    if ( !codigo ) {
      return of(null)
    }
    return this.http.get<pais>(`${this.url}${this.alfa}${codigo}`);
  }

  getPaiseCodigoSmall( codigo: string): Observable<paisSmall>{
    return this.http.get<paisSmall>(`${this.url}${this.alfa}${codigo}?${this.paisesRegion}`);
  }

  getPaisesPorCodigos(borders: string[]):Observable<paisSmall[]>{
    if ( !borders ) {
      return of([]);
    }
    const peticiones: Observable<paisSmall> [] = [];
    borders.forEach(codigo => {
      const peticion = this.getPaiseCodigoSmall(codigo);
      peticiones.push(peticion);
    });
    return combineLatest(peticiones);
  }
}