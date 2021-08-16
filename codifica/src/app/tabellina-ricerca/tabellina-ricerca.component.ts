import { Component, Input, OnInit } from '@angular/core';
import { Codifica, IHash } from '../_models';
import { CodificaService } from '../_services/codifica.service';

@Component({
  selector: 'app-tabellina-ricerca',
  templateUrl: './tabellina-ricerca.component.html',
  styleUrls: ['./tabellina-ricerca.component.css']
})
export class TabellinaRicercaComponent implements OnInit {

  @Input()
  searchEnabled = true;

  @Input()
  datiCodifica: IHash[] = []; // Contiene tutti i parametri di tutti i sottoschemi

  codificheTrovate: Codifica[] = [];
  stato: 'initial' | 'searching' | 'search_done' = 'initial';

  constructor(private codSvc: CodificaService) { }
  
  ngOnInit(): void {
  }

  ricercaCodifiche() {
    this.stato = 'searching';
    this.codSvc.getByDatiCodifica(this.datiCodifica).subscribe(response => {
      console.log(response);
      this.codificheTrovate = response.data;
      this.stato = 'search_done';
    },
    error => {
      this.codificheTrovate = [];
      this.stato = 'initial';
    });
  }

}
