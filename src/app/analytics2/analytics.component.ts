import { CommonModule } from '@angular/common';
import {Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { HttpClient, } from '@angular/common/http';

import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';

import * as echarts from 'echarts';

import { StationService, buoys} from '../station_service/station.service';
import { ThemeService } from '../theme_service/theme.service';
import { ConfigDataService } from '../config-data.service';
import { resolve } from 'node:path';
import { SensorData, SensorData2 } from '../../model/config.model';
import { json } from 'stream/consumers';
import { Label } from '@amcharts/amcharts4/core';
interface binJson{
  name:string,
  bin:string;
  show:boolean
}
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectModule, DropdownModule, CalendarModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  providers:[StationService]
})
export class AnalyticsComponent implements OnInit{

  sampleDataAdcp = [
    { timestamp: '2024-10-01T00:00:00Z', current_speed: 1.2, current_direction: 30 },
    { timestamp: '2024-10-01T01:00:00Z', current_speed: 1.5, current_direction: 45 },
    { timestamp: '2024-10-01T02:00:00Z', current_speed: 0.8, current_direction: 60 },
    { timestamp: '2024-10-01T03:00:00Z', current_speed: 2.1, current_direction: 90 },
    { timestamp: '2024-10-01T04:00:00Z', current_speed: 1.9, current_direction: 120 },
    { timestamp: '2024-10-01T05:00:00Z', current_speed: 1.6, current_direction: 150 },
    { timestamp: '2024-10-01T06:00:00Z', current_speed: 0.5, current_direction: 180 },
    { timestamp: '2024-10-01T07:00:00Z', current_speed: 1.3, current_direction: 210 },
    { timestamp: '2024-10-01T08:00:00Z', current_speed: 1.4, current_direction: 240 },
    { timestamp: '2024-10-01T09:00:00Z', current_speed: 0.9, current_direction: 270 },
    { timestamp: '2024-10-01T10:00:00Z', current_speed: 1.1, current_direction: 300 },
    { timestamp: '2024-10-01T11:00:00Z', current_speed: 1.0, current_direction: 330 },
    { timestamp: '2024-10-01T12:00:00Z', current_speed: 1.4, current_direction: 360 },
    { timestamp: '2024-10-01T13:00:00Z', current_speed: 2.0, current_direction: 15 },
    { timestamp: '2024-10-01T14:00:00Z', current_speed: 1.7, current_direction: 30 },
    { timestamp: '2024-10-01T15:00:00Z', current_speed: 1.8, current_direction: 45 },
    { timestamp: '2024-10-01T16:00:00Z', current_speed: 1.2, current_direction: 60 },
    { timestamp: '2024-10-01T17:00:00Z', current_speed: 0.7, current_direction: 90 },
    { timestamp: '2024-10-01T18:00:00Z', current_speed: 1.4, current_direction: 120 },
    { timestamp: '2024-10-01T19:00:00Z', current_speed: 1.6, current_direction: 150 },
    { timestamp: '2024-10-01T20:00:00Z', current_speed: 0.4, current_direction: 180 },
    { timestamp: '2024-10-01T21:00:00Z', current_speed: 1.1, current_direction: 210 },
    { timestamp: '2024-10-01T22:00:00Z', current_speed: 1.5, current_direction: 240 },
    { timestamp: '2024-10-01T23:00:00Z', current_speed: 0.9, current_direction: 270 },
    { timestamp: '2024-10-02T00:00:00Z', current_speed: 1.0, current_direction: 300 },
    { timestamp: '2024-10-02T01:00:00Z', current_speed: 1.2, current_direction: 330 },
    { timestamp: '2024-10-02T02:00:00Z', current_speed: 1.5, current_direction: 360 },
    { timestamp: '2024-10-02T03:00:00Z', current_speed: 1.8, current_direction: 15 },
    { timestamp: '2024-10-02T04:00:00Z', current_speed: 1.6, current_direction: 30 },
    { timestamp: '2024-10-02T05:00:00Z', current_speed: 1.4, current_direction: 45 },
    { timestamp: '2024-10-02T06:00:00Z', current_speed: 0.9, current_direction: 60 },
    { timestamp: '2024-10-02T07:00:00Z', current_speed: 1.1, current_direction: 90 },
    { timestamp: '2024-10-02T08:00:00Z', current_speed: 1.3, current_direction: 120 },
    { timestamp: '2024-10-02T09:00:00Z', current_speed: 1.2, current_direction: 150 },
    { timestamp: '2024-10-02T10:00:00Z', current_speed: 1.5, current_direction: 180 },
    { timestamp: '2024-10-02T11:00:00Z', current_speed: 1.7, current_direction: 210 },
    { timestamp: '2024-10-02T12:00:00Z', current_speed: 1.4, current_direction: 240 },
    { timestamp: '2024-10-02T13:00:00Z', current_speed: 1.8, current_direction: 270 },
    { timestamp: '2024-10-02T14:00:00Z', current_speed: 1.0, current_direction: 300 },
    { timestamp: '2024-10-02T15:00:00Z', current_speed: 1.2, current_direction: 330 },
    { timestamp: '2024-10-02T16:00:00Z', current_speed: 1.5, current_direction: 360 },
    { timestamp: '2024-10-02T17:00:00Z', current_speed: 1.3, current_direction: 15 },
    { timestamp: '2024-10-02T18:00:00Z', current_speed: 0.6, current_direction: 30 },
    { timestamp: '2024-10-02T19:00:00Z', current_speed: 1.2, current_direction: 45 },
    { timestamp: '2024-10-02T20:00:00Z', current_speed: 1.1, current_direction: 60 },
    { timestamp: '2024-10-02T21:00:00Z', current_speed: 0.8, current_direction: 90 },
    { timestamp: '2024-10-02T22:00:00Z', current_speed: 1.4, current_direction: 120 },
    { timestamp: '2024-10-02T23:00:00Z', current_speed: 1.6, current_direction: 150 }
  ];
  
  sampleDataPolar = [
    { "speed": 3.4, "direction": 45 },
    { "speed": 1.6, "direction": 120 },
    { "speed": 4.1, "direction": 270 },
    { "speed": 2.4, "direction": 90 },
    { "speed": 0.0, "direction": 180 },
    { "speed": 4.4, "direction": 200 },
    { "speed": 0.9, "direction": 320 },
    { "speed": 2.8, "direction": 135 },
    { "speed": 1.5, "direction": 270 },
    { "speed": 1.2, "direction": 15 },
    { "speed": 2.3, "direction": 60 },
    { "speed": 5.1, "direction": 330 },
    { "speed": 3.1, "direction": 75 },
    { "speed": 2.0, "direction": 150 },
    { "speed": 4.3, "direction": 210 },
    { "speed": 0.7, "direction": 300 },
    { "speed": 5.2, "direction": 10 },
    { "speed": 0.8, "direction": 80 },
    { "speed": 5.0, "direction": 360 },
    { "speed": 2.5, "direction": 240 },
    { "speed": 1.0, "direction": 30 },
    { "speed": 3.7, "direction": 190 },
    { "speed": 1.6, "direction": 120 },
    { "speed": 4.0, "direction": 210 },
    { "speed": 2.9, "direction": 260 },
    { "speed": 2.3, "direction": 350 },
    { "speed": 4.6, "direction": 180 },
    { "speed": 1.3, "direction": 70 },
    { "speed": 3.0, "direction": 45 },
    { "speed": 0.9, "direction": 300 },
    { "speed": 4.5, "direction": 220 },
    { "speed": 0.6, "direction": 110 },
    { "speed": 2.1, "direction": 190 },
    { "speed": 3.8, "direction": 350 },
    { "speed": 5.0, "direction": 40 },
    { "speed": 2.6, "direction": 80 },
    { "speed": 5.3, "direction": 140 },
    { "speed": 3.2, "direction": 300 },
    { "speed": 1.4, "direction": 160 },
    { "speed": 5.7, "direction": 270 },
    { "speed": 2.0, "direction": 30 },
    { "speed": 1.1, "direction": 50 },
    { "speed": 4.2, "direction": 200 },
    { "speed": 0.8, "direction": 360 },
    { "speed": 2.3, "direction": 120 },
    { "speed": 3.0, "direction": 90 },
    { "speed": 4.8, "direction": 260 },
    { "speed": 0.5, "direction": 300 },
    { "speed": 5.9, "direction": 15 },
    { "speed": 3.5, "direction": 170 },
    { "speed": 2.2, "direction": 320 },
    { "speed": 2.8, "direction": 240 },
    { "speed": 6.1, "direction": 360 }
  ];
   
  selectedStation: string = 'cwprs01';
  selectedPeriod: string = 'dateRange';
  selectedChart: string = 'line';
  selectedSensor: String = '';

