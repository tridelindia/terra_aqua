import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, } from '@angular/common/http';
 
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
 
import { StationService, buoys, BuoyData} from '../station_service/station.service';
 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
 
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { is } from '@amcharts/amcharts4/core';
// import { Config } from 'ol/source/TileJSON';
import { get } from 'http';
import { ConfigDataService } from '../config-data.service';
import { Config, SensorData } from '../../model/config.model';
import { response } from 'express';
import { LayoutComponent } from '../layout/layout.component';
 
 
interface Column {
    field: string;
    header: string;
}
interface conf{
  bin: string;
  name:string;
  show:boolean
}
 
@Component({
  selector: 'app-reports',
  standalone: true,
  imports:[FormsModule, CommonModule, TableModule, MultiSelectModule, CalendarModule, DropdownModule, HttpClientModule ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers:[StationService]
})
export class ReportsComponent implements OnInit {
 
  searchQuery: string = '';
 
  selectedStation: string = 'CWPRS01';
  selectedPeriod: string = 'dateRange';
  periodOptions = [
    { label: 'Daily', value: 'dateRange' },
    { label: 'Weekly', value: 'weekRange' },
    { label: 'Monthly', value: 'monthRange' },
    { label: 'Yearly', value: 'yearRange' }
];
 
exportOptions = [
  { label: 'Export to CSV', value: 'csv' },
  { label: 'Export to Excel', value: 'excel' },
  { label: 'Export to PDF', value: 'pdf' }
];
 
    cols: Column[] = [];
    selectedColumns: Column[] = [];
 
    fromDate =new Date();
    toDate = new Date();
    selectedWeek =new Date();
    selectedMonth =new Date();
    selectedYear =new Date();
 
    CWPRS01: BuoyData[] = [];
    CWPRS02: BuoyData[] = [];
 
    loading: boolean = false;
 
    constructor(private stationService: StationService, private http:HttpClient, private cd: ChangeDetectorRef , private dataCOnfig:ConfigDataService, private layout:LayoutComponent) {}
  configsData:Config[]= [];
  binsDAta:conf[]=[];
    getconfigs(){
    this.dataCOnfig.getsensorConfigs().subscribe(sensor=>{
     console.log("sensor Config: ", sensor);
     this.configsData = sensor;
     const data  = JSON.parse(this.configsData[1].e_bins);
      console.log(data);
      this.binsDAta = data;
     
      const ibin = this.configsData[1].bins.split(',');
      console.log("BinNames", this.binsDAta, ibin);
      const sampleBinsname = ['Surface Speed', ]
      // for(let i=0; i<ibin.length; i++){
        this.cols.push(
          {field:ibin[0].toLowerCase()==='profile1'? "SurfaceSpeed" :`${ibin[0].toLowerCase()}Speed`, header:'Surface Speed'},
          { field:ibin[0].toLowerCase()==='profile1'?"SurfaceDirection": `${ibin[0].toLowerCase()}Direction`, header: 'Surface Direction' },
        );
        this.cols.push(
          {field:ibin[1].toLowerCase()==='profile2'? "MiddleSpeed" :`${ibin[1].toLowerCase()}Speed`, header:'Mid Speed'},
          { field:ibin[1].toLowerCase()==='profile2'? "MiddleDirection" : `${ibin[1].toLowerCase()}Direction`, header: 'Mid Direction' },
        );
        this.cols.push(
          {field:ibin[2].toLowerCase()==='profile3'? "LowerSpeed" :`${ibin[2].toLowerCase()}Speed`, header:'Bottom Speed'},
          { field:ibin[2].toLowerCase()==='profile3'? "LowerDirection" : `${ibin[2].toLowerCase()}Direction`, header: 'Bottom Direction' },
        )
      // }

      // for(let i=0; i<ibin.length; i++){
      //   if(ibin[i].toLowerCase() == 'profile1'){
        //   this.cols.push(
        //     { field: 'SurfaceSpeed', header: 'Surface Speed' },
        // { field: 'SurfaceDirection', header: 'Surface Direction' },
        // { field: 'MiddleSpeed', header: 'Mid Speed' },
        // { field: 'MiddleDirection', header: 'Mid Direction' },
        // { field: 'LowerSpeed', header: 'Bottom Speed' },
        // { field: 'LowerDirection', header: 'Bottom Direction' },
        //   )
      //   }else if(ibin[i].toLowerCase() == 'profile2'){
      //     this.cols.push(
      //     { field: 'MiddleSpeed', header: 'Mid Speed' },
      //   { field: 'MiddleDirection', header: 'Mid Direction' },
      //     )
      //   }else if(ibin[i].toLowerCase() == 'profile3'){
      //     this.cols.push(
      //       { field: 'LowerSpeed', header: 'Bottom Speed' },
      //   { field: 'LowerDirection', header: 'Bottom Direction' },
      //     )
      //   }else{
      //     this.cols.push({
      //       field:`${ibin[i].toLowerCase()}speed`,
      //       header:`${ibin[i].toLowerCase()}speed`
      //     },
      //     {
      //       field:`${ibin[i].toLowerCase()}direction`,
      //       header:`${ibin[i].toLowerCase()}direction`
      //     })
      //   }
        
      // }
      for(let i=0; i<this.binsDAta.length;i++){
        if(this.binsDAta[i].bin.toLowerCase() == 'profile1'){
          this.cols.push(
            { field: 'SurfaceSpeed', header: `${this.binsDAta[i].name}Speed` },
        { field: 'SurfaceDirection', header: `${this.binsDAta[i].name}Direction` },
          )
        }else if(this.binsDAta[i].bin.toLowerCase() == 'profile2'){
          console.log("bin2 is checked its yes");
          this.cols.push(
          { field: 'MiddleSpeed', header: `${this.binsDAta[i].name}Speed` },
        { field: 'MiddleDirection', header: `${this.binsDAta[i].name}Direction` },
          )
        }else if(this.binsDAta[i].bin.toLowerCase() == 'profile3'){
          this.cols.push(
            { field: 'LowerSpeed', header: `${this.binsDAta[i].name}Speed` },
        { field: 'LowerDirection', header: `${this.binsDAta[i].name}Direction` },
          )
        }else{
          if(this.binsDAta[i].show){
            this.cols.push(
             
          {
              field: `${this.binsDAta[i].bin.toLowerCase()}Speed`,
              header: `${this.binsDAta[i].name}Speed`
          },
          {
            field:`${this.binsDAta[i].bin.toLowerCase()}Direction`,
            header:`${this.binsDAta[i].name}Direction`
          })
          }

          console.log("columns==>",this.cols);
        }
        
        
      }
    })
  }

    ngOnInit(): void {
    this.layout.page = 'Reports';
      this.getconfigs();
      this.cols = [
        { field: 'S1_RelativeWaterLevel', header: 'Water Level' },
        // { field: 'SurfaceSpeed', header: 'Surface Speed' },
        // { field: 'SurfaceDirection', header: 'Surface Direction' },
        // { field: 'MiddleSpeed', header: 'Mid Speed' },
        // { field: 'MiddleDirection', header: 'Mid Direction' },
        // { field: 'LowerSpeed', header: 'Bottom Speed' },
        // { field: 'LowerDirection', header: 'Bottom Direction' },
        // { field: 'bin4', header: "AVCS"},
        // { field: 'bin5', header: "bin5"},
        // { field: 'bin6', header: "bin6"},
        // { field: 'bin7', header: "bin7"},
        // { field: 'bin8', header: "bin8"},
        // { field: 'bin9', header: "bin9"},
        // { field: 'bin10', header: "bin10"},
        

    ];
    // for(let i=0; i<this.binsDAta.length; i++){
    //   this.cols.push({field: this.binsDAta[i].bin.toLowerCase()})
    // }
    
    this.selectedColumns = this.cols;
    this.fromDate.setHours(0, 0, 0, 0);
    this.fetchStations();
    this.getStationNames()
    this.dataCOnfig.getsensorConfigs().subscribe(sensors=>{
      console.log("sensors config:",sensors[0].value);
      this.tide_offset = sensors[0].value;
     
      // calculateResult(wateS1 , this.tide_offset)
    })
  }
tide_offset!:string;

  calculateResult(existingData: string, newData: string | number): string {
    let result: number;
  
    // Check if newData is a number
    if (typeof newData === 'number') {
      result = parseFloat(existingData) + newData;
    } 
    // If newData is a string, handle signs
    else if (typeof newData === 'string') {
      if (newData.startsWith('-')) {
        result = parseFloat(existingData) - parseFloat(newData); // Subtract if "-"
      } else {
        result = parseFloat(existingData) + parseFloat(newData); // Add for "+" or no sign
      }
    } 
    // Handle unexpected input
    else {
      return existingData.toString();
    }
  
    // Limit the result to 2 decimal places
    return parseFloat(result.toFixed(2)).toString();
  }
staionName1!:string ;
staionName2!:string ;
nameOfStation!:string;
  getStationNames(){
    this.dataCOnfig.getStationNames().subscribe(response =>{
      console.log("station namez",response);
      this.staionName1 = response[0].station;
      this.staionName2 = response[1].station;
      this.nameOfStation = response[0].station;
      console.log("1 is ==", this.staionName1,  "2nd is==", this.staionName2,  "final ==", this.nameOfStation);
    })
  }
 
  onExportOptionSelect(event: any, dt2: any) {
    const selectedOption = event.value;
    switch (selectedOption) {
      case 'csv':
        this.exportCSV(dt2);
        break;
      case 'excel':
        this.exportExcel(dt2);
        break;
      case 'pdf':
        this.exportPDF(dt2);
        break;
      default:
        break;
    }
  }
 
  // private formatToUTC(date: Date): string {
  //   const utcDate = new Date(date.getTime() - (5.5 * 60 * 60 * 1000));
  //   return utcDate.toISOString();
  // }
 
  private toISTISOString(date: Date): string {
    const offsetMilliseconds = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + offsetMilliseconds);
    istDate.setSeconds(0, 0);
    return istDate.toISOString().slice(0, -1); // Removing the 'Z' at the end
}
 
  fetchStations() {
    this.loading = true;
    let formattedFromDate: string | null = null;
    let formattedToDate: string | null = null;
 
        // Defaulting fromDate and toDate to current date at 00:00
        let fromDate = this.fromDate || new Date();
        let toDate = this.toDate || new Date();
   
        // Set both fromDate and toDate to midnight if not already set
        // fromDate.setHours(0, 0, 0, 0);
 
    if (!this.selectedPeriod) {
      // One-day range (same date for from and to with time included)
      formattedFromDate = this.toISTISOString(fromDate);
      formattedToDate = this.toISTISOString(toDate);
 
      // formattedFromDate = this.fromDate.toISOString();
      // formattedToDate = this.toDate.toISOString();
    } else {
      // Format based on selected period
      switch (this.selectedPeriod) {
        case 'dateRange':
          formattedFromDate = this.fromDate ? this.toISTISOString(this.fromDate) : this.toISTISOString(fromDate);
          formattedToDate = this.toDate ? this.toISTISOString(this.toDate) : this.toISTISOString(toDate);
          break;
          // formattedFromDate = this.fromDate ? this.fromDate.toISOString() : null;
          // formattedToDate = this.toDate ? this.toDate.toISOString() : null;  
          // break;
 
        case 'weekRange':
          if (this.selectedWeek) {
            // Create a new Date object based on selectedWeek and set hours to 00:00:00
            const startOfWeek = new Date(this.selectedWeek);
            startOfWeek.setHours(0, 0, 0, 0);
            formattedFromDate = this.toISTISOString(startOfWeek);
 
            // Get the week end date and set it to 23:59:59
            const weekEndDate = this.getWeekEndDate(this.selectedWeek);
            formattedToDate = this.toISTISOString(weekEndDate);
          } else {
            formattedFromDate = null;
            formattedToDate = null;
          }
          break;
 
        case 'monthRange':
          formattedFromDate = this.selectedMonth ?
            `${this.selectedMonth.getFullYear()}-${(this.selectedMonth.getMonth() + 1).toString().padStart(2, '0')}-01T00:00:00` :
            null;
          const monthEndDate = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 0);
          formattedToDate = monthEndDate ? `${monthEndDate.toISOString().split('T')[0]}T23:59:59` : null;
          break;
 
        case 'yearRange':
          const year = this.selectedYear.getFullYear();
          formattedFromDate = `${year}-01-01T00:00:00`;
          formattedToDate = `${year}-12-31T23:59:59`;
          break;
 
        default:
          // Handle invalid or no period selected
          break;
      }
    }
 
    console.log(`Formatted report From Date: ${formattedFromDate}, Formatted report To Date: ${formattedToDate}`);
 
   
    this.stationService.getSensorssTime(formattedFromDate!, formattedToDate!).subscribe(
      (data: buoys) => {
        console.log("live Data====", data);
         this.CWPRS01 = data.buoy1.map(buoy => ({
          ...buoy,
          S1_RelativeWaterLevel:this.calculateResult(buoy.S1_RelativeWaterLevel, this.tide_offset),
          SurfaceSpeed: buoy.S2_SurfaceCurrentSpeedDirection?.split(';')[0],
          SurfaceDirection: buoy.S2_SurfaceCurrentSpeedDirection?.split(';')[1],
          MiddleSpeed: buoy.Middle_CurrentSpeedDirection?.split(';')[0],
          MiddleDirection: buoy.Middle_CurrentSpeedDirection?.split(';')[1],
          LowerSpeed: buoy.Lower_CurrentSpeedDirection?.split(';')[0],
          LowerDirection: buoy.Lower_CurrentSpeedDirection?.split(';')[1],
          profile4Speed:buoy.profile4.split(';')[0],
          profile4Direction:buoy.profile4.split(';')[1],
          profile5Speed:buoy.profile5.split(';')[0],
          profile5Direction:buoy.profile5.split(';')[1],
          profile6Speed:buoy.profile6.split(';')[0],
          profile6Direction:buoy.profile6.split(';')[1],
          profile7Speed:buoy.profile7.split(';')[0],
          profile7Direction:buoy.profile7.split(';')[1],
          profile8Speed:buoy.profile8.split(';')[0],
          profile8Direction:buoy.profile8.split(';')[1],
          profile9Speed:buoy.profile9.split(';')[0],
          profile9Direction:buoy.profile9.split(';')[1],
          profile10Speed:buoy.profile10.split(';')[0],
          profile10Direction:buoy.profile10.split(';')[1],
          profile11Speed:buoy.profile11.split(';')[0],
          profile11Direction:buoy.profile11.split(';')[1],
          profile12Speed:buoy.profile12.split(';')[0],
          profile12Direction:buoy.profile12.split(';')[1],
          profile13Speed:buoy.profile13.split(';')[0],
          profile13Direction:buoy.profile13.split(';')[1],
          profile14Speed:buoy.profile14.split(';')[0],
          profile14Direction:buoy.profile14.split(';')[1],
          profile15Speed:buoy.profile15.split(';')[0],
          profile15Direction:buoy.profile15.split(';')[1],
          profile16Speed:buoy.profile16.split(';')[0],
          profile16Direction:buoy.profile16.split(';')[1],
          profile17Speed:buoy.profile17.split(';')[0],
          profile17Direction:buoy.profile17.split(';')[1],
          profile18Speed:buoy.profile18.split(';')[0],
          profile18Direction:buoy.profile18.split(';')[1],
          profile19Speed:buoy.profile19.split(';')[0],
          profile19Direction:buoy.profile19.split(';')[1],
          profile20Speed:buoy.profile20.split(';')[0],
          profile20Direction:buoy.profile20.split(';')[1],
          profile21Speed:buoy.profile21.split(';')[0],
          profile21Direction:buoy.profile21.split(';')[1],
          profile22Speed:buoy.profile22.split(';')[0],
          profile22Direction:buoy.profile22.split(';')[1],
          profile23Speed:buoy.profile23.split(';')[0],
          profile23Direction:buoy.profile23.split(';')[1],
          profile24Speed:buoy.profile24.split(';')[0],
          profile24Direction:buoy.profile24.split(';')[1],
          profile25Speed:buoy.profile25.split(';')[0],
          profile25Direction:buoy.profile25.split(';')[1],
          profile26Speed:buoy.profile26.split(';')[0],
          profile26Direction:buoy.profile26.split(';')[1],
          profile27Speed:buoy.profile27.split(';')[0],
          profile27Direction:buoy.profile27.split(';')[1],
          profile28Speed:buoy.profile28.split(';')[0],
          profile28Direction:buoy.profile28.split(';')[1],
          profile29Speed:buoy.profile29.split(';')[0],
          profile29Direction:buoy.profile29.split(';')[1],
          profile30Speed:buoy.profile30.split(';')[0],
          profile30Direction:buoy.profile30.split(';')[1],
          profile31Speed:buoy.profile31.split(';')[0],
          profile31Direction:buoy.profile31.split(';')[1],
          profile32Speed:buoy.profile32.split(';')[0],
          profile32Direction:buoy.profile32.split(';')[1],
          profile33Speed:buoy.profile33.split(';')[0],
          profile33Direction:buoy.profile33.split(';')[1],
          profile34Speed:buoy.profile34.split(';')[0],
          profile34Direction:buoy.profile34.split(';')[1],
          profile35Speed:buoy.profile35.split(';')[0],
          profile35Direction:buoy.profile35.split(';')[1],
          profile36Speed:buoy.profile36.split(';')[0],
          profile36Direction:buoy.profile36.split(';')[1],
          profile37Speed:buoy.profile37.split(';')[0],
          profile37Direction:buoy.profile37.split(';')[1],
          profile38Speed:buoy.profile38.split(';')[0],
          profile38Direction:buoy.profile38.split(';')[1],
          profile39Speed:buoy.profile39.split(';')[0],
          profile39Direction:buoy.profile39.split(';')[1],
          profile40Speed:buoy.profile40.split(';')[0],
          profile40Direction:buoy.profile40.split(';')[1],
          



          
        }));
        this.CWPRS02 = data.buoy2.map(buoy => ({
          ...buoy,
          S1_RelativeWaterLevel:this.calculateResult(buoy.S1_RelativeWaterLevel, this.tide_offset),
          SurfaceSpeed: buoy.S2_SurfaceCurrentSpeedDirection?.split(';')[0],
          SurfaceDirection: buoy.S2_SurfaceCurrentSpeedDirection?.split(';')[1],
          MiddleSpeed: buoy.Middle_CurrentSpeedDirection?.split(';')[0],
          MiddleDirection: buoy.Middle_CurrentSpeedDirection?.split(';')[1],
          LowerSpeed: buoy.Lower_CurrentSpeedDirection?.split(';')[0],
          LowerDirection: buoy.Lower_CurrentSpeedDirection?.split(';')[1],
          profile4Speed:buoy.profile4.split(';')[0],
          profile4Direction:buoy.profile4.split(';')[1],
          profile5Speed:buoy.profile5.split(';')[0],
          profile5Direction:buoy.profile5.split(';')[1],
          profile6Speed:buoy.profile6.split(';')[0],
          profile6Direction:buoy.profile6.split(';')[1],
          profile7Speed:buoy.profile7.split(';')[0],
          profile7Direction:buoy.profile7.split(';')[1],
          profile8Speed:buoy.profile8.split(';')[0],
          profile8Direction:buoy.profile8.split(';')[1],
          profile9Speed:buoy.profile9.split(';')[0],
          profile9Direction:buoy.profile9.split(';')[1],
          profile10Speed:buoy.profile10.split(';')[0],
          profile10Direction:buoy.profile10.split(';')[1],
          profile11Speed:buoy.profile11.split(';')[0],
          profile11Direction:buoy.profile11.split(';')[1],
          profile12Speed:buoy.profile12.split(';')[0],
          profile12Direction:buoy.profile12.split(';')[1],
          profile13Speed:buoy.profile13.split(';')[0],
          profile13Direction:buoy.profile13.split(';')[1],
          profile14Speed:buoy.profile14.split(';')[0],
          profile14Direction:buoy.profile14.split(';')[1],
          profile15Speed:buoy.profile15.split(';')[0],
          profile15Direction:buoy.profile15.split(';')[1],
          profile16Speed:buoy.profile16.split(';')[0],
          profile16Direction:buoy.profile16.split(';')[1],
          profile17Speed:buoy.profile17.split(';')[0],
          profile17Direction:buoy.profile17.split(';')[1],
          profile18Speed:buoy.profile18.split(';')[0],
          profile18Direction:buoy.profile18.split(';')[0],
          profile19Speed:buoy.profile19.split(';')[0],
          profile19Direction:buoy.profile19.split(';')[1],
          profile20Speed:buoy.profile20.split(';')[0],
          profile20Direction:buoy.profile20.split(';')[1],
          profile21Speed:buoy.profile21.split(';')[0],
          profile21Direction:buoy.profile21.split(';')[1],
          profile22Speed:buoy.profile22.split(';')[0],
          profile22Direction:buoy.profile22.split(';')[1],
          profile23Speed:buoy.profile23.split(';')[0],
          profile23Direction:buoy.profile23.split(';')[1],
          profile24Speed:buoy.profile24.split(';')[0],
          profile24Direction:buoy.profile24.split(';')[1],
          profile25Speed:buoy.profile25.split(';')[0],
          profile25Direction:buoy.profile25.split(';')[1],
          profile26Speed:buoy.profile26.split(';')[0],
          profile26Direction:buoy.profile26.split(';')[1],
          profile27Speed:buoy.profile27.split(';')[0],
          profile27Direction:buoy.profile27.split(';')[1],
          profile28Speed:buoy.profile28.split(';')[0],
          profile28Direction:buoy.profile28.split(';')[1],
          profile29Speed:buoy.profile29.split(';')[0],
          profile29Direction:buoy.profile29.split(';')[1],
          profile30Speed:buoy.profile30.split(';')[0],
          profile30Direction:buoy.profile30.split(';')[1],
          profile31Speed:buoy.profile31.split(';')[0],
          profile31Direction:buoy.profile31.split(';')[1],
          profile32Speed:buoy.profile32.split(';')[0],
          profile32Direction:buoy.profile32.split(';')[1],
          profile33Speed:buoy.profile33.split(';')[0],
          profile33Direction:buoy.profile33.split(';')[1],
          profile34Speed:buoy.profile34.split(';')[0],
          profile34Direction:buoy.profile34.split(';')[1],
          profile35Speed:buoy.profile35.split(';')[0],
          profile35Direction:buoy.profile35.split(';')[1],
          profile36Speed:buoy.profile36.split(';')[0],
          profile36Direction:buoy.profile36.split(';')[1],
          profile37Speed:buoy.profile37.split(';')[0],
          profile37Direction:buoy.profile37.split(';')[1],
          profile38Speed:buoy.profile38.split(';')[0],
          profile38Direction:buoy.profile38.split(';')[1],
          profile39Speed:buoy.profile39.split(';')[0],
          profile39Direction:buoy.profile39.split(';')[1],
          profile40Speed:buoy.profile40.split(';')[0],
          profile40Direction:buoy.profile40.split(';')[1],
          


        }));
        this.loading = false;
      },
      error => {
        console.error('Error fetching buoy data', error);
        this.loading = false;
      }
    );
    this.loading = false;
  }
 
 
 
 
  onPeriodChange(event: any) {
    // this.selectedPeriod = event.target.value
 }
 
