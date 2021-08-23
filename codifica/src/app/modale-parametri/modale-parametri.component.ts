import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CodificaDati } from '../_models';

@Component({
  selector: 'app-modale-parametri',
  templateUrl: './modale-parametri.component.html',
  styleUrls: ['./modale-parametri.component.css']
})
export class ModaleParametriComponent implements OnInit {
  @Output()
  closed = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<ModaleParametriComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CodificaDati[]) {}

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  }
}
