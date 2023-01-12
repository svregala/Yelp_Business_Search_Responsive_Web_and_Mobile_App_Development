import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { Validators } from '@angular/forms';

import { ResultService } from '../result.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DetailsComponent implements OnInit {

  @ViewChild('closebutton') closebutton: any;

  email: any='';
  date: any='';
  hour: any='';
  min: any='';
  resForm!: FormGroup;
  submitAttempt: boolean = false;
  modalAppear = false;

  currentDate:any = new Date();

  constructor(
    public resultService: ResultService,
    private formBuilder: FormBuilder
  ) { 
  }

  ngOnInit(): void {
    this.resForm = this.formBuilder.group({
      emailRes: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]], //Validators.email
      dateRes: [null, [Validators.required]],
      hourRes: [null, [Validators.required]],
      minRes: [null, [Validators.required]]
    });
  }

  get emailInput(){
    return this.resForm.get('emailRes');
  }

  get dateInput(){
    return this.resForm.get('dateRes');
  }

  get hourInput(){
    return this.resForm.get('hourRes');
  }

  get minInput(){
    return this.resForm.get('minRes');
  }

  goBack(): void {
    this.resultService.cleared = !this.resultService.cleared;
    this.resultService.isDetail = !this.resultService.isDetail;
  }

  checkLocalStorage(){
    for(var i=0; i<localStorage.length; i++){
      if(this.resultService.currentID == localStorage.key(i)){
        return true
      } 
    }
    return false
  }

  cancelReservation(){
    localStorage.removeItem(this.resultService.currentID);
    alert("Reservation cancelled!")
  }

  onSubmit(){
    this.submitAttempt = true;
    if(this.resForm.valid){
      alert("Reservation created!");
      this.email = this.emailInput?.value;
      this.date = this.dateInput?.value;
      this.hour = this.hourInput?.value;
      this.min = this.minInput?.value;
      this.resForm.reset();

      console.log('email', this.email);
      console.log('date', this.date);
      console.log('hour', this.hour);
      console.log('min', this.min);

      var wholeString = this.resultService.final_business_detail[6] + "," + this.date + "," + this.hour + ":" + this.min + "," + this.email;
      localStorage.setItem(this.resultService.currentID, wholeString);

      this.closebutton.nativeElement.click();
    }
  }

  onClose(){
    this.resForm.reset();
    this.submitAttempt = false;
  }

}
