import { is } from '@amcharts/amcharts4/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckIcon } from 'primeng/icons/check';
import { Observable } from 'rxjs';
 
interface DeviceIds{
  biosSerial: string
computerName:string
diskSerial: string
macAddress: string
osArchitecture: string
osName: string
processorId: string
sid: string
userName:string
}
 
@Component({
  selector: 'app-installation',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './installation.component.html',
  styleUrl: './installation.component.css'
})
export class InstallationComponent {
  currentStep = 0; // Track the current step
  deviceID!:string;
 
  ApiKey!:string;
  isWaiting:boolean = false;
  isRotate:boolean = false;
  // Navigate to the next step
  constructor(private http:HttpClient,
    private route:Router
  ){}
 
  getInfo(): Observable<DeviceIds> {
    return this.http.get<DeviceIds>('http://localhost:3000/api/users/reg');
  }
 
  Rotate() {
    this.isRotate = true;
 
    this.getInfo().subscribe(
      (deviceDetails: DeviceIds) => {
        this.device = deviceDetails;
 
        // Validate if the device has values
        if (this.device && Object.keys(this.device).length > 0) {
          //console.log('Device has values:', this.device);
          const data = {
            bios_serial : this.device.biosSerial,
            s_id: this.device.sid
          }
          this.http.post('http://trideltechnologiesindia.com:3200/api/get/validation', data).subscribe(
            (response: any) => {
              //console.log("full response", response);
              //console.log('Response:', response.api_key);
              this.setting(response.api_key);
              if(response['message'] === 'Success'){
                alert(`you have a valid license \n click "ok" to continue`);
                this.route.navigate(['/login']);
              }
              else{
                alert(`you dont have a valid license \n click "ok" to continue`);
                this.nextStep()
              }
             
             
            },
            (error: any) => {
              //console.error('Error:', error);
              }
 
          );
        } else {
          //console.log('Device is null or empty');
        }
      },
      (error) => {
        //console.error('Error fetching device info:', error);
      }
    );
  }
 
  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
      //console.log(this.currentStep);
    }
    if(this.currentStep == 2){
      this.check()
    }
  }
 
  // Navigate to the previous step
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
 
  // Handle the installation step
  install() {
    // alert('Installation in progress...');
   
    const data = {
      projectName: "TERRA-AQUA",
      client: "CWPRS Pune",
      bios_serial: this.device.biosSerial,
      computerName: this.device.computerName,
      diskSerial: this.device.diskSerial,
      macAddress: this.device.macAddress,
      osArchitecture: this.device.osArchitecture,
      osName: this.device.osName,
      proccessorId: this.device.processorId,
      sID: this.device.sid,
      userName: this.device.userName,
      status: "inactive",
      apiKey: this.ApiKey
  }
 
 
  this.http.post('http://trideltechnologiesindia.com:3200/api/add/deployement', data).subscribe(
    (response:any) => {
      //console.log(response[1].id);
      this.addNotify(response[1]);
      this.isWaiting = !this.isWaiting;
      //console.log("apikey",this.ApiKey);
      setInterval(() => {
        this.chechStatus(response[1].id, this.ApiKey);
      }, 2000);
    },
    (error) => {
      //console.error(error);
      }
  )
   
  }
 
  async chechStatus(id: number, api:string) {
    //console.log("apiKey===", api)
    const data = {
      id: id,
    };
 
    try {
      const response: any = await this.http.get(`http://trideltechnologiesindia.com:3200/api/check/status/${id}/status`).toPromise();
      //console.log(response);
 
      if (response['status'] === 'active') {
        //console.log(true);
 
        await this.Rotate(); // Use await here
        this.route.navigate(['/login']);
      }
    } catch (error) {
      //console.error(error);
    }
  }
 
 
  addNotify(data:any){
    this.http.post('http://trideltechnologiesindia.com:3200/api/add/notification', data).subscribe(
      (response:any) => {
        //console.log(response);
        },
        (error) => {
          //console.error(error);
          }
          )
 
  }
 
 
device!:DeviceIds;
  check(){
    this.http.get('http://localhost:3000/api/users/reg').subscribe(
      (response:any)=>{
        //console.log(response);
      const  DeviceDetais: DeviceIds = response;
      this.device = DeviceDetais;
      this.deviceID = DeviceDetais.userName;
      this.ApiKey = this.generateLicenseKey();
      },
      (error)=>{
        //console.log(error);
      }
    )
   }
 
  // Handle the finish step
  finish() {
    alert('Installation complete. Thank you!');
  }
 
 
  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
 
  // Function to generate the Microsoft Office-style license key
  generateLicenseKey(): string {
    let licenseKey = '';
    for (let i = 0; i < 5; i++) {
      if (i > 0) {
        licenseKey += '-';
      }
      licenseKey += this.generateRandomString(5);  // Generate 5 characters for each block
    }
    return licenseKey;
  }
 
 
 
  setting(apiKeyy: string) {
    const data = {
        apiKey: apiKeyy
    };
    //console.log("Sending data to API:", data);
 
    const headers = { 'Content-Type': 'application/json' };
 
    this.http.post('http://localhost:3000/api/users/validate', data, { headers }).subscribe(
        (response: any) => {
            //console.log("API response:", response);
            if (response.status === 'success') {
                //console.log("API key saved successfully:", response);
            } else {
                //console.log("Error in API response:", response);
            }
        },
        (error) => {
            //console.error("Error from API:", error);
        }
    );
}
 
}
 
 