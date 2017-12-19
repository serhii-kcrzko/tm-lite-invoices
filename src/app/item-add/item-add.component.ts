import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import _forEach from 'lodash/forEach';
import _locate from 'lodash/find';
import _reduce from 'lodash/reduce';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {
  public addForm: FormGroup;
  public itemsOptions: any;

  constructor(private _fb: FormBuilder, private db: BackendService, private http: Http) { }

  ngOnInit() {
    this.addForm = this._fb.group({
      article: ['', [Validators.required, Validators.minLength(5)]],
      date: ['', [Validators.required]],
      items: this._fb.array([
        this.initRaw(),
      ])
    });

    this.getRaws();
  }

  initRaw() {
    return this._fb.group({
      raw: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      name: ['']
    });
  }

  addRaw() {
    this.getPrice();
    const control = <FormArray>this.addForm.controls['items'];
    control.push(this.initRaw());
  }

  removeRaw(i: number) {
    this.getPrice();
    const control = <FormArray>this.addForm.controls['items'];
    control.removeAt(i);
  }

  save() {
    this.initializeNames();
    this.updateRawVals();
     this.db.putInvoice(this.addForm.value)
       .subscribe((data) => this.addForm.reset());
  }

  getData() {
    return this.db.getRaws();
  }

  getRaws() {
    this.getData().subscribe(data => {
      this.itemsOptions = data;
    });
  }

  initializeNames(): void {
    _forEach(this.addForm.value.items, i => {
      const id = i.raw.split('-')[0];
      const name = i.raw.split('-')[1];
      i.raw = id;
      i.name = name;
    });
  }

  getPrice() {
    const fullPrice = _reduce(this.addForm.value.items, (sum, item) => {
      return sum + (+item.price * +item.quantity);
    }, 0);

    return fullPrice;
  }

  updateRawVals() {
    _forEach(this.addForm.value.items, item => {
      this.db.getRaw(item.raw).subscribe(data => {
        const dbValue = data.json();
        dbValue.actualPrice = +item.price;
        dbValue.quantity += +item.quantity;

        this.db.updateRaw(dbValue.id, dbValue).subscribe();
      });
    });
  }
}
