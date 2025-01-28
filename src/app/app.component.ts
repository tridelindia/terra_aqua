import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { response } from 'express';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { merge, fromEvent, map, Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
 imports:[RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'tems_v2';
 ngOnInit(): void {
     const status = navigator.onLine;
     console.log("online status",status);
     console.log(window.location.host);

     this.check()
    //  this.setting()
    //  this.getKey()
 }

constructor(private http:HttpClient){}
 check(){
  this.http.get('http://localhost:3000/api/users/reg').subscribe(
    (response)=>{
      console.log(response);
    },
    (error)=>{
      console.log(error);
    }
  )
 }

 setting(){
  const data = {
    "api_key": "12345abcde"
  }
  this.http.post('http://localhost:3000/api/users/validate', data).subscribe(
    (response)=>{
      console.log(response);
    },
    (error)=>{
      console.log(error);
      }
  )
 }

 getKey(){
  this.http.get('http://localhost:3000/api/users/getKey').subscribe(
    (response)=>{
      console.log(response);
      },
      (error)=>{
        console.log(error);
        }
  )
 }

  // constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  // ngOnInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.setZoomLevel();
  //     window.addEventListener("resize", this.setZoomLevel);
  //   }
  // }

  // setZoomLevel(): void {
  //   document.body.style.zoom = `${200 / window.devicePixelRatio}%`;
  // }

 
}