  stationOptions = [
    { label: 'CWPRS 01', value: 'cwprs01' },
    { label: 'CWPRS 02', value: 'cwprs02' },
  ];
  periodOptions = [
    { label: 'Daily', value: 'dateRange' },
    { label: 'Weekly', value: 'weekRange' },
    { label: 'Monthly', value: 'monthRange' },
    { label: 'Yearly', value: 'yearRange' }
];
chartOptions = [
  { label: 'Line Plot', value: 'line' },
  // { label: 'Scatter Series', value: 'scatter' },
  { label: 'Bar Plot', value: 'bar' },
  { label: 'Polar plot', value: 'currentSpeed' }
];

cwprs01: SensorData[] = [];
cwprs02: SensorData2[] = [];

fromDate =new Date();
toDate = new Date();
selectedWeek =new Date();
selectedMonth =new Date();
selectedYear =new Date();
  
isSpeedChecked: boolean = true;
isCurrentChecked: boolean = true;

SubmitedslectedOption: String = '';
chartOption: any;
loading: boolean = false;

tideUnit: string = '';
adcpUnit: string = '';
//'Bin1', 'Bin2', 'Bin3', 'Bin4', 'Bin5', 'Bin6', 'Bin7', 'Bin8', 'Bin9', 'Bin10'
listallBin: string[]= []; 
surfacebin: string = '';
midbin: string ='';
bottombin: string = '';
bins2:binJson[]=[];
dropdownOptions: { label: string; value: string }[] = [];
binName:string = "0 to 5m";

constructor(private stationService: StationService, private themeService: ThemeService, private http:HttpClient, private cd: ChangeDetectorRef, private sensor:ConfigDataService) {}

ngOnInit(): void {
  this.initializeDropdown();
  this.onInitFetch(); // Fetch one-day data on page load
  this.subscribeToThemeChanges(); // Listen for theme changes
}

initializeDropdown(): void {
  this.dropdownOptions = this.listallBin.map(bin => ({ label: bin, value: bin }));
}

onInitFetch(): void {
  // Format date range for fetching data
  let formattedFromDate: string | null = null;
  let formattedToDate: string | null = null;

   // Defaulting fromDate and toDate to current date at 00:00
   let fromDate = this.fromDate || new Date();
   let toDate = this.toDate || new Date();

   this.fromDate.setHours(0,0,0,0);

         // One-day range (same date for from and to with time included)
         formattedFromDate = this.toISTISOString(fromDate);
         formattedToDate = this.toISTISOString(toDate);

  this.loading = true;
  this.stationService.getSensorssTime(formattedFromDate, formattedToDate).subscribe(
    (data: buoys) => {
      this.cwprs01 = data.buoy1;
      this.cwprs02 = data.buoy2;
      this.loading = false;

      // Render charts for initial load
      this.sensorConfig().then(({ tide, adcp }) => {
        this.tideUnit = tide;
        this.adcpUnit = adcp;
        
        this.Tide();
        this.surfaceSpeedDirection();
        this.midSpeedDirection();
        this.bottomSpeedDirection();
        this.surfacepolar();
        this.midpolar();
        this.bottompolar();
      });
    },
    error => {
      //console.error('Error fetching initial buoy data', error);
      this.loading = false;
    }
  );
}


sensorConfig(): Promise<{tide: string; adcp: string}>{
  return new Promise((unit) => {
   this.sensor.getsensorConfigs().subscribe((data) => {
    const tide = data[0]?.unit || 'm';
    const adcp = data[1]?.unit || 'm/s';
    const bins = data[1]?.bins.split(',') || '';
    this.surfacebin = bins[0];
    this.midbin = bins[1];
    this.bottombin = bins[2];
    // 
    const josn = JSON.parse(data[1].e_bins);
    this.bins2 = josn;
    //console.log("bins2",this.bins2)
    this.listallBin.push(
      this.surfacebin, this.midbin, this.bottombin
    );
    for(let i=0; i<this.bins2.length; i++){
      if(this.bins2[i].show){
        this.listallBin.push(this.bins2[i].bin);
      }
      
    }
    //console.log("list bins:", this.listallBin)
    this.dropdownOptions = this.listallBin.map(bin=> ({label:bin, value:bin}));
    
    // this.listallBin = data[1]?.e_bins?.split(',') || [];
    // this.listallBin = ['All Bins', ...(data[1]?.e_bins?.split(',') || [])]; 
    // this.updateInit(this.midbin);
    // this.updateInit(this.bottombin);
    //console.log(`all-bin ${this.listallBin}`);
    //console.log(`surface: ${this.surfacebin}, Mid: ${this.midbin}, bottom: ${this.bottombin}`)
    //console.log(`tide unit: ${tide}, adcp unit: ${adcp}`);
    unit({ tide, adcp});
   });
  })
}

surfaceData:string[]=[];
// MiddleData:string[]=[];
// BottomData:string[]=[];
// innerbinDAta:string[]=[];
  
onBinChange(selectedBin: string) {
  //console.log(`Selected Bin: ${selectedBin}`);
  // this.selectedSurfaceBin = selectedBin; 
  this.surfacebin = selectedBin;// Update the selectedSurfaceBin
  this.surfaceData = [...this.updateInit(selectedBin, true)];
  //console.log('Updated newChart Data:', this.surfaceData);
  if(selectedBin === this.listallBin[0]){
    this.binName = "Surface Current";
  }else if(selectedBin === this.listallBin[1]){
    this.binName = "Mid Current";
  }else if(selectedBin === this.listallBin[2]){
    this.binName = "Bottom Current";
  }else {
    for(let i=0; i<this.bins2.length; i++){
      if(this.bins2[i].bin === selectedBin){
        this.binName = this.bins2[i].name;
      }
    }
  }
  //console.log("bin name :", this.binName);
}

updateInit(val: string, isSurface: boolean): string[] {
  //console.log("Received value:", `"hi${val}, ${this.selectedStation}"`);
  //console.log("updateInit called with val:", val, "isSurface:", isSurface);

  let data: string[] = [];
  const stationData = this.selectedStation.toLowerCase() === 'cwprs01' ? this.cwprs01 : this.cwprs02;
  const dump = stationData.map(item => item.profile5);
  //console.log("Station Data for",dump, this.selectedStation, stationData);
  // const dump = stationData.map(item => item.profile5);
  // //console.log("bin data list",dump)
  const v =val.trim();
  switch (val) {
    case 'Profile1': data = stationData.map(item => item.S2_SurfaceCurrentSpeedDirection); break;
    case 'Profile2': data = stationData.map(item => item.Middle_CurrentSpeedDirection); break;
    case 'Profile3': data = stationData.map(item => item.Lower_CurrentSpeedDirection); break;
    case 'Profile4': data = stationData.map(item => item.profile4); break;
    case 'Profile5': data = stationData.map(item => item.profile5); break;
    case 'Profile6': data = stationData.map(item => item.profile6); break;
    case 'Profile7': data = stationData.map(item => item.profile7); break;
    case 'Profile8': data = stationData.map(item => item.profile8); break;
    case 'Profile9': data = stationData.map(item => item.profile9); break;
    case 'Profile10': data = stationData.map(item => item.profile10); break;
    default:
      //console.log("Invaliid bin selection:", val);
      return [];
  }
  return data;
}

// selected_e_bin:string= '';
noInitial:boolean=false;

