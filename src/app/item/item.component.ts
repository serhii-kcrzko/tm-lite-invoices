import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import _reduce from 'lodash/reduce';
import { BackendService } from '../backend.service';

import * as moment from 'moment';
import 'moment/locale/uk';
moment.locale('uk');

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  id: string;
  product: any;
  options: any;

  constructor(private route: ActivatedRoute, private db: BackendService, private location: Location) {
    route.params.subscribe(params => { this.id = params['id']; });
  }

  ngOnInit(): void {
    this.db
      .getInvoice(this.id)
      .subscribe((res: any) => {
        this.renderProduct(res);
      });
  }

  back(): void {
    this.location.back();
  }

  renderProduct(res: any): void {
    this.product = res;
  }

  parseDate(date: string): string {
    const parsedDate = moment(date);
    return parsedDate.format('D MMMM YYYY, hh:mm:ss');
  }

  getPrice() {
    const totalPrice = _reduce(this.product.items, (sum, item) => {
      return sum + (+item.price * +item.quantity);
    }, 0);
    return totalPrice;
  }

}
