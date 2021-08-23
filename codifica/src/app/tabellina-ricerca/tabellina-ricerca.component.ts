import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatRow } from '@angular/material/table';
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
  skip: number = 0;
  numOfRecords: number = 50;
  pageSize: number = 50;
  tableLength ?= 0;

  constructor(private codSvc: CodificaService) { }
  
  ngOnInit(): void {
  }

  ricercaCodifiche() {
    this.stato = 'searching';
    this.codSvc.getByDatiCodifica(this.datiCodifica, this.numOfRecords, this.skip).subscribe(response => {
      console.log(response);
      this.codificheTrovate = response.data;
      this.stato = 'search_done';
      this.tableLength = response.count;
      console.log(this.tableLength);
    },
    error => {
      this.codificheTrovate = [];
      this.stato = 'initial';
    });
  }

  changePage(event: PageEvent) {
    this.skip = event.pageIndex * this.numOfRecords;
    this.ricercaCodifiche();
  }

  showParameters(row: MatRow) {
    
  }
}