  onSubmitAndFetch(): void{
    this.loading = true;
    this.surfaceData.length = 0;
    this.noInitial = true;  

  // Check and update surfaceData if noInitial is true
  if (this.noInitial && this.surfacebin) {
    this.surfaceData = [...this.updateInit(this.surfacebin, true)];
    //console.log("Surface Data after bin selection:", this.surfaceData);
  }

  //console.log(`Chosen Bin: ${this.surfacebin}`);
  //console.log(`Surface Data: ${this.surfaceData}`);

    this.SubmitedslectedOption = this.selectedSensor;

        // Format date range for fetching data
        const { formattedFromDate, formattedToDate } = this.getFormattedDates();
    
    this.stationService.getSensorssTime(formattedFromDate!, formattedToDate!).subscribe(
      (data: buoys) => {
        this.cwprs01 = data.buoy1;
        this.cwprs02 = data.buoy2;
        this.loading = false;

        // Trigger additional chart updates
        setTimeout(() => {
          if (this.SubmitedslectedOption === 'tide' && this.selectedChart) {
            this.Tide();
          } else if (this.SubmitedslectedOption === 'adcp' && this.selectedChart) {
            this.surfaceSpeedDirection();
            this.midSpeedDirection();
            this.bottomSpeedDirection();
            this.surfacepolar();
            this.midpolar();
            this.bottompolar();
          }
        }, 0);
      },
      error => {
        //console.error('Error fetching buoy data', error);
        this.loading = false;

      }
    );
}

getFormattedDates(): { formattedFromDate: string | null; formattedToDate: string | null } {
  let formattedFromDate: string | null = null;
  let formattedToDate: string | null = null;

  let fromDate = this.fromDate || new Date();
  let toDate = this.toDate || new Date();

  // fromDate.setHours(0, 0, 0, 0); 

  if (!this.selectedPeriod) {
    // Default to one-day range
    formattedFromDate = this.toISTISOString(fromDate);
    formattedToDate = this.toISTISOString(toDate);
  } else {
    // Handle selected period formatting
    switch (this.selectedPeriod) {
      case 'dateRange':
        formattedFromDate = this.fromDate ? this.toISTISOString(this.fromDate) : this.toISTISOString(fromDate);
          formattedToDate = this.toDate ? this.toISTISOString(this.toDate) : this.toISTISOString(toDate);
        break;
      case 'weekRange':
        const startOfWeek = new Date(this.selectedWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        formattedFromDate = this.toISTISOString(startOfWeek);
        const weekEndDate = this.getWeekEndDate(this.selectedWeek);
        formattedToDate = this.toISTISOString(weekEndDate);
        break;
      case 'monthRange':
        formattedFromDate = this.selectedMonth
          ? `${this.selectedMonth.getFullYear()}-${(this.selectedMonth.getMonth() + 1)
              .toString()
              .padStart(2, '0')}-01T00:00:00`
          : null;
        const monthEndDate = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 0);
        formattedToDate = monthEndDate
          ? `${monthEndDate.toISOString().split('T')[0]}T23:59:59`
          : null;
        break;
      case 'yearRange':
        const year = this.selectedYear.getFullYear();
        formattedFromDate = `${year}-01-01T00:00:00`;
        formattedToDate = `${year}-12-31T23:59:59`;
        break;
      default:
        break;
    }
  }

  return { formattedFromDate, formattedToDate };
}

subscribeToThemeChanges(): void {
  this.themeService.currentTheme$.subscribe(() => {
      this.Tide();
      this.surfaceSpeedDirection();
      this.midSpeedDirection();
      this.bottomSpeedDirection();
      this.surfacepolar();
      this.midpolar();
      this.bottompolar();
  });
}

onPeriodChange(event: any) {
}

selectSensorOption(typee: String) {
this.selectedSensor = typee;
this.onSensorChange();
 }

onSensorChange() {
  if (this.selectedSensor === 'adcp') {
    this.chartOptions = [
      { label: 'Line Plot', value: 'line' },
      // { label: 'Scatter Series', value: 'scatter' },
      { label: 'Bar Plot', value: 'bar' },
      { label: 'Polar Plot', value: 'currentSpeed' }
    ];
  } else {
    this.chartOptions = [
      { label: 'Line Plot', value: 'line' },
      // { label: 'Scatter Series', value: 'scatter' },
      { label: 'Bar Plot', value: 'bar' }
    ];
  }
}

  private toISTISOString(date: Date): string {
    const offsetMilliseconds = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + offsetMilliseconds);
    istDate.setSeconds(0, 0);
    return istDate.toISOString().slice(0, -1); // Removing the 'Z' at the end
}

  getWeekEndDate(startDate: Date): Date {
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);  // Add 6 days to get the week end
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  } 

Tide(): void {

  const chartType = this.selectedChart;
    this.loading = true;
    const tide = document.getElementById('tide');
    
    const computedStyle = getComputedStyle(document.body);
    const bgColor = computedStyle.getPropertyValue('--secbackground-color').trim();
    const mainText = computedStyle.getPropertyValue('--chart-maintext').trim();
    const subText = computedStyle.getPropertyValue('--main-text').trim();
    
    const sampleData = [
      [
      "2000-06-05",
      116
      ],
      [
      "2000-06-06",
      129
      ],
      [
      "2000-06-07",
      135
      ],
      [
      "2000-06-08",
      86
      ],
      [
      "2000-06-09",
      73
      ],
      [
      "2000-06-10",
      85
      ],
      [
      "2000-06-11",
      73
      ],
      [
      "2000-06-12",
      68
      ],
      [
      "2000-06-13",
      92
      ],
      [
      "2000-06-14",
      130
      ],
      [
      "2000-06-15",
      245
      ],
      [
      "2000-06-16",
      139
      ],
      [
      "2000-06-17",
      115
      ],
      [
      "2000-06-18",
      111
      ],
      [
      "2000-06-19",
      309
      ],
      [
      "2000-06-20",
      206
      ],
      [
      "2000-06-21",
      137
      ],
      [
      "2000-06-22",
      128
      ],
      [
      "2000-06-23",
      85
      ],
      [
      "2000-06-24",
      94
      ],
      [
      "2000-06-25",
      71
      ],
      [
      "2000-06-26",
      106
      ],
      [
      "2000-06-27",
      84
      ],
      [
      "2000-06-28",
      93
      ],
      [
      "2000-06-29",
      85
      ],
      [
      "2000-06-30",
      73
      ],
      [
      "2000-07-01",
      83
      ],
      [
      "2000-07-02",
      125
      ],
      [
      "2000-07-03",
      107
      ],
      [
      "2000-07-04",
      82
      ],
      [
      "2000-07-05",
      44
      ],
      [
      "2000-07-06",
      72
      ],
      [
      "2000-07-07",
      106
      ],
      [
      "2000-07-08",
      107
      ],
      [
      "2000-07-09",
      66
      ],
      [
      "2000-07-10",
      91
      ],
      [
      "2000-07-11",
      92
      ],
      [
      "2000-07-12",
      113
      ],
      [
      "2000-07-13",
      107
      ],
      [
      "2000-07-14",
      131
      ],
      [
      "2000-07-15",
      111
      ],
      [
      "2000-07-16",
      64
      ],
      [
      "2000-07-17",
      69
      ],
      [
      "2000-07-18",
      88
      ],
      [
      "2000-07-19",
      77
      ],
      [
      "2000-07-20",
      83
      ],
      [
      "2000-07-21",
      111
      ],
      [
      "2000-07-22",
      57
      ],
      [
      "2000-07-23",
      55
      ],
      [
      "2000-07-24",
      60
      ],
      [
      "2000-07-25",
      44
      ],
      [
      "2000-07-26",
      127
      ],
      [
      "2000-07-27",
      114
      ],
      [
      "2000-07-28",
      86
      ],
      [
      "2000-07-29",
      73
      ],
      [
      "2000-07-30",
      52
      ],
      [
      "2000-07-31",
      69
      ],
      [
      "2000-08-01",
      86
      ],
      [
      "2000-08-02",
      118
      ],
      [
      "2000-08-03",
      56
      ],
      [
      "2000-08-04",
      91
      ],
      [
      "2000-08-05",
      121
      ],
      [
      "2000-08-06",
      127
      ],
      [
      "2000-08-07",
      78
      ],
      [
      "2000-08-08",
      79
      ],
      [
      "2000-08-09",
      46
      ],
      [
      "2000-08-10",
      108
      ],
      [
      "2000-08-11",
      80
      ],
      [
      "2000-08-12",
      79
      ],
      [
      "2000-08-13",
      69
      ],
      [
      "2000-08-14",
      80
      ],
      [
      "2000-08-15",
      105
      ],
      [
      "2000-08-16",
      119
      ],
      [
      "2000-08-17",
      105
      ],
      [
      "2000-08-18",
      55
      ],
      [
      "2000-08-19",
      74
      ],
      [
      "2000-08-20",
      41
      ],
      [
      "2000-08-21",
      62
      ],
      [
      "2000-08-22",
      104
      ],
      [
      "2000-08-23",
      118
      ],
      [
      "2000-08-24",
      121
      ],
      [
      "2000-08-25",
      126
      ],
      [
      "2000-08-26",
      99
      ],
      [
      "2000-08-27",
      92
      ],
      [
      "2000-08-28",
      75
      ],
      [
      "2000-08-29",
      91
      ],
      [
      "2000-08-30",
      94
      ],
      [
      "2000-08-31",
      69
      ],
      [
      "2000-09-01",
      93
      ],
      [
      "2000-09-02",
      124
      ],
      [
      "2000-09-03",
      120
      ],
      [
      "2000-09-04",
      93
      ],
      [
      "2000-09-05",
      26
      ],
      [
      "2000-09-06",
      32
      ],
    ]
   
      
      // if(this.selectedStation.toLowerCase() == "cwprs01"){
      //   for(let i in this.cwprs01 ){
      //     this.sampleDataTide.push({date:this.cwprs01[i].Date, level: parseFloat(this.cwprs01[i].S1_RelativeWaterLevel)});
      //   }
      // }else if(this.selectedStation.toLowerCase() == "cwprs02"){
      //   for(let i in this.cwprs02 ){
      //     this.sampleDataTide.push({date:this.cwprs02[i].Date, level: parseFloat(this.cwprs02[i].S1_RelativeWaterLevel)});
      //   }
      // }

      // fetch with model (only date)
    

     
    if (tide) {
      const existingInstance = echarts.getInstanceByDom(tide);
      if(existingInstance){
         existingInstance.dispose();
      }
      const tideLevel = echarts.init(tide);
  
    const waterLevels = this.selectedStation === 'cwprs01' ? this.cwprs01.map(item => item.S1_RelativeWaterLevel) : 
                        this.selectedStation === 'cwprs02' ? this.cwprs02.map(item => item.S1_RelativeWaterLevel) : []

    const dates = this.selectedStation === 'cwprs01' ? this.cwprs01.map(item =>`${item.Date?.split('T')[0]} ${item.Time?.split('T')[1]?.split('.')[0]}`) :
                  this.selectedStation === 'cwprs02' ? this.cwprs02.map(item =>`${item.Date?.split('T')[0]} ${item.Time?.split('T')[1]?.split('.')[0]}`) : []

    //Without model and fetch with date and time
                  
    // const dates = this.cwprs01.map(item =>`${item.Date?.split('T')[0]}`);
        //Without model and fetch with date only

         // Retrieve theme variables
           
  
      
    const option = {
        title: {
          text: 'Tide',
           left: '1%',
           textStyle: {
            color : mainText,
            fontSize: 20
           }
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          // top: '50%',
          left: '7%',
          // right: '10%',
          bottom: '30%',
          // containLabel: true
        },
        xAxis: {
          type: 'time',
          name: 'Date',  // X-axis legend (title)
          nameLocation: 'middle',
          nameTextStyle: {
            color: mainText,
            padding: [35, 0, 0, 0],
            fontSize: 16         
          },
          // data: dates,
          axisLabel: {
            color: subText, // Set x-axis label color to white
            rotate: 45,
            
          },
          axisLine:{
            show:true
          },
          splitLine: {
            show: false // Hide x-axis grid lines
          }
        },
        
        yAxis: {
          name: `Water Level (${this.tideUnit})`,  // Y-axis legend (title)
          nameLocation: 'middle',
          nameTextStyle: {
            color: mainText,
            padding: [0,0,30,0], 
            fontSize: 16   
          },
          // type: 'value'
          axisLabel: {
            color: subText // Set y-axis label color to white
          },
          axisLine:{
            show:true,
           
          },
          splitLine: {
            show: true, // Hide x-axis grid lines
            lineStyle: {
              color: subText, 
              type: 'dashed'
            }
          }
        },
  
        legend: {
          // type: 'scroll',
          orient: 'vertical',  // Orient the legend vertically
          right: '15%', 
          top: '2%',
          // top: 'middle',
          textStyle: {
            color: subText, // Set legend text color to white
            fontSize: 14
          }          
        },

        toolbox: {
          // right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              title: {
                zoom: 'Zoom',
                back: 'Reset Zoom'
              }
            },
            restore: {},
            saveAsImage: {
              backgroundColor: bgColor,
              pixelRatio: 2,
            }
          },
          iconStyle: {
            borderColor: mainText
          }
        },
        
        dataZoom: [
          {
            type: 'slider',
            // bottom: 15,
            height: 20,
            start: 0,  // You can adjust to define how much of the chart is visible initially
            end: 100,  // Set the percentage of the range initially visible
          },
          {
            type: 'inside',
            start: 0,
            end: 100,  // Can be modified based on your dataset's initial view preference
            zoomOnMouseWheel: true,
            moveOnMouseMove: true
          }
        ],
        
        
        series: [
          {
            name: 'Water Level',
            data:  dates.map((date, index) => ({ value: [date, waterLevels[index]] })),
            // data: this.sampleDataTide.map(item => [item.date, item.level]),
            //  data: sampleData.map(item => [item[0], item[1]]),
            type: chartType === 'bar' ? 'bar'  : chartType,
            smooth: chartType === 'line',
            lineStyle: chartType === 'line' ? { color: '#1ee1ff' } : { color: 'orange' },
            barWidth: chartType === 'bar' ? '50%' : undefined,

            itemStyle: {
              color: '#1ee1ff'
            },
            showSymbol: false,
            label: {
              show: false,
              fontSize: 12  // Optional: Set font size for the data points (if labels are enabled)
            },
            
          },

        ]
        };
     
        
      
        // Set options for the chart
        tideLevel.setOption(option);
        this.loading = false;
        window.addEventListener('resize', () => {
          tideLevel.resize();
       }); 
      } 
      else {
         this.loading = false;
      }
    }
    

