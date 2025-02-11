import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { ConfigDataService } from '../config-data.service';
import { SensorData, SensorData2 } from '../../model/config.model';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health.component.html',
  styleUrl: './health.component.css',
  providers:[DatePipe]
})
export class HealthComponent {
  is48format: boolean = true;
  sensorStatus = [
    { name: 'Tide', status: 'Progress', time: "14:13", date: "21/10/2024", file:'tide'},
    { name: 'Current', status: 'Recieved' , time: "14:23", date: "21/10/2024", file:'Current-Low'},
   
    { name: 'Battery', status: 'Recieved' , time:"14:23", date: "21/10/2024", file:'Battery'},
  ];
  sensorDatelist: SensorData[] = []; // Holds fetched sensor data
tapped(){
  this.is48format = !this.is48format;
   this.fetchSensorData();
}
  ngOnInit(): void {
    setInterval(() => {
      this.fetchSensorData();
    }, 3000);
    
  }
constructor(private layout:LayoutComponent, private data:ConfigDataService, private datePipe: DatePipe){}
  fetchSensorData(): void {
    const date = new Date();
    const todayDate = date.toISOString().substr(0, 10);
     this.data.getSensorLiveData(todayDate, todayDate).subscribe(datat => {
      
      if (this.layout.selectedBuoy === 'CWPRS01') {
        if(datat.buoy1.length <3 ){
          this.sensorDatelist = this.dummyData1;
        }else{
          this.sensorDatelist = datat.buoy1;
        }
        
      } else if (this.layout.selectedBuoy === 'CWPRS02') {
        if(datat.buoy2.length <3 ){
          this.sensorDatelist = this.dummyData2;
        }else{
          this.sensorDatelist = datat.buoy2;
        }
        // this.sensorDatelist = datat.buoy2;
      }

      // Call update function after data is fetched
      this.updateSensorStatus(this.sensorDatelist);
     });
  }

  updateSensorStatus(data: SensorData[]): void {
    if (data.length === 0) return; // Return if no data

    const firstRow = data[0];
     
    //console.log("profile5",firstRow.profile5);

    // Check if all required data is available for each sensor in the first row
    const tideReceived = firstRow.S1_RelativeWaterLevel !== null;
    const currentReceived = firstRow.Lower_CurrentSpeedDirection !== null &&
                            firstRow.Middle_CurrentSpeedDirection !== null &&
                            firstRow.S2_SurfaceCurrentSpeedDirection !== null &&
                            firstRow.profile4 !== null&&
                            firstRow.profile5 !== null&&
                            firstRow.profile6 !== null&&
                            firstRow.profile7 !== null&&
                            firstRow.profile8 !== null&&
                            firstRow.profile9 !== null&&
                            firstRow.profile10 !== null &&
                            firstRow.profile11 !== null &&
                            firstRow.profile12 !== null &&
                            firstRow.profile13 !== null &&
                            firstRow.profile14 !== null &&
                            firstRow.profile15 !== null &&
                            firstRow.profile16 !== null &&
                            firstRow.profile17 !== null &&
                            firstRow.profile18 !== null &&
                            firstRow.profile19 !== null &&
                            firstRow.profile20 !== null &&
                            firstRow.profile21 !== null &&
                            firstRow.profile22 !== null &&
                            firstRow.profile23 !== null &&
                            firstRow.profile24 !== null &&
                            firstRow.profile25 !== null &&
                            firstRow.profile26 !== null &&
                            firstRow.profile27 !== null &&
                            firstRow.profile28 !== null &&
                            firstRow.profile29 !== null &&
                            firstRow.profile30 !== null &&
                            firstRow.profile31 !== null &&
                            firstRow.profile32 !== null &&
                            firstRow.profile33 !== null &&
                            firstRow.profile34 !== null &&
                            firstRow.profile35 !== null &&
                            firstRow.profile36 !== null &&
                            firstRow.profile37 !== null &&
                            firstRow.profile38 !== null &&
                            firstRow.profile39 !== null &&
                            firstRow.profile40 !== null ;

    const batteryReceived = firstRow.Battery_Voltage!== null;
    //console.log("curremnt", currentReceived)
    // Update the status and date/time based on data availability
    this.sensorStatus[0].status = tideReceived ? "Recieved" : "Progress";
    this.sensorStatus[1].status = currentReceived ? "Recieved" : "Progress";
    this.sensorStatus[2].status = batteryReceived ? "Recieved" : "Progress";


    if(tideReceived){
      
      this.sensorStatus[0].date = this.formatDate(this.sensorDatelist[0].Date);
      this.sensorStatus[0].time = this.formatTime(this.sensorDatelist[0].Time);
    }else{
      this.sensorStatus[0].date = this.formatDate(this.sensorDatelist[1].Date);
      this.sensorStatus[0].time = this.formatTime(this.sensorDatelist[1].Time);
    }

    if(currentReceived){
      this.sensorStatus[1].date = this.formatDate(this.sensorDatelist[0].Date);
      this.sensorStatus[1].time = this.formatTime(this.sensorDatelist[0].Time);
    }else{
      this.sensorStatus[1].date = this.formatDate(this.sensorDatelist[1].Date);
      this.sensorStatus[1].time = this.formatTime(this.sensorDatelist[1].Time);
    }

    if(batteryReceived){
      this.sensorStatus[2].date = this.formatDate(this.sensorDatelist[0].Date);
      this.sensorStatus[2].time = this.formatTime(this.sensorDatelist[0].Time);
    }else{
      this.sensorStatus[2].date = this.formatDate(this.sensorDatelist[1].Date);
      this.sensorStatus[2].time = this.formatTime(this.sensorDatelist[1].Time);
    }

    // if (tideReceived && currentReceived && batteryReceived) {
      
    //   // If all data is received, set the date and time to the current row
    //   this.sensorStatus.forEach(sensor => {
    //     sensor.date = date;
    //     sensor.time = time;
    //   });
    // } else {
    //   // If any data is missing, set date and time to last valid date/time
      
    //     this.sensorStatus[0].date = date;
    //     this.sensorStatus[0].time = time;
      
    // }
  }

