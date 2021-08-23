import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatRow } from '@angular/material/table';
import { ModaleParametriComponent } from '../modale-parametri/modale-parametri.component';
import { Codifica, IHash, SchemaCodifica } from '../_models';
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
  selectedCodifica: Codifica = {ID_CODIFICA: 0, DESCRIZIONE: '', ID_SCHEMA: 0, CODICE: ''};
  modaleVisibile: boolean = false;

  constructor(private codSvc: CodificaService, public dialog: MatDialog) { }
  
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
    if (this.selectedCodifica.ID_CODIFICA !== (row as Codifica).ID_CODIFICA) {
      console.log(row);
      this.codSvc.getParametersByIdCodifica((row as Codifica).ID_CODIFICA || 1).subscribe(response => {
        (row as Codifica).DATI = response.data;
        this.selectedCodifica = row as Codifica;
        const dialogRef = this.dialog.open(ModaleParametriComponent, {
          width: '400px',
          data: response.data
        });
      },
      error => {
      });
    }
    else {
      const dialogRef = this.dialog.open(ModaleParametriComponent, {
        width: '400px',
        data: this.selectedCodifica.DATI
      });
    }
  }
  closeModale() {
    this.modaleVisibile = false;
  }
}