surfaceSpeedDirection(): void {
  const chartType = this.selectedChart;
  this.loading = true;
  const surface = document.getElementById('surfaceSpeedDirection');

  const computedStyle = getComputedStyle(document.body);
  const bgColor = computedStyle.getPropertyValue('--secbackground-color').trim();
  const mainText = computedStyle.getPropertyValue('--chart-maintext').trim();
  const subText = computedStyle.getPropertyValue('--main-text').trim();

  // if(this.selectedStation.toLowerCase() == "cwprs01"){
  //   for(let i in this.cwprs01 ){
  //     const [speedStr, directionStr] = this.cwprs01[i].S2_SurfaceCurrentSpeedDirection.split(';');
  //     const speed = parseFloat(speedStr);
  //     const direction = parseFloat(directionStr);
  //     this.sampleData.push(
  //      {time: this.cwprs01[i].Date,       // Assuming 'Date' holds the time value
  //       speed: speed,     // Assuming 'speed' is available in 'cwprs01'
  //       direction: direction}
  //     );
  //   }
  // }else if(this.selectedStation.toLowerCase() == "cwprs02"){
  //   for(let i in this.cwprs02 ){
  //     const [speedStr, directionStr] = this.cwprs02[i].S2_SurfaceCurrentSpeedDirection.split(';');

  //     // Convert the string parts to numbers
  //     const speed = parseFloat(speedStr);
  //     const direction = parseFloat(directionStr);
  //     this.sampleData.push(
  //      {time: this.cwprs02[i].Date,       // Assuming 'Date' holds the time value
  //       speed: speed,     // Assuming 'speed' is available in 'cwprs01'
  //       direction: direction}
  //     );
  //   }
  // }  
  let surfaceCurrent: string[] = [];
  const data = this.updateInit(this.surfacebin, true);
  
  if (data && data.length > 0) {
    surfaceCurrent = [...data]; // Use the returned data
    this.surfaceData = [...data]; // Explicitly update this.surfaceData if required
    //console.log("Updated surfaceData:", this.surfaceData);
  } else {
    //console.log("No data for the selected bin.");
  }
  
    
  // const surfaceCurrent = this.selectedStation === 'cwprs01' ? this.cwprs01.map(item => item.S2_SurfaceCurrentSpeedDirection) : 
  //                        this.selectedStation === 'cwprs02' ? this.cwprs02.map(item => item.S2_SurfaceCurrentSpeedDirection) : []

  const dates =  this.selectedStation === 'cwprs01' ? this.cwprs01.map(item =>`${item.Date?.split('T')[0]} ${item.Time?.split('T')[1]?.split('.')[0]}`) :
                 this.selectedStation === 'cwprs02' ? this.cwprs02.map(item =>`${item.Date?.split('T')[0]} ${item.Time?.split('T')[1]?.split('.')[0]}`) : []
  // // const dates = this.cwprs01.map(item =>`${item.Date?.split('T')[0]}`);

  if(surface){
            const existingInstance = echarts.getInstanceByDom(surface);
            if (existingInstance) {
              existingInstance.dispose();
            }
    const speedDirection = echarts.init(surface);

    // Prepare chart options
    const option = {
        title: {
            text: this.noInitial? this.binName: 'Surface',
            left: '1%',
            textStyle: {
                color: mainText,
                fontSize: 20
            }
        },
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '7%',
            // right: '10%',
            bottom: '22%',
        },
        xAxis: {
          // '#ffcc00' // yellow code
            type: 'time', // Set x-axis type to time
            name: 'Time',
            nameLocation: 'middle',
            nameTextStyle: {
                color: mainText,
                padding: [15, 0, 0, 0],
                fontSize: 16         
            },
            axisLabel: {
                color: subText // Set x-axis label color to white
            },
            axisLine: {
                show: true
            },
            splitLine: {
                show: false // Hide x-axis grid lines
            }
        },
        
        yAxis: [ 
          ...(this.isSpeedChecked ? [
            {
              type: 'value',
              name: `Current speed (${this.adcpUnit})`,  // Left Y-axis title
              nameLocation: 'middle',
              nameTextStyle: {
                  color: mainText,
                  padding: [0,0,30,0],  // Adjust spacing
                  fontSize: 16,
                  // margin: 20  
              },
              axisLabel: {
                  color: subText, // Set y-axis label color to white
                  //  formatter: '{value} m/s'
              },
              axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#ffcc00'
                  }
              },
              splitLine: {
                  show: true, // Show grid lines
                  lineStyle: {
                    type: 'solid', // Solid gridlines for yAxis 0 (left axis)
                    color: '#ffcc00'
                } 
              }
          }
          ] : []),

          ...(this.isCurrentChecked ? [
            {
              type: 'value',
              name: 'Current Direction (°)',  
              nameLocation: 'middle',
              nameTextStyle: {
                  color: mainText,
                  padding: 25,   // Adjust spacing
                  fontSize: 16   
              },
              axisLabel: {
                  color: subText, // Set y-axis label color to white
                  //  formatter: '{value}°'
              },
              axisLine: {
                  show: true,
                  lineStyle: {
                    color: 'red'
                }
              },
              splitLine: {
                  show: true, // Show grid lines
                  lineStyle: {
                    type: 'dashed', // Dashed gridlines for yAxis 1 (right axis)
                    color: 'red'
                }
              },
              position: this.isSpeedChecked && this.isCurrentChecked ? 'right' : '', 
              min: 0,   
              max: 360, 
              interval: 90, 
          }
          ] : [])        
        ],

        legend: {
          data: [
            ...(this.isSpeedChecked ? ['Current Speed'] : []),
            ...(this.isCurrentChecked ? ['Current Direction'] : [])
          ],
          // data: ['Current Speed (m/s)', 'Current Direction (°)'], 
          orient: 'vertical',
          right: '15%',
          textStyle: {
              color: subText,
              fontSize: 14
          }
      },
      
        toolbox: {
            // right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                 saveAsImage: {
              backgroundColor: bgColor,
              pixelRatio: 2,
            }
            },
            iconStyle: {
                borderColor: mainText
            }
        },

      //   dataZoom: [
      //     {
      //         type: 'slider',
      //         start: 0,
      //         end: 100
      //     },
      //     {
      //         type: 'inside'
      //     }
      // ],
        
        dataZoom: [
          {
            type: 'inside',  // Enable interactive zooming
            xAxisIndex: 0,   // Apply zooming to the x-axis (time axis)
            filterMode: 'filter',  // Filter out of view data
            start: 0,        // Start position for zooming (0%)
            end: 100         // End position for zooming (100%)
          },
          {
            type: 'slider',
            height: 20,  // Enable zooming via a slider below the x-axis
            xAxisIndex: 0,   // Apply slider to the x-axis
            filterMode: 'filter', 
            start: 0,        // Start position for zooming
            end: 100         // End position for zooming
          },
          {
            type: 'inside',  // Enable vertical zooming for y-axis 0 (speed)
            yAxisIndex: 0,   // Bind zoom to the left y-axis (speed)
            filterMode: 'filter',
            start: 0,
            end: 100
          },
          ...(this.isSpeedChecked && this.isCurrentChecked ? [{
            type: 'inside',  // Enable vertical zooming for y-axis 1 (direction)
            yAxisIndex: 1,   // Bind zoom to the right y-axis (direction)
            filterMode: 'filter',
            start: 0,
            end: 100
          }] : [])
        ],
      
        
        series: [
          ...(this.isSpeedChecked ? [{
            name: 'Current Speed',
            data:  dates.map((date, index) => ({ value: [date, surfaceCurrent[index]?.split(';')[0]] })),
            // data: this.sampleData.map(item => [item.time, item.speed]),
            // data: this.sampleDataAdcp.map(item => [item.timestamp, item.current_speed]),
            type: chartType === 'bar' ? 'bar' : chartType,
            lineStyle: { normal: { color: 'orange' } },
            itemStyle: { color: 'orange' },
            showSymbol: false,
            yAxisIndex: 0 // Bind to left y-axis
          }] : []),
  
          ...(this.isCurrentChecked ? [{
            name: 'Current Direction',
            // data: this.sampleData.map(item => [item.time, item.direction]),
            data: dates.map((date, index) => ({ value: [date, surfaceCurrent[index]?.split(';')[1]] })),
            // data: this.sampleDataAdcp.map(item => [item.timestamp, item.current_direction]),
            type:  chartType,
            lineStyle: { normal: { color: 'red', type: 'dashed' } },
            itemStyle: { color: 'red' },
            showSymbol: true,
            yAxisIndex: this.isSpeedChecked ? 1 : 0 // Bind to right y-axis
          }] : [])
        ]
    };

    // Set options for the chart
    speedDirection.setOption(option);
    this.loading = false;
    window.addEventListener('resize', () => {
      speedDirection.resize();
  }); 
      } 
      else {
        //console.error("Element with id 'waterLevel1' not found");
        this.loading = false;
      }
    }
    

