import { NgModule, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ResultService } from '../result.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(
    public resultService: ResultService
  ) { }

  ngOnInit(): void {
  }

  async getDetails(i:any){
    this.resultService.final_business_detail = [];
    var obj_id = this.resultService.detailsID[i];
    //var ret_val = await fetch('http://localhost:3080/api/details?id='+obj_id);
    var ret_val = await fetch('https://csci-homework-8.wl.r.appspot.com/api/details?id='+obj_id);
    var result = await ret_val.json();
    var final_res = result;
    console.log('Business detail',final_res);
    this.resultService.business_detail=final_res;
    this.resultService.currentID = obj_id;
    this.resultService.createDetail();

    this.resultService.cleared=!this.resultService.cleared;
    this.resultService.isDetail=!this.resultService.isDetail;
  }

}
