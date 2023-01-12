import { Component, OnInit } from '@angular/core';

// TEMPORARY
import { Location } from '@angular/common';
import { ResultService } from '../result.service';
import { AbstractControlDirective } from '@angular/forms';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  reserveArr: any = [];

  constructor(
  ) { }

  ngOnInit(): void {
    for (var i=0; i<localStorage.length; i++){
      var ourKey = localStorage.key(i);
      //console.log(localStorage.key(i));
      //console.log(localStorage.getItem(String(ourKey)));
      var ourString = String(localStorage.getItem(String(ourKey)));
      var ourData = ourString.split(",");  // array, e.g. [Spud, 2023-04-23, 12:30, sfw@gmail.com]
      ourData.push(String(ourKey));
      this.reserveArr.push(ourData);
    }
  }

  delete_entry(data:any){
    this.reserveArr.splice(data,1);
    localStorage.removeItem(String(localStorage.key(data)));
    alert("Reservation cancelled!")
  }

}