midSpeedDirection(): void {
  const chartType = this.selectedChart
        this.loading = true;
        const mid = document.getElementById('midSpeedDirection');

        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--secbackground-color').trim();
        const mainText = computedStyle.getPropertyValue('--chart-maintext').trim();
        const subText = computedStyle.getPropertyValue('--main-text').trim();

        // if(this.selectedStation.toLowerCase() == "cwprs01"){
        //   for(let i in this.cwprs01 ){
        //     const [speedStr, directionStr] = this.cwprs01[i].Middle_CurrentSpeedDirection.split(';');
      
        //     // Convert the string parts to numbers
        //     const speed = parseFloat(speedStr);
        //     const direction = parseFloat(directionStr);
        //     this.sampleData2.push(
        //      {time: this.cwprs01[i].Date,       // Assuming 'Date' holds the time value
        //       speed: speed,     // Assuming 'speed' is available in 'cwprs01'
        //       direction: direction}
        //     );
        //   }
        // }else if(this.selectedStation.toLowerCase() == "cwprs02"){
        //   for(let i in this.cwprs02 ){
        //     const [speedStr, directionStr] = this.cwprs02[i].Middle_CurrentSpeedDirection.split(';');
      
        //     // Convert the string parts to numbers
        //     const speed = parseFloat(speedStr);
        //     const direction = parseFloat(directionStr);
        //     this.sampleData2.push(
        //      {time: this.cwprs02[i].Date,       // Assuming 'Date' holds the time value
        //       speed: speed,     // Assuming 'speed' is available in 'cwprs01'
        //       direction: direction}
        //     );
        //   }
        // }    

        const midCurrent = this.updateInit(this.midbin, false);
        // = this.selectedStation === 'cwprs01' ? this.cwprs01.map(item => item.Middle_CurrentSpeedDirection) : 
        // this.selectedStation === 'cwprs02' ? this.cwprs02.map(item => item.Middle_CurrentSpeedDirection) : []

const dates =  this.selectedStation === 'cwprs01' ? this.cwprs01.map(item =>`${item.Date?.split('T')[0]} ${item.Time?.split('T')[1]?.split('.')[0]}`) :
this.selectedStation === 'cwprs02' ? this.cwprs02.map(item =>`${item.Date?.split('T')[0]} ${item.Time?.split('T')[1]?.split('.')[0]}`) : []
// const dates = this.cwprs01.map(item =>`${item.Date?.split('T')[0]}`);

        if (mid) {
                const existingInstance = echarts.getInstanceByDom(mid);
                if(existingInstance){
                  existingInstance.dispose();
                }
          const midspeedanddirection = echarts.init(mid);
              
          // Prepare chart options
          const option = {
              title: {
                  text: 'Mid',  // Changed title to 'Mid'
                  left: '1%',
                  textStyle: {
                      color: mainText,
                      fontSize: 20
                  }
              },
              tooltip: {
                  trigger: 'axis',
              },
              grid: {
                  left: '7%',
                  // right: '10%',
                  bottom: '22%',
              },
              xAxis: {
                  type: 'time', // Set x-axis type to time
                  name: 'Time',
                  nameLocation: 'middle',
                  nameTextStyle: {
                      color: mainText,
                      padding: [15, 0, 0, 0],
                      fontSize: 16         
                  },
                  axisLabel: {
                      color: subText // Set x-axis label color to white
                  },
                  axisLine: {
                      show: true
                  },
                  splitLine: {
                      show: false // Hide x-axis grid lines
                  }
              },
              
              yAxis: [
                ...(this.isSpeedChecked ? [
                  {
                    type: 'value',
                    name: `Current speed (${this.adcpUnit})`,  // Left Y-axis title
                    nameLocation: 'middle',
                    nameTextStyle: {
                        color: mainText,
                        padding: [0,0,30,0],  // Adjust spacing
                        fontSize: 16,
                        // margin: 20  
                    },
                    axisLabel: {
                        color: subText, // Set y-axis label color to white
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                          color: '#00ff00'  // Updated color to green
                        }
                    },
                    splitLine: {
                        show: true, // Show grid lines
                        lineStyle: {
                          type: 'solid', // Solid gridlines for yAxis 0 (left axis)
                          color: '#00ff00'  // Updated to green
                      } 
                    }
                }
                ] : []),

                ...(this.isCurrentChecked ? [
                  {
                    type: 'value',
                    name: 'Current Direction (°)',  
                    nameLocation: 'middle',
                    nameTextStyle: {
                        color: mainText,
                        padding: 25,  // Adjust spacing
                        fontSize: 16   
                    },
                    axisLabel: {
                        color: subText, // Set y-axis label color to white
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                          color: '#0000ff'  // Updated color to blue
                      }
                    },
                    splitLine: {
                        show: true, // Show grid lines
                        lineStyle: {
                          type: 'dashed', // Dashed gridlines for yAxis 1 (right axis)
                          color: '#0000ff'  // Updated to blue
                      }
                    },
                    position: this.isSpeedChecked && this.isCurrentChecked ? 'right' : '', // Position the axis on the right
                    min: 0,   // Set minimum value
                    max: 360, // Set maximum value
                    interval: 90, // Set interval between tick marks
                }
                ] : []),
              ],
      
              legend: {
                data: [
                  ...(this.isSpeedChecked ? ['Current Speed'] : []),
                  ...(this.isCurrentChecked ? [ 'Current Direction'] : [])
                  ], // Make sure this matches series names
                orient: 'vertical',
                right: '15%',
                textStyle: {
                    color: subText,
                    fontSize: 14
                }
            },
            
              toolbox: {
                  // right: 10,s
                  feature: {
                      dataZoom: {
                          yAxisIndex: 'none'
                      },
                      restore: {},
                       saveAsImage: {
              backgroundColor: bgColor,
              pixelRatio: 2,
            }
                  },
                  iconStyle: {
                      borderColor: mainText
                  }
              },
              
              // dataZoom: [
              //     {
              //         type: 'slider',
              //         start: 0,
              //         end: 100
              //     },
              //     {
              //         type: 'inside'
              //     }
              // ],

              dataZoom: [
                {
                  type: 'inside',  // Enable interactive zooming
                  xAxisIndex: 0,   // Apply zooming to the x-axis (time axis)
                  filterMode: 'filter',  // Filter out of view data
                  start: 0,        // Start position for zooming (0%)
                  end: 100         // End position for zooming (100%)
                },
                {
                  type: 'slider',  // Enable zooming via a slider below the x-axis
                  height: 20,
                  xAxisIndex: 0,   // Apply slider to the x-axis
                  filterMode: 'filter', 
                  start: 0,        // Start position for zooming
                  end: 100         // End position for zooming
                },
                {
                  type: 'inside',  // Enable vertical zooming for y-axis 0 (speed)
                  yAxisIndex: 0,   // Bind zoom to the left y-axis (speed)
                  filterMode: 'filter',
                  start: 0,
                  end: 100
                },
                ...(this.isSpeedChecked && this.isCurrentChecked ? [{
                  type: 'inside',  // Enable vertical zooming for y-axis 1 (direction)
                  yAxisIndex: 1,   // Bind zoom to the right y-axis (direction)
                  filterMode: 'filter',
                  start: 0,
                  end: 100
                }] : [])
              ],
              
              series: [
                ...(this.isSpeedChecked ? [
                  {
                    name: 'Current Speed',
                    // data: this.sampleData2.map(item => [item.time, item.speed]), 
                      // data: this.sampleDataAdcp.map(item => [item.timestamp, item.current_speed]),
                      data:  dates.map((date, index) => ({ value: [date, midCurrent[index]?.split(';')[0]] })),
                    type: chartType,
                    lineStyle: {
                        normal: {
                            color: '#00ff00',  // Updated line color to green
                        }
                    },
                    itemStyle: {
                        color: '#00ff00'  // Updated item color to green
                    },
                    showSymbol: false,
                    label: {
                        show: false,
                        fontSize: 12
                    },
                    yAxisIndex: 0 // Bind to left y-axis
                }
                ] : []),

                  ...(this.isCurrentChecked ? [
                    {
                      name: 'Current Direction',
                      // data: this.sampleData.map(item => [item.time, item.direction]),
                        //  data: this.sampleDataAdcp.map(item => [item.timestamp, item.current_direction]),
                        data: dates.map((date, index) => ({ value: [date, midCurrent[index]?.split(';')[1]] })),
                      type: chartType,
                      lineStyle: {
                          normal: {
                              color: '#0000ff',  // Updated line color to blue
                              type: 'dashed'
                          }
                      },
                      itemStyle: {
                        color: '#0000ff'  // Updated item color to blue
                      },
                      showSymbol: true,
                      label: {
                          show: false,
                          fontSize: 12
                      },
                      yAxisIndex: this.isSpeedChecked && this.isCurrentChecked ? 1 : 0 // Bind to right y-axis
                  } 
                  ] : [])   
              ]
          };
      
          // Set options for the chart
          midspeedanddirection.setOption(option);
          this.loading = false;
          window.addEventListener('resize', () => {
            midspeedanddirection.resize();
          }); 
        } else {
          //console.error("Element with id 'midspeedanddirection' not found");
          this.loading = false;
        }
      }

