import { Injectable } from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  results: any=[];
  cleared = true;
  isDetail = false;

  detailsID: any=[];// ID DETAILS
  business_detail: any=[];
  currentID:any='';
  final_business_detail: any=[];

  detReviews:any=[];

  constructor() { }

  add(result: any){
    this.results = result;
    this.cleared = false;
    // create array of ids, will be accessed using index
    for (var i=0; i<result.length;i++){
      this.detailsID.push(this.results[i].id);
    }
    console.log('IDs:',this.detailsID);
  }

  async createDetail(){

    this.detReviews=[];
    this.final_business_detail = [];
    
    // Display address
    if(this.business_detail.hasOwnProperty("location")){
      if(!this.business_detail.location.display_address.length){
        this.final_business_detail.push({'addr':"N/A"})
      }else{
        var temp_string='';
        var temp_len = this.business_detail.location.display_address.length;
        for(var i=0; i<temp_len; i++){
          if(i==temp_len-1){
            temp_string += this.business_detail.location.display_address[i];
          }else{
            temp_string += this.business_detail.location.display_address[i] + ' ';
          }
        }
        this.final_business_detail.push({'addr':temp_string});
      }
    }else{
      this.final_business_detail.push({'addr':"N/A"});
    }

    // Category
    if(this.business_detail.hasOwnProperty("categories")){
      if(!this.business_detail.categories.length){
        this.final_business_detail.push({'cat':"N/A"});
      }else{
        var temp_len = this.business_detail.categories.length;
        var temp_string = '';
        for(var i=0; i<temp_len; i++){
          if(i==temp_len-1){
            temp_string += this.business_detail.categories[i].title;
          }else{
            temp_string += this.business_detail.categories[i].title + ' | ';
          }
        }
        this.final_business_detail.push({'cat':temp_string});
      }
    }else{
      this.final_business_detail.push({'cat':"N/A"});
    }

    // Phone
    if(this.business_detail.hasOwnProperty("display_phone")){
      if(!this.business_detail.display_phone.length){
        this.final_business_detail.push({'phone':"N/A"});
      }else{
        this.final_business_detail.push({'phone':this.business_detail.display_phone});
      }
    }else{
      this.final_business_detail.push({'phone':"N/A"});
    }

    // Price rating
    if(this.business_detail.hasOwnProperty("price")){
      if(!this.business_detail.price.length){
        this.final_business_detail.push({'price':"N/A"});
      }else{
        this.final_business_detail.push({'price':this.business_detail.price});
      }
    }else{
      this.final_business_detail.push({'price':"N/A"});
    }

    // Status
    if(this.business_detail.hasOwnProperty("hours")){
      if(!this.business_detail.hours[0].is_open_now){
        this.final_business_detail.push({'status':false});
      }else{
        this.final_business_detail.push({'status':true});
      }
    }else{
      this.final_business_detail.push({'status':"N/A"});
    }

    // URL
    if(this.business_detail.hasOwnProperty("url")){
      if(!this.business_detail.url.length){
        this.final_business_detail.push({'url':"N/A"});
      }else{
        this.final_business_detail.push({'url':this.business_detail.url});
      }
    }else{
      this.final_business_detail.push({'url':"N/A"});
    }

    // Name
    this.final_business_detail.push(this.business_detail.name); // 6

    // Photos, 7
    if(this.business_detail.hasOwnProperty("photos")){
      this.final_business_detail.push(this.business_detail.photos);
    }else{
      this.final_business_detail.push("N/A");
    }

    // Coordinates, 8
    if(!this.business_detail.hasOwnProperty("coordinates")){
      this.final_business_detail.push("N/A");
    }else{
      this.final_business_detail.push(this.business_detail.coordinates);
    }

    console.log('final business detail: ', this.final_business_detail);
    console.log('picture array', this.final_business_detail[7]);
    console.log('coordinates', this.final_business_detail[8]);

    // Call REVIEWS yelp API https://csci-homework-8.wl.r.appspot.com
    //var rev = await fetch('http://localhost:3080/api/reviews?id='+this.currentID);
    var rev = await fetch('https://csci-homework-8.wl.r.appspot.com/api/reviews?id='+this.currentID);
    var obj = await rev.json();
    console.log(obj);
    this.processReviews(obj);
  }

  processReviews(data:any){
    console.log('reviews data:', data.length);
    for(var i=0; i<data.length;i++){
      var temp_review = [];
      temp_review.push(data[i].user.name);  // Name 0
      temp_review.push(data[i].rating); // Rating 1
      temp_review.push(data[i].text); // Reviews 2
      var date_created = data[i].time_created.split(' ');
      temp_review.push(date_created[0]); // Date created 3
      this.detReviews.push(temp_review);
    }
    console.log('Reviews array:', this.detReviews);
  }

  clear() {
    this.results = [];
    this.cleared = true;
    this.detailsID = [];
    this.business_detail = [];
    this.isDetail = false;
    this.final_business_detail = [];
    this.currentID = '';
    this.detReviews = [];
  }

}