  formatDate(date:string):string{
    const d = date;
    const dd = new Date(d);
    const datee = dd.toISOString().substr(0,10);
    return datee;
  }

  formatTime(time: string): string {
    // Split the time string into hours and minutes
    const [hoursString, minutesString] = time.split(':');
    const hours = parseInt(hoursString, 10);
    const minutes = parseInt(minutesString, 10).toString().padStart(2, '0');
    const mm = parseFloat(minutes);
  
    if (isNaN(hours) || isNaN(mm)) {
      return 'Invalid Time';
    }
  
    if (this.is48format) {
      const tt = new Date(time);
      const timee = tt.toISOString().substr(11,8);
       // 24-hour format: Return as HH:MM
      return timee;
    } else {
      const ttt = new Date(time);
      const timeee = ttt.toISOString().substr(11, 8);
      const [hours, minutes, seconds] = timeee.split(':').map(Number);
    const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
    const dtt =this.datePipe.transform(date, 'hh:mm a', 'UTC');

      return dtt!.toString();
    }
  }
  





  dummyData1:SensorData[]=[
    {
      "Battery_Voltage": "12.4",
      "Date": "2025-01-08T00:00:00.000Z",
      "GPS_Date": "1970-01-01T00:00:00.000Z",
      "LAT": 19.01,
      "LONG": 72.7,
      "Lower_CurrentSpeedDirection": "0.32;254.7",
      "Middle_CurrentSpeedDirection": "0.71;249.3",
      "S1_RelativeWaterLevel": '2.37',
      "S2_SurfaceCurrentSpeedDirection":"0.69;221.6",
      "StationID":"CWPRS01",
      "Time":"1970-01-01T09:30:00.000Z",
      "UTC_Time":"1970-01-01T06:00:00.000Z",
      // "dateTime": "2025-01-08T05:06:54.943Z",
      "id":103,
      "profile4": "23.4;233.9",
      "profile5": "53.2;234.9",
      "profile6": "21.3;321.9",
      "profile7": "43.2;233.0",
      "profile8": "11.3;343.2",
      "profile9": "32.2;244.3",
      "profile10": "12.3;123.3",
      "profile11": "23.3;234.3",
      "profile12": "34.3;345.3",
      "profile13": "45.3;456.3",
      "profile14": "56.3;567.3",
      "profile15": "67.3;678.3",
      "profile16": "78.3;789.3",
      "profile17": "89.3;890.3",
      "profile18": "90.3;901.3",
      "profile19": "91.3;912.3",
      "profile20": "92.3;923.3",
      "profile21": "93.3;934.3",
      "profile22": "94.3;945.3",
      "profile23": "95.3;956.3",
      "profile24": "96.3;967.3",
      "profile25": "97.3;978.3",
      "profile26": "98.3;989.3",
      "profile27": "99.3;990.3",
      "profile28": "100.3;991.3",
      "profile29": "101.3;992.3",
      "profile30": "102.3;993.3",
      "profile31": "103.3;994.3",
      "profile32": "104.3;995.3",
      "profile33": "105.3;996.3",
      "profile34": "106.3;997.3",
      "profile35": "107.3;998.3",
      "profile36": "108.3;999.3",
      "profile37": "109.3;1000.3",
      "profile38": "110.3;1001.3",
      "profile39": "111.3;1002.3",
      "profile40": "112.3;1003.3",

    },
    {
      "Battery_Voltage": "12.4",
      "Date": "2025-01-08T00:00:00.000Z",
      "GPS_Date": "1970-01-01T00:00:00.000Z",
      "LAT": 19.01,
      "LONG": 72.7,
      "Lower_CurrentSpeedDirection": "0.32;254.7",
      "Middle_CurrentSpeedDirection": "0.71;249.3",
      "S1_RelativeWaterLevel": '2.37',
      "S2_SurfaceCurrentSpeedDirection":"0.69;221.6",
      "StationID":"CWPRS01",
      "Time":"1970-01-01T09:20:00.000Z",
      "UTC_Time":"1970-01-01T06:00:00.000Z",
      // "dateTime": "2025-01-08T05:06:54.943Z",
      "id":102,
      "profile4": "23.4;233.9",
      "profile5": "53.2;234.9",
      "profile6": "21.3;321.9",
      "profile7": "43.2;233.0",
      "profile8": "11.3;343.2",
      "profile9": "32.2;244.3",
      "profile10": "12.3;123.3",
      "profile11": "13.3;134.3",
      "profile12": "14.3;145.3",
      "profile13": "15.3;156.3",
      "profile14": "16.3;167.3",
      "profile15": "17.3;178.3",
      "profile16": "18.3;189.3",
      "profile17": "19.3;190.3",
      "profile18": "20.3;191.3",
      "profile19": "21.3;192.3",
      "profile20": "22.3;193.3",
      "profile21": "23.3;194.3",
      "profile22": "24.3;195.3",
      "profile23": "25.3;196.3",
      "profile24": "26.3;197.3",
      "profile25": "27.3;198.3",
      "profile26": "28.3;199.3",
      "profile27": "29.3;200.3",
      "profile28": "30.3;201.3",
      "profile29": "31.3;202.3",
      "profile30": "32.3;203.3",
      "profile31": "33.3;204.3",
      "profile32": "34.3;205.3",
      "profile33": "35.3;206.3",
      "profile34": "36.3;207.3",
      "profile35": "37.3;208.3",
      "profile36": "38.3;209.3",
      "profile37": "39.3;210.3",
      "profile38": "40.3;211.3",
      "profile39": "41.3;212.3",
      "profile40": "42.3;213.3",
    },
    {
      "Battery_Voltage": "12.4",
      "Date": "2025-01-08T00:00:00.000Z",
      "GPS_Date": "1970-01-01T00:00:00.000Z",
      "LAT": 19.01,
      "LONG": 72.7,
      "Lower_CurrentSpeedDirection": "0.32;254.7",
      "Middle_CurrentSpeedDirection": "0.71;249.3",
      "S1_RelativeWaterLevel": '2.37',
      "S2_SurfaceCurrentSpeedDirection":"0.69;221.6",
      "StationID":"CWPRS01",
      "Time":"1970-01-01T09:10:00.000Z",
      "UTC_Time":"1970-01-01T06:00:00.000Z",
      // "dateTime": "2025-01-08T05:06:54.943Z",
      "id":101,
      "profile4": "23.4;233.9",
      "profile5": "53.2;234.9",
      "profile6": "21.3;321.9",
      "profile7": "43.2;233.0",
      "profile8": "11.3;343.2",
      "profile9": "32.2;244.3",
      "profile10": "12.3;123.3",
      "profile11": "13.3;134.3",
      "profile12": "14.3;145.3",
      "profile13": "15.3;156.3",
      "profile14": "16.3;167.3",
      "profile15": "17.3;178.3",
      "profile16": "18.3;189.3",
      "profile17": "19.3;190.3",
      "profile18": "20.3;191.3",
      "profile19": "21.3;192.3",
      "profile20": "22.3;193.3",
      "profile21": "23.3;194.3",
      "profile22": "24.3;195.3",
      "profile23": "25.3;196.3",
      "profile24": "26.3;197.3",
      "profile25": "27.3;198.3",
      "profile26": "28.3;199.3",
      "profile27": "29.3;200.3",
      "profile28": "30.3;201.3",
      "profile29": "31.3;202.3",
      "profile30": "32.3;203.3",
      "profile31": "33.3;204.3",
      "profile32": "34.3;205.3",
      "profile33": "35.3;206.3",
      "profile34": "36.3;207.3",
      "profile35": "37.3;208.3",
      "profile36": "38.3;209.3",
      "profile37": "39.3;210.3",
      "profile38": "40.3;211.3",
      "profile39": "41.3;212.3",
      "profile40": "42.3;213.3",
    }
  ]
  
  
  dummyData2:SensorData2[]=[
  {
    "Battery_Voltage": "10.4",
    "Date":"2025-01-08T00:00:00.000Z",
    "GPS_Date":"1900-01-01T00:00:00.000Z",
    "LAT": 18.95,
    "LONG": 72.66,
    "Lower_CurrentSpeedDirection": "0.32;254.7",
    "Middle_CurrentSpeedDirection": "0.71;249.3",
    "S1_RelativeWaterLevel":'2.37',
    "S2_SurfaceCurrentSpeedDirection": "0.69;221.6",
    "StationID":"CWPRS02",
    "Time": "1970-01-01T09:30:00.000Z",
    "UTC_Time": "1970-01-01T06:00:00.000Z",
    "id": 63,
    "profile4": "23.4;233.9",
    "profile5": "53.2;234.9",
    "profile6": "21.3;321.9",
    "profile7": "43.2;233.0",
    "profile8": "11.3;343.2",
    "profile9": "32.2;244.3",
    "profile10":"12.3;123.3",
    "profile11": "13.3;134.3",
      "profile12": "14.3;145.3",
      "profile13": "15.3;156.3",
      "profile14": "16.3;167.3",
      "profile15": "17.3;178.3",
      "profile16": "18.3;189.3",
      "profile17": "19.3;190.3",
      "profile18": "20.3;191.3",
      "profile19": "21.3;192.3",
      "profile20": "22.3;193.3",
      "profile21": "23.3;194.3",
      "profile22": "24.3;195.3",
      "profile23": "25.3;196.3",
      "profile24": "26.3;197.3",
      "profile25": "27.3;198.3",
      "profile26": "28.3;199.3",
      "profile27": "29.3;200.3",
      "profile28": "30.3;201.3",
      "profile29": "31.3;202.3",
      "profile30": "32.3;203.3",
      "profile31": "33.3;204.3",
      "profile32": "34.3;205.3",
      "profile33": "35.3;206.3",
      "profile34": "36.3;207.3",
      "profile35": "37.3;208.3",
      "profile36": "38.3;209.3",
      "profile37": "39.3;210.3",
      "profile38": "40.3;211.3",
      "profile39": "41.3;212.3",
      "profile40": "42.3;213.3",
  },
  {
    "Battery_Voltage": "10.4",
    "Date":"2025-01-08T00:00:00.000Z",
    "GPS_Date":"1900-01-01T00:00:00.000Z",
    "LAT": 18.95,
    "LONG": 72.66,
    "Lower_CurrentSpeedDirection": "0.32;254.7",
    "Middle_CurrentSpeedDirection": "0.71;249.3",
    "S1_RelativeWaterLevel":'2.37',
    "S2_SurfaceCurrentSpeedDirection": "0.69;221.6",
    "StationID":"CWPRS02",
    "Time": "1970-01-01T09:20:00.000Z",
    "UTC_Time": "1970-01-01T06:00:00.000Z",
    "id": 62,
    "profile4": "23.4;233.9",
    "profile5": "53.2;234.9",
    "profile6": "21.3;321.9",
    "profile7": "43.2;233.0",
    "profile8": "11.3;343.2",
    "profile9": "32.2;244.3",
    "profile10":"12.3;123.3",
    "profile11": "13.3;134.3",
      "profile12": "14.3;145.3",
      "profile13": "15.3;156.3",
      "profile14": "16.3;167.3",
      "profile15": "17.3;178.3",
      "profile16": "18.3;189.3",
      "profile17": "19.3;190.3",
      "profile18": "20.3;191.3",
      "profile19": "21.3;192.3",
      "profile20": "22.3;193.3",
      "profile21": "23.3;194.3",
      "profile22": "24.3;195.3",
      "profile23": "25.3;196.3",
      "profile24": "26.3;197.3",
      "profile25": "27.3;198.3",
      "profile26": "28.3;199.3",
      "profile27": "29.3;200.3",
      "profile28": "30.3;201.3",
      "profile29": "31.3;202.3",
      "profile30": "32.3;203.3",
      "profile31": "33.3;204.3",
      "profile32": "34.3;205.3",
      "profile33": "35.3;206.3",
      "profile34": "36.3;207.3",
      "profile35": "37.3;208.3",
      "profile36": "38.3;209.3",
      "profile37": "39.3;210.3",
      "profile38": "40.3;211.3",
      "profile39": "41.3;212.3",
      "profile40": "42.3;213.3",
  },
  {
    "Battery_Voltage": "10.4",
    "Date":"2025-01-08T00:00:00.000Z",
    "GPS_Date":"1900-01-01T00:00:00.000Z",
    "LAT": 18.95,
    "LONG": 72.66,
    "Lower_CurrentSpeedDirection": "0.32;254.7",
    "Middle_CurrentSpeedDirection": "0.71;249.3",
    "S1_RelativeWaterLevel":'2.37',
    "S2_SurfaceCurrentSpeedDirection": "0.69;221.6",
    "StationID":"CWPRS02",
    "Time": "1970-01-01T09:10:00.000Z",
    "UTC_Time": "1970-01-01T06:00:00.000Z",
    "id": 61,
    "profile4": "23.4;233.9",
    "profile5": "53.2;234.9",
    "profile6": "21.3;321.9",
    "profile7": "43.2;233.0",
    "profile8": "11.3;343.2",
    "profile9": "32.2;244.3",
    "profile10":"12.3;123.3",
    "profile11": "13.3;134.3",
      "profile12": "14.3;145.3",
      "profile13": "15.3;156.3",
      "profile14": "16.3;167.3",
      "profile15": "17.3;178.3",
      "profile16": "18.3;189.3",
      "profile17": "19.3;190.3",
      "profile18": "20.3;191.3",
      "profile19": "21.3;192.3",
      "profile20": "22.3;193.3",
      "profile21": "23.3;194.3",
      "profile22": "24.3;195.3",
      "profile23": "25.3;196.3",
      "profile24": "26.3;197.3",
      "profile25": "27.3;198.3",
      "profile26": "28.3;199.3",
      "profile27": "29.3;200.3",
      "profile28": "30.3;201.3",
      "profile29": "31.3;202.3",
      "profile30": "32.3;203.3",
      "profile31": "33.3;204.3",
      "profile32": "34.3;205.3",
      "profile33": "35.3;206.3",
      "profile34": "36.3;207.3",
      "profile35": "37.3;208.3",
      "profile36": "38.3;209.3",
      "profile37": "39.3;210.3",
      "profile38": "40.3;211.3",
      "profile39": "41.3;212.3",
      "profile40": "42.3;213.3",
  }
  ]

}
// const hours = tt.getHours().toString().padStart(2, '0'); // Ensure two digits
// const minutes = tt.getMinutes().toString().padStart(2, '0'); // Ensure two digits
// return `${hours}:${minutes}`;