getWeekEndDate(startDate: Date): Date {
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);  // Add 6 days to get the week end
  endDate.setHours(23, 59, 59, 999);
  return endDate;
}
 
toggleSearch() {
  const searchIcon = document.querySelector('.search-icon');
  searchIcon?.classList.toggle('open');
}
 
highlightSearchText(value: any): string {
  if (!this.searchQuery) return value;
 
  // Ensure the value is treated as a string
  const stringValue = value !== null && value !== undefined ? String(value) : '';
  const escapedSearchQuery = this.searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearchQuery})`, 'gi');
  return stringValue.replace(regex, '<span class="highlight">$1</span>');
}
 
onSearch(query: string, dt2: any): void {
  this.searchQuery = query;
  dt2.filterGlobal(query, 'contains');
}
 
 
  selectStationoption(type: string) {
  this.selectedStation = type;
 
  if(this.selectedStation == 'CWPRS01'){
    this.nameOfStation = this.staionName1;
   }else if(this.selectedStation == 'CWPRS02'){
    this.nameOfStation = this.staionName2
  }
   }
   
  exportCSV(dt2: any) {
    const filteredData = dt2.filteredValue || dt2.value;
 
    if (filteredData && filteredData.length > 0) {
        const csv = this.convertToCSV(filteredData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, 'buoy_data.csv');
    } else {
        // Handle case where no data is available
        console.warn('No data available for CSV export');
    }
}
 
// Helper method to convert JSON to CSV format
convertToCSV(data: any[]): string {
  // Define fixed headers and fields to always include
  const fixedHeaders = ['StationID', 'Date','Time', 'UTC_Time', 'LAT', 'LONG', 'Battery_Voltage', 'GPS_Date'];
  const fixedFields = ['StationID', 'Date','Time', 'UTC_Time', 'LAT', 'LONG', 'Battery_Voltage', 'GPS_Date'];
 
  // Get dynamic headers and fields from selected columns
  const dynamicHeaders = this.selectedColumns.map(col => col.header);
  const dynamicFields = this.selectedColumns.map(col => col.field);
 
  // Combine fixed and dynamic headers and fields
  const headers = [...fixedHeaders, ...dynamicHeaders];
  const fields = [...fixedFields, ...dynamicFields];
 
  // Build CSV rows with combined headers and fields
  const csvRows1 = [
      headers.join(','), // First row with combined headers
      ...data.map(row => fields.map(field => `"${row[field] || ''}"`).join(','))
  ];
 
  const csvRows = [
    headers.join(','), // First row with combined headers
    ...data.map(row =>
      fields.map(field => {
        // Handle date fields to extract date part
        if (field === 'Date') {
          const isoDate = row[field]; // Assume 'Date' field contains ISO date string
          return isoDate ? isoDate.split('T')[0] : ''; // Split and return only the date part
        }
        if (field === "Time"){
          const isoTime = row[field];
          return isoTime ? isoTime.split('T')[1]?.split('.')[0] : '';
        }
        return row[field] || ''; // Default for other fields
      }).join(',')
    )
  ];
  return csvRows.join('\r\n');
}
 
 
 
 
 
 
exportExcel(dt2: any) {
  const filteredData =  dt2.value;
 
  if (filteredData && filteredData.length > 0) {
      // Define fixed headers and fields to always include
      const fixedHeaders = ['StationID', 'Date','Time', 'UTC_Time', 'LAT', 'LONG', 'Battery_Voltage', 'GPS_Date'];
      const fixedFields = ['StationID', 'Date','Time', 'UTC_Time', 'LAT', 'LONG', 'Battery_Voltage', 'GPS_Date'];
 
      // Get dynamic headers and fields from selected columns
      const dynamicHeaders = this.selectedColumns.map(col => col.header);
      const dynamicFields = this.selectedColumns.map(col => col.field);
 
      // Combine fixed and dynamic headers and fields
      const headers = [...fixedHeaders, ...dynamicHeaders];
      const fields = [...fixedFields, ...dynamicFields];
 
      // Map filteredData to include both fixed and dynamic fields
      const dataToExport = filteredData.map((row: any) => {
          const selectedRow: any = {};
 
          // Populate fixed fields first
          // fixedFields.forEach(field => {
          //     selectedRow[field] = row[field];
          // });
 
          fixedFields.forEach(field => {
            if (field === 'Date') {
              const isoDate = row['Date'];
              selectedRow[field] = isoDate ? isoDate.split('T')[0] : '';
            } else if(field === 'Time') {
               const isoTime = row['Time'];
               selectedRow[field] = isoTime ? isoTime.split('T')[1]?.split('.')[0] : '';
            } else {
              selectedRow[field] = row[field];
            }
 
        });
 
          // Populate dynamic fields
          dynamicFields.forEach(field => {
              selectedRow[field] = row[field];
          });
 
          return selectedRow;
      });
 
      // Create the worksheet with combined headers
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, {  });
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
 
      this.saveAsExcelFile(excelBuffer, this.nameOfStation);
  } else {
      console.warn('No data available for Excel export');
  }
}
 
saveAsExcelFile(buffer: any, fileName: string): void {
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
  saveAs(data, `${this.nameOfStation}.xlsx`);
}
 
 
 
 
// exportPDF(dt2: any) {
//   const filteredData: BuoyData[] = dt2.value;
 
//   if (filteredData && filteredData.length > 0) {
//       // Define fixed headers and fields to always include
//       const fixedHeaders = ['StationID', 'Date','Time', 'UTC_Time', 'LAT', 'LONG', 'Battery_Voltage', 'GPS_Date'];
//       const fixedFields = ['StationID', 'Date','Time', 'UTC_Time', 'LAT', 'LONG', 'Battery_Voltage', 'GPS_Date'];
 
//       // Get dynamic headers and fields from selected columns
//       const dynamicHeaders = this.selectedColumns.map(col => col.header);
//       const dynamicFields = this.selectedColumns.map(col => col.field);
 
//       // Combine fixed and dynamic headers and fields
//       const headers = [...fixedHeaders, ...dynamicHeaders];
//       const fields = [...fixedFields, ...dynamicFields];
 
//       // Create a PDF with landscape orientation
//       const doc = new jsPDF('landscape');
 
//       // Set document properties
//       doc.setFontSize(12);
//       doc.text(this.selectedStation, 14, 16);
 
//       // Prepare headers for the table
//       const headerObjects = headers.map(header => ({ title: header, dataKey: header }));
 
//       // Map data to include both fixed and dynamic fields
//       const data1 = filteredData.map((row: any) => {
//           return fields.map(field => row[field] || '');
//       });
 
//       const data = filteredData.map((row: any) => {
//         return fields.map(field => {
//           if (field === 'Date'){
//             const isoDate = row[field];
//             return isoDate ? isoDate.split('T')[0] : '';
//           }
//           return row[field] || '';
//         });
//     });
 
//       // Add table to PDF with fixed and dynamic fields
//       (doc as any).autoTable({
//           head: [headerObjects.map(h => h.title)], // Headers row
//           body: data, // Body of the table
//           startY: 22, // Start position after the title
//           margin: { top: 20 }, // Adjust top margin
//           styles: { fontSize: 8 }, // Adjust font size to fit more data
//       });
 
//       // Save the PDF in landscape mode
//       doc.save('buoy_data.pdf');
//   } else {
//       // Handle case where no data is available
//       console.warn('No data available for PDF export');
//   }
// }

exportPDF(dt2: any) {
  const filteredData: SensorData[] = dt2.value;

  if (filteredData && filteredData.length > 0) {
    // Define fixed headers and fields to always include
    const fixedHeaders = [
      'StationID',
      'Date',
      'Time',
      'UTC_Time',
      'LAT',
      'LONG',
      'Battery_Voltage',
      'GPS_Date',
    ];
    const fixedFields = [
      'StationID',
      'Date',
      'Time',
      'UTC_Time',
      'LAT',
      'LONG',
      'Battery_Voltage',
      'GPS_Date',
    ];

    // Get dynamic headers and fields from selected columns
    const dynamicHeaders = this.selectedColumns.map((col) => col.header);
    const dynamicFields = this.selectedColumns.map((col) => col.field);

    // Combine fixed and dynamic headers and fields
    const headers = [...fixedHeaders, ...dynamicHeaders];
    const fields = [...fixedFields, ...dynamicFields];

    // Create a PDF with landscape orientation
    const doc = new jsPDF('landscape');

    // Set document properties
    doc.setFontSize(12);
    doc.text(this.selectedStation, 14, 16);

    // Map data to include both fixed and dynamic fields
    const data = filteredData.map((row: any) => {
      return fields.reduce((acc: any, field) => {
        if (field === 'Date') {
          // Split the date to get only the date portion (YYYY-MM-DD)
          acc[field] = row[field]?.split('T')[0] || '';
        } else if (field === 'Time') {
          // Split the time to get only the time portion (HH:mm:ss)
          acc[field] = row[field]?.split('T')[1]?.split('Z')[0] || '';
        } else if (field === 'UTC_Time') {
          acc[field] = row[field]?.split('T')[1]?.split('Z')[0] || '';
        } else if (field === 'GPS_Date') {
          acc[field] = row[field]?.split('T')[1]?.split('Z')[0] || '';
        } else {
          // For other fields, assign the value directly or empty if undefined
          acc[field] = row[field] || '';
        }
        return acc;
      }, {});
    });

    // Divide columns into chunks to fit across pages
    const chunkSize = 10; // Number of columns per chunk
    const totalChunks = Math.ceil(fields.length / chunkSize);

    let startY = 22; // Initial Y position for the first table
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      // Get the current chunk of fields and headers
      const chunkFields = fields.slice(
        chunkIndex * chunkSize,
        (chunkIndex + 1) * chunkSize
      );
      const chunkHeaders = headers.slice(
        chunkIndex * chunkSize,
        (chunkIndex + 1) * chunkSize
      );

      // Map data for the current chunk
      const chunkData = data.map((row) => {
        return chunkFields.reduce((acc: any, field) => {
          acc[field] = row[field];
          return acc;
        }, {});
      });

      // Generate the table for the current chunk
      (doc as any).autoTable({
        head: [chunkHeaders], // Headers for the current chunk
        body: chunkData.map((row) => chunkFields.map((field) => row[field])), // Data for the current chunk
        startY: startY, // Start position for the table
        margin: { top: 20 }, // Adjust top margin
        styles: {
          fontSize: 8, // Reduce font size for better fit
          cellPadding: 1, // Reduce padding for tighter rows
          overflow: 'linebreak', // Enable line breaking for long text
          valign: 'middle', // Vertically center-align text
        },
        headStyles: {
          fillColor: [41, 128, 185], // Header background color
          textColor: [255, 255, 255], // Header text color
          halign: 'center', // Align header text to the center
          fontSize: 9, // Header font size
        },
        bodyStyles: {
          halign: 'center', // Align body text to the center
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Example of specific column width for StationID
        },
        pageBreak: 'auto', // Automatically add page breaks
        showHead: 'everyPage', // Repeat headers on each page
      });

      // Update startY for the next table
      startY = 22; // Reset to the top for new page
      if (chunkIndex < totalChunks - 1) {
        doc.addPage(); // Add a new page for the next chunk
      }
    }

    // Save the PDF
    doc.save(`${this.nameOfStation}.pdf`);
  } else {
    // Handle case where no data is available
    console.warn('No data available for PDF export');
  }
}
}
 
 
 
 
 
 
 
 
 
 
 
 