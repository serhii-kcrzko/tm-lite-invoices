import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { BackendService } from '../backend.service';
import _map from 'lodash/map';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  data: any = [];

  constructor(private http: Http, private db: BackendService) { }

  getData() {
    return this.db.getInvoices();
  }

  getProducts() {
    this.getData().subscribe(data => {
      this.data = data;
    });
  }

  ngOnInit() {
    this.getProducts();
    this.getData();
  }

  calculatePrice(items) {
    let sum = 0;
    _map(items, item => sum += +item.price);
    return sum;
  }

}
