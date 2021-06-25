import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schemi-codifica-form',
  templateUrl: './schemi-codifica-form.component.html',
  styleUrls: ['./schemi-codifica-form.component.css']
})
export class SchemiCodificaFormComponent implements OnInit {
  header: string = '';
  selectedSchemaType: string = '';
  schemaTypeControl: FormControl = new FormControl('P');
  schemiCodificaForm: FormGroup;
  currentSection: number = 1;

  constructor(private route: ActivatedRoute, fb: FormBuilder) {
    this.schemiCodificaForm = fb.group({ schemaTypeControl: this.schemaTypeControl, });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const { id } = params; // uguale a const id = params.id
      this.header = id ? 'Modifica Schema: ' + id : 'Nuovo Schema';
    });
  }

  nextSection() {
    this.currentSection += 1;
  }

  lastSection() {
    this.currentSection -= 1;
  }
}
