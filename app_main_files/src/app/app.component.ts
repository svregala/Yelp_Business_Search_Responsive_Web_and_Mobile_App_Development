import { Component, Injectable } from '@angular/core';
import { ResultService } from './result.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  constructor(
    private result_serve: ResultService
  ){}

  reset_search(){
    this.result_serve.clear();
  }
}