bottomSpeedDirection(): void {
        const chartType = this.selectedChart
        this.loading = true;
        const bottom = document.getElementById('bottomSpeedDirection')!;

        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--secbackground-color').trim();
        const mainText = computedStyle.getPropertyValue('--chart-maintext').trim();
        const subText = computedStyle.getPropertyValue('--main-text').trim();

        // if(this.selectedStation.toLowerCase() == "cwprs01"){
        //   for(let i in this.cwprs01 ){
        //     const [speedStr, directionStr] = this.cwprs01[i].Lower_CurrentSpeedDirection.split(';');
      
        //     // Convert the string parts to numbers
        //     const speed = parseFloat(speedStr);
        //     const direction = parseFloat(directionStr);
        //     this.sampleData3.push(
        //      {time: this.cwprs01[i].Date,       // Assuming 'Date' holds the time value
        //       speed: speed,     // Assuming 'speed' is available in 'cwprs01'
        //       direction: direction}
        //     );
        //   }
        // }else if(this.selectedStation.toLowerCase() == "cwprs02"){
        //   for(let i in this.cwprs02 ){
        //     const [speedStr, directionStr] = this.cwprs02[i].Lower_CurrentSpeedDirection.split(';');
      
        //     // Convert the string parts to numbers
        //     const speed = parseFloat(speedStr);
        //     const direction = parseFloat(directionStr);
        //     this.sampleData3.push(
        //      {time: this.cwprs02[i].Date,       // Assuming 'Date' holds the time value
        //       speed: speed,     // Assuming 'speed' is available in 'cwprs01'
        //       direction: direction}
        //     );
        //   }
        // }

        const bottomCurrent = this.updateInit(this.bottombin, false);
        // = this.selectedStation === 'cwprs01' ? this.cwprs01.map(item => item.Lower_CurrentSpeedDirection) : 
        // this.selectedStation === 'cwprs02' ? this.cwprs02.map(item => item.Lower_CurrentSpeedDirection) : []

const dates =  this.selectedStation === 'cwprs01' ? this.cwprs01.map(item =>`${item.Date?.split('T')[0]} ${item.Time?.split('T')[1]?.split('.')[0]}`) :
this.selectedStation === 'cwprs02' ? this.cwprs02.map(item =>`${item.Date?.split('T')[0]} ${item.Time?.split('T')[1]?.split('.')[0]}`) : []
// const dates = this.cwprs01.map(item =>`${item.Date?.split('T')[0]}`);


        if (bottom) {
          const existingInstance = echarts.getInstanceByDom(bottom);
          if(existingInstance){
            existingInstance.dispose();
          }
          const bottomSpeedanddirection = echarts.init(bottom);
      
          // Prepare chart options
          const option = {
            title: {
              text: 'Bottom',  // Changed from 'Surface' to 'Low'
              left: '1%',
              textStyle: {
                color: mainText,
                fontSize: 20
              }
            },
            tooltip: {
              trigger: 'axis',
            },
            grid: {
                left: '7%',
                // right: '10%',
              bottom: '22%',
            },
            xAxis: {
              type: 'time',
              name: 'Time',
              nameLocation: 'middle',
              nameTextStyle: {
                color: mainText,
                padding: [15, 0, 0, 0],
                fontSize: 16
              },
              axisLabel: {
                color: subText
              },
              axisLine: {
                show: true
              },
              splitLine: {
                show: false
              }
            },
            yAxis: [
              ...(this.isSpeedChecked ? [{
                type: 'value',
                name: `Current speed (${this.adcpUnit})`,  // Left Y-axis title
                nameLocation: 'middle',
                nameTextStyle: {
                  color: mainText,
                  padding: [0,0,20,0],
                  fontSize: 16,
                },
                axisLabel: {
                  color: subText,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#00bfff'  // Updated to blue
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    color: '#00bfff'  // Updated to blue
                  }
                }
              }] : []),
              
              ...(this.isCurrentChecked ? [{
                type: 'value',
                name: 'Current Direction (°)',
                nameLocation: 'middle',
                nameTextStyle: {
                  color: mainText,
                  padding: 25,
                  fontSize: 16
                },
                axisLabel: {
                  color: subText,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: 'green'  // Updated to green
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: 'dashed',
                    color: 'green'  // Updated to green
                  }
                },
                position: this.isSpeedChecked && this.isCurrentChecked ? 'right' : '',
                min: 0,
                max: 360,
                interval: 90,
              }] : [])
            ],
            legend: {
              data: [
                ...(this.isSpeedChecked ? ['Current Speed'] : []),
                ...(this.isCurrentChecked ? [ 'Current Direction'] : []),
                ],
              orient: 'vertical',
              right: '15%',
              textStyle: {
                color: subText,
                fontSize: 14
              }
            },
            toolbox: {
              // right: 10,
              feature: {
                dataZoom: { yAxisIndex: 'none' },
                restore: {},
                 saveAsImage: {
              backgroundColor: bgColor,
              pixelRatio: 2,
            }
              },
              iconStyle: { borderColor: mainText }
            },
            // dataZoom: [
            //   { type: 'slider', start: 0, end: 100 },
            //   { type: 'inside' }
            // ],

            dataZoom: [
              {
                type: 'inside',  // Enable interactive zooming
                xAxisIndex: 0,   // Apply zooming to the x-axis (time axis)
                filterMode: 'filter',  // Filter out of view data
                start: 0,        // Start position for zooming (0%)
                end: 100         // End position for zooming (100%)
              },
              {
                type: 'slider',  // Enable zooming via a slider below the x-axis
                height: 20,
                xAxisIndex: 0,   // Apply slider to the x-axis
                filterMode: 'filter', 
                start: 0,        // Start position for zooming
                end: 100         // End position for zooming
              },
              {
                type: 'inside',  // Enable vertical zooming for y-axis 0 (speed)
                yAxisIndex: 0,   // Bind zoom to the left y-axis (speed)
                filterMode: 'filter',
                start: 0,
                end: 100
              },
              ...(this.isSpeedChecked && this.isCurrentChecked ? [{
                type: 'inside',  // Enable vertical zooming for y-axis 1 (direction)
                yAxisIndex: 1,   // Bind zoom to the right y-axis (direction)
                filterMode: 'filter',
                start: 0,
                end: 100
              }] : [])
            ],

            series: [
              ...(this.isSpeedChecked ? [{
                name: 'Current Speed',
                // data: this.sampleData3.map(item => [item.time, item.speed]),
                //  data: this.sampleDataAdcp.map(item => [item.timestamp, item.current_speed]),
                data:  dates.map((date, index) => ({ value: [date, bottomCurrent[index]?.split(';')[0]] })),                   
                type: chartType,
                lineStyle: { normal: { color: '#00bfff' } },  // Updated to blue
                itemStyle: { color: '#00bfff' },  // Updated to blue
                showSymbol: false,
                label: { show: false, fontSize: 12 },
                yAxisIndex: 0
              }] : []),

              ...(this.isCurrentChecked ? [
                {
                  name: 'Current Direction',
                  // data: this.sampleData3.map(item => [item.time, item.direction]),
                    //  data: this.sampleDataAdcp.map(item => [item.timestamp, item.current_direction]),
                    data: dates.map((date, index) => ({ value: [date, bottomCurrent[index]?.split(';')[1]] })),
                  type: chartType,
                  lineStyle: { normal: { color: 'green', type: 'dashed' } },  // Updated to green
                  itemStyle: { color: 'green' },  // Updated to green
                  showSymbol: true,
                  label: { show: false, fontSize: 12 },
                  yAxisIndex: this.isSpeedChecked && this.isCurrentChecked ? 1 : 0
                }
              ] : [])              
            ]
          };
      
          // Set options for the chart
          bottomSpeedanddirection.setOption(option);
          this.loading = false;
          window.addEventListener('resize', () => {
            bottomSpeedanddirection.resize();
          });
        } else {
          //console.error("Element with id 'bottomSpeedanddirection' not found");
          this.loading = false;
        }
      }


      surfacepolar(): void {
        const chartType = this.selectedChart;
        this.loading = true;
        const polar1 = document.getElementById('surfacepolar')!;

        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--secbackground-color').trim();
        const mainText = computedStyle.getPropertyValue('--chart-maintext').trim();
        const subText = computedStyle.getPropertyValue('--main-text').trim();
        const text = computedStyle.getPropertyValue('--text-color').trim();
      
          const surfaceCurrent = this.selectedStation === 'cwprs01'
          ? this.cwprs01.map(item => item.S2_SurfaceCurrentSpeedDirection)
          : this.selectedStation === 'cwprs02'
          ? this.cwprs02.map(item => item.S2_SurfaceCurrentSpeedDirection)
          : [];
      
          const surfacePolar = surfaceCurrent.map((data) => {
            const [speed, direction] = data.split(';').map(Number);
            return {speed , direction};
          });

          const directionLabels = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
          const speedCategories = ['<0.5 m/s', '0.5-2 m/s', '2-4 m/s', '4-6 m/s', '6-8 m/s', '>8 m/s'] as const;
          
          const speedColors = ['#0000FF', '#3399FF', '#66CCFF', '#FFFF66', '#FF9933', '#FF3300'];  // Blue to red gradient
          
          // Type for speed categories
          type SpeedCategory = typeof speedCategories[number];
          
          // Type for direction bins with each speed category as a key
          type DirectionBin = Record<SpeedCategory, number>;
          
          // Function to bin speeds
          function categorizeSpeed(speed: number): SpeedCategory {
              if (speed < 0.5) return '<0.5 m/s';
              if (speed < 2) return '0.5-2 m/s';
              if (speed < 4) return '2-4 m/s';
              if (speed < 6) return '4-6 m/s';
              if (speed < 8) return '6-8 m/s';
              return '>8 m/s';
          }
          
          // Initialize bins
          const dataBins:  DirectionBin[] = directionLabels.map(() => ({
              '<0.5 m/s': 0,
              '0.5-2 m/s': 0,
              '2-4 m/s': 0,
              '4-6 m/s': 0,
              '6-8 m/s': 0,
              '>8 m/s': 0
          }));
          
          // Map directions to labels and fill dataBins with counts
          surfacePolar.forEach(({ speed, direction }) => {
              const directionIndex = Math.round(direction / 22.5) % 16;
              const speedCategory = categorizeSpeed(speed);
              dataBins[directionIndex][speedCategory] += 1;
          });
          
          // Extract data for each speed category to use in series
          const seriesData = speedCategories.map((speedCategory, index) => ({
            name: speedCategory,
            type: 'bar',
            stack: 'wind-speed',
            coordinateSystem: 'polar',
            data: dataBins.map(bin => bin[speedCategory]),
            itemStyle: {
              color: speedColors[index]  // Assign color based on speed range
            }
          }));
      
            
        if (polar1) {
          const existingInstance = echarts.getInstanceByDom(polar1);
          if (existingInstance) {
            existingInstance.dispose();
          }
          const windRoseChart1 = echarts.init(polar1);
      
      // Set up the chart options
      const option = {
        // backgroundColor: bgColor,
        title: {
          text: 'Surface',  // Changed from 'Surface' to 'Low'
          // left: '1%',
          top: '18%',
          textStyle: {
            color: mainText,
            fontSize: 20,
          },
        },
          
          polar: {},
          angleAxis: {
              type: 'category',
              data: directionLabels,
              boundaryGap: true,
              startAngle: 100,
              axisLabel: {
                color: subText // White axis labels
              },
              splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.1)', 'rgba(200, 200, 200, 0.1)']
                },
                axisLine: {
                  lineStyle: {
                    color: subText 
                  }
                },
            },
             splitLine: {
                  show: true,
                  lineStyle: {
                      color: subText,
                      // type: 'solid'
                  }
              }
          },
          radiusAxis: {
              min: 0,
              axisLine: {
                lineStyle: {
                  color: subText // White radius axis line
                }
              },
              axisLabel: {
                color: subText,
                  formatter: '{value}'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: text,
                  type: 'dashed'
                }
              }
          },
          tooltip: {
              trigger: 'item',
              formatter: '{a}: {c}',
             
          },
        //   toolbox: {
        //     bottom: 0,
        //     left:0,
        //     feature: {
        //         dataZoom: {
        //             yAxisIndex: 'none'
        //         },
        //         restore: {},
        //          saveAsImage: {
        //       backgroundColor: bgColor,
        //       pixelRatio: 2,
        //     }
        //     },
        //     iconStyle: {
        //         borderColor: mainText
        //     }
        // },

        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            }
        ],
          series: seriesData,
          animationDuration: 1000
      };
      
      // Render the chart and handle resizing
      windRoseChart1.setOption(option);
       //console.table(dataBins);
      
      this.loading = false;
      window.addEventListener('resize', () => windRoseChart1.resize());
      } else {
       this.loading = false;
      }
      }
      
      midpolar(): void {
        const chartType = this.selectedChart;
        this.loading = true;
        const polar2 = document.getElementById('midpolar')!;

        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--secbackground-color').trim();
        const mainText = computedStyle.getPropertyValue('--chart-maintext').trim();
        const subText = computedStyle.getPropertyValue('--main-text').trim();
        const text = computedStyle.getPropertyValue('--text-color').trim();
        
      
       
          // Real-time data: Fetch and parse speed and direction
          const midCurrent = this.selectedStation === 'cwprs01'
          ? this.cwprs01.map(item => item.Middle_CurrentSpeedDirection)
          : this.selectedStation === 'cwprs02'
          ? this.cwprs02.map(item => item.Middle_CurrentSpeedDirection)
          : [];
      
          const midPolar = midCurrent.map((data) => {
            const [speed, direction] = data.split(';').map(Number);
            return {speed , direction};
          });
      
      
      
        if (polar2) {
          const existingInstance = echarts.getInstanceByDom(polar2);
          if (existingInstance) {
            existingInstance.dispose();
          }
          const windRoseChart1 = echarts.init(polar2);
      
      const directionLabels = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const speedCategories = ['<0.5 m/s', '0.5-2 m/s', '2-4 m/s', '4-6 m/s', '6-8 m/s', '>8 m/s'] as const;
      
      const speedColors = ['#0000FF', '#3399FF', '#66CCFF', '#FFFF66', '#FF9933', '#FF3300'];  // Blue to red gradient
      
      // Type for speed categories
      type SpeedCategory = typeof speedCategories[number];
      
      // Type for direction bins with each speed category as a key
      type DirectionBin = Record<SpeedCategory, number>;
      
      // Function to bin speeds
      function categorizeSpeed(speed: number): SpeedCategory {
          if (speed < 0.5) return '<0.5 m/s';
          if (speed < 2) return '0.5-2 m/s';
          if (speed < 4) return '2-4 m/s';
          if (speed < 6) return '4-6 m/s';
          if (speed < 8) return '6-8 m/s';
          return '>8 m/s';
      }
      
      // Initialize bins
      const dataBins:  DirectionBin[] = directionLabels.map(() => ({
          '<0.5 m/s': 0,
          '0.5-2 m/s': 0,
          '2-4 m/s': 0,
          '4-6 m/s': 0,
          '6-8 m/s': 0,
          '>8 m/s': 0
      }));
      
      // Map directions to labels and fill dataBins with counts
      midPolar.forEach(({ speed, direction }) => {
          const directionIndex = Math.round(direction / 22.5) % 16;
          const speedCategory = categorizeSpeed(speed);
          dataBins[directionIndex][speedCategory] += 1;
      });
      
      // Extract data for each speed category to use in series
      const seriesData = speedCategories.map((speedCategory, index) => ({
        name: speedCategory,
        type: 'bar',
        stack: 'wind-speed',
        coordinateSystem: 'polar',
        data: dataBins.map(bin => bin[speedCategory]),
        itemStyle: {
          color: speedColors[index]  // Assign color based on speed range
        }
      }));
      
      // Set up the chart options
      const option = {
        title: {
          text: 'Mid',  // Changed from 'Surface' to 'Low'
          // left: '1%',
          top: '18%',
          textStyle: {
            color: mainText,
            fontSize: 20
          }
        },
          polar: {},
          angleAxis: {
              type: 'category',
              data: directionLabels,
              boundaryGap: true,
              startAngle: 100,
              axisLabel: {
                color: subText // White axis labels
              },
              splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.1)', 'rgba(200, 200, 200, 0.1)']
                },
                axisLine: {
                  lineStyle: {
                    color: subText 
                  }
                },
            },
             splitLine: {
                  show: true,
                  lineStyle: {
                      color: subText,
                      type: 'solid'
                  }
              }
          },
          radiusAxis: {
              min: 0,
              axisLine: {
                lineStyle: {
                  color: subText // White radius axis line
                }
              },
              axisLabel: {
                color: subText,
                  formatter: '{value}'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: text,
                  type: 'dashed'
                }
              }
          },
          tooltip: {
              trigger: 'item',
              formatter: '{a}: {c}',
             
          },
        //   toolbox: {
        //     bottom: 0,
        //     left: 0,
        //     feature: {
        //         dataZoom: {
        //             yAxisIndex: 'none'
        //         },
        //         restore: {},
        //          saveAsImage: {
        //       backgroundColor: bgColor,
        //       pixelRatio: 2,
        //     }
        //     },
        //     iconStyle: {
        //         borderColor: mainText
        //     }
        // },

        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            }
        ],
          series: seriesData,
          animationDuration: 1000
      };
      
      // Render the chart and handle resizing
      windRoseChart1.setOption(option);
 
      //console.table(dataBins);
      
      this.loading = false;
      window.addEventListener('resize', () => windRoseChart1.resize());
      } else {
      //console.error("Element with id 'rose-plot' not found");
      this.loading = false;
      }
      }
      
      bottompolar(): void {
        const chartType = this.selectedChart;
        this.loading = true;
        const polar3 = document.getElementById('bottompolar')!;

    const computedStyle = getComputedStyle(document.body);
    const bgColor = computedStyle.getPropertyValue('--secbackground-color').trim();
    const mainText = computedStyle.getPropertyValue('--chart-maintext').trim();
    const subText = computedStyle.getPropertyValue('--main-text').trim();
    const text = computedStyle.getPropertyValue('--text-color').trim();
        
      
          // Real-time data: Fetch and parse speed and direction
          const surfaceCurrent = this.selectedStation === 'cwprs01'
          ? this.cwprs01.map(item => item.Lower_CurrentSpeedDirection)
          : this.selectedStation === 'cwprs02'
          ? this.cwprs02.map(item => item.Lower_CurrentSpeedDirection)
          : [];
      
          const bottomPolar = surfaceCurrent.map((data) => {
            const [speed, direction] = data.split(';').map(Number);
            return {speed , direction};
          });
      
      
      
        if (polar3) {
          const existingInstance = echarts.getInstanceByDom(polar3);
          if (existingInstance) {
            existingInstance.dispose();
          }
          const windRoseChart1 = echarts.init(polar3);
      
      const directionLabels = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const speedCategories = ['<0.5', '0.5-2', '2-4', '4-6', '6-8', '>8'] as const;
      
      const speedColors = ['#0000FF', '#3399FF', '#66CCFF', '#FFFF66', '#FF9933', '#FF3300'];  // Blue to red gradient
      
      // Type for speed categories
      type SpeedCategory = typeof speedCategories[number];
      
      // Type for direction bins with each speed category as a key
      type DirectionBin = Record<SpeedCategory, number>;
      
      // Function to bin speeds
      function categorizeSpeed(speed: number): SpeedCategory {
          if (speed < 0.5) return '<0.5';
          if (speed < 2) return '0.5-2';
          if (speed < 4) return '2-4';
          if (speed < 6) return '4-6';
          if (speed < 8) return '6-8';
          return '>8';
      }
      
      // Initialize bins
      const dataBins:  DirectionBin[] = directionLabels.map(() => ({
          '<0.5': 0,
          '0.5-2': 0,
          '2-4': 0,
          '4-6': 0,
          '6-8': 0,
          '>8': 0
      }));
      
      // Map directions to labels and fill dataBins with counts
      bottomPolar.forEach(({ speed, direction }) => {
          const directionIndex = Math.round(direction / 22.5) % 16;
          const speedCategory = categorizeSpeed(speed);
          dataBins[directionIndex][speedCategory] += 1;
      });
      
      // Extract data for each speed category to use in series
      const seriesData = speedCategories.map((speedCategory, index) => ({
        name: speedCategory,
        type: 'bar',
        stack: 'wind-speed',
        coordinateSystem: 'polar',
        data: dataBins.map(bin => bin[speedCategory]),
        itemStyle: {
          color: speedColors[index]  // Assign color based on speed range
        }
      }));
      
      // Set up the chart options
      const option = {
        title: {
          text: 'Bottom',  // Changed from 'Surface' to 'Low'
          // left: '1%',
          top: '18%',
          textStyle: {
            color: mainText,
            fontSize: 20
          }
        },
          legend: {
            data: speedCategories,
            top: 10,
            right: 0,
            orient: 'vertical', 
            textStyle: {
              color: subText, // White legend text
              fontSize: 12,
            }        
        },
          polar: {},
          angleAxis: {
              type: 'category',
              data: directionLabels,
              boundaryGap: true,
              startAngle: 100,
              axisLabel: {
                color: subText
              },
              splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.1)', 'rgba(200, 200, 200, 0.1)']
                },
                axisLine: {
                  lineStyle: {
                    color: subText 
                  }
                },
            },
             splitLine: {
                  show: true,
                  lineStyle: {
                      color: subText,
                      type: 'solid'
                  }
              }
          },
          radiusAxis: {
              min: 0,
              axisLine: {
                lineStyle: {
                  color: subText // White radius axis line
                }
              },
              axisLabel: {
                color: subText,
                  formatter: '{value}'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: text,
                  type: 'dashed'
                }
              }
          },
          tooltip: {
              trigger: 'item',
              formatter: '{a}: {c}',
             
          },
          series: seriesData
      };
      
      // Render the chart and handle resizing
      windRoseChart1.setOption(option);

      //console.table(dataBins);
      
      this.loading = false;
      window.addEventListener('resize', () => windRoseChart1.resize());
      } else {
      //console.error("Element with id 'rose-plot' not found");
      this.loading = false;
      }
      }
      
}    