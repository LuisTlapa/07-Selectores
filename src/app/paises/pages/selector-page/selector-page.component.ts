import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { paisSmall } from '../../interface/pais.interface';
import { PaisesService } from '../../service/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region:['',Validators.required, ],
    pais:['',Validators.required],
    frontera:['',Validators.required]
  });

  // llenar selectores
  regiones: string [] = [];
  paises: paisSmall [] = [];
  //fronteras: any[] =[];
  fronteras:paisSmall[] = [];
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService   
    ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    /*this.miFormulario.get('region')?.valueChanges.subscribe(region => {
      console.log(region)
      this.paisesService.getPaisesRegion(region).subscribe(paises =>{
        console.log(paises)
        this.paises = paises
      })
    })*/ // Refactor

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( (_) =>{
        this.miFormulario.get('pais')?.reset('')
        this.cargando = true
      }),
      switchMap(region => this.paisesService.getPaisesRegion(region) )
    )
    .subscribe( valor => {
      this.paises = valor;
      this.cargando = false
    })

    // cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( (_) =>{
        this.miFormulario.get('frontera')?.reset('')
        this.cargando = true;
      }),
      switchMap(codigo => this.paisesService.getPaiseCodigo(codigo)),
      switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
    )
    .subscribe( valor => {
      this.fronteras = valor
      this.cargando = false;
    })
  }

  guardar(){
    console.log(this.miFormulario.value);
  }
}
