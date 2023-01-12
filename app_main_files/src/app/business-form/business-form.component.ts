import { NgModule, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';

import { ResultService } from '../result.service';

@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.css']
})
export class BusinessFormComponent implements OnInit {

  isChecked = false;  // check box is initially unchecked
  selectedKeyword:any = '';
  distanceValue:any = '';
  categoryValue:string = 'Default';
  locationValue:string = '';

  searchKeywordCtrl = new FormControl();
  filteredKeywords: any;

  constructor(
    private http:HttpClient,
    private resultService: ResultService
  ) { }

  ngOnInit() {
    this.searchKeywordCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null
        }),
        distinctUntilChanged(),
        debounceTime(300),
        tap(() => {
          this.filteredKeywords=[];
        }),
        //switchMap(value => this.http.get('http://localhost:3080/api/autocomplete?text='+value))
        switchMap(value => this.http.get('https://csci-homework-8.wl.r.appspot.com/api/autocomplete?text='+value))
      )
      .subscribe((data:any)=>{
        this.filteredKeywords = data;
        console.log(this.filteredKeywords);
      });
  }

  location_auto_detect(){
    this.isChecked = !this.isChecked;
    this.locationValue = '';
    return;
  }

  reset(){
    this.isChecked=false;
    this.selectedKeyword='';
    this.distanceValue='';
    this.categoryValue='Default';
    this.locationValue='';
    this.resultService.clear();
    return;
  }

  onSelected(){
    this.selectedKeyword = this.selectedKeyword;
  }

  async auto_location(){
    var res = await fetch('https://ipinfo.io/json?token=1bb416f5a67c3e');
    var obj = await res.json();
    var arr = obj["loc"].split(',');
    console.log('Auto location coordinates', arr);
    return arr;
  }

  async input_location(){
    //https://csci-homework-8.wl.r.appspot.com
    //var res = await fetch('http://localhost:3080/api/googlelocation?address='+this.locationValue);
    var res = await fetch('https://csci-homework-8.wl.r.appspot.com/api/googlelocation?address='+this.locationValue);
    var obj = await res.json();
    return obj;
  }

  async onSubmit(){
    this.resultService.clear();
    var key = this.selectedKeyword;
    var dist = this.distanceValue;
    if(this.distanceValue==null || this.distanceValue==''){
      dist=parseInt((10*1609.344).toString());
    }else{
      dist=parseInt((parseFloat(this.distanceValue)*1609.344).toString());
      if(dist>40000){
        dist=40000;
      }
    }
    var cat = this.categoryValue;
    if(this.categoryValue==null || this.categoryValue==''){
      cat='Default';
    }
    var lati;
    var lngy;
    var location_arr;
    if(this.isChecked){ // call ipinfo due to location auto detection
      location_arr = await this.auto_location();
      lati = location_arr[0];
      lngy = location_arr[1];
    }else{  // manually inputted location
      location_arr = await this.input_location();
      lati = location_arr[0];
      lngy = location_arr[1];
    }
    console.log('Key: ', key);
    console.log('Location', this.locationValue);
    console.log('Distance(miles): ', dist);
    console.log('Category: ', cat);
    console.log('Latitude: ', lati);
    console.log('Longitude: ', lngy);

    console.log(typeof(location_arr));
    console.log(Object.entries(location_arr).length);

    // now... if result from business search is empty
    // check if valid location is also given, handle this case in an if statement, if location array is empty use line 104
    // when clicking clear, clear all the values reassign to nothing, then when hyou make the backedn call, use rseults to determine whether you display results or not

    var result: any=[];

    if(Object.entries(location_arr).length==0){ // NO RESULTS BECAUSE OF BOGUS LOCATION
      // show now results found
      this.resultService.add(result);
    }else{
      // https://csci-homework-8.wl.r.appspot.com
      //var ret_val = await fetch('http://localhost:3080/api/searchBusiness?term=' + key + '&latitude=' + lati + '&longitude=' + lngy + '&category=' + cat + '&radius=' + dist);
      var ret_val = await fetch('https://csci-homework-8.wl.r.appspot.com/api/searchBusiness?term=' + key + '&latitude=' + lati + '&longitude=' + lngy + '&category=' + cat + '&radius=' + dist);
      var obj_val = await ret_val.json();
      console.log(obj_val);
      console.log(obj_val.length);
      console.log(typeof(obj_val));

      for (var i=0; i<obj_val.length; i++){
        if(i<10){
          obj_val[i].distance = parseInt((obj_val[i].distance/1609.344).toString());
          result.push(obj_val[i]);
          if(i==10){
            break;
          }
        }
      }

      this.resultService.add(result);
    }
    
    return;
  }

}
