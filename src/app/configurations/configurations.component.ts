import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import * as XLSX from 'xlsx';
import { Vector as VectorLayer } from 'ol/layer';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigDataService } from '../config-data.service';
import {
  Config,
  SensorData,
  SensorData2,
  sensorLiveData,
  StationConfigs,
} from '../../model/config.model';
import { ToastrService } from 'ngx-toastr';
import { MapService } from './map/map.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';


export interface e_bins{
  name:string,
  bin:string,
  show:boolean
}

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule,NgMultiSelectDropDownModule , DragDropModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css',
})
export class ConfigurationsComponent implements OnInit {
  Lang!: number;
  Lat!: number;
  Warning!: number;
  Danger!: number;
  id!: string;
  // tide:number = 0;
  // battery:number = 12.3;
  stations: StationConfigs[] = [];
  tideOffset!: number;
  belowwarning: number = 0;
  abovewarning: number = 0;
  belowdanger: number = 0;
  abovedanger: number = 0;
  currentUnit: String = 'm/s';
  selectedStationType: string = ''; // Bind this to the dropdown
  stationTypes: string[] = [];
  selectedUnit: string = 'mtr';
  selectedcoordinate: string = 'DD';
  slectedOption: String = 'adcp';
  selectedcurrentUnit: string = 'm/s'; // Default selected unit
  show: boolean = false;
  latdeg!: number;
  latmin!: number;
  latsec!: number;
  langdeg!: number;
  langmin!: number;
  langsec!: number;
  sensor: Config[] = [];
  stationName!: string;
  finallat!: number;
  finallang!: number;
  driftValue!: string;
  driftDirection!: string;
  liveloclat1!: number;
  liveloclang1!: number;
  liveloclat2!: number;
  liveloclang2!: number;
  liveData!: sensorLiveData;
  buoy1!: SensorData[];
  buoy2!: SensorData2[];
  checked: boolean = false;

  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings = {};

  listBins: string[] = Array.from({length:40}, (_,i)=> `Profile${i+1}`);
  //  ['Profile1', 'Profile2', 'Profile3', 'Profile4', 'Profile5', 'Profile6', 'Profile7', 'Profile8', 'Profile9', 'Profile10'];
selectedSurface: string = '';
selectedMiddle: string = '';
selectedLower: string = '';
e_bin1:string = '';
e_bin2:string = '';
e_bin3:string = '';
e_bin4:string = '';
e_bin5:string = '';
e_bin6:string = '';
e_bin7:string = '';
e_bin8:string = '';
e_bin9:string = '';
e_bin10:string = '';
e_bin11:string = '';
e_bin12:string = '';
e_bin13:string = '';
e_bin14:string = '';
e_bin15:string = '';
e_bin16:string = '';
e_bin17:string = '';
e_bin18:string = '';
e_bin19:string = '';
e_bin20:string = '';
e_bin21:string = '';
e_bin22:string = '';
e_bin23:string = '';
e_bin24:string = '';
e_bin25:string = '';
e_bin26:string = '';
e_bin27:string = '';
e_bin28:string = '';
e_bin29:string = '';
e_bin30:string = '';
e_bin31:string = '';
e_bin32:string = '';
e_bin33:string = '';
e_bin34:string = '';
e_bin35:string = '';
e_bin36:string = '';
e_bin37:string = '';


//edit text
edit1:string = '';
edit2:string = '';
edit3:string = '';
edit4:string = '';
edit5:string = '';
edit6:string = '';
edit7:string = '';
edit8:string = '';
edit9:string = '';
edit10:string = '';
edit11:string = '';
edit12:string = '';
edit13:string = '';
edit14:string = '';
edit15:string = '';
edit16:string = '';
edit17:string = '';
edit18:string ='';
edit19:string = '';
edit20:string = '';
edit21:string = '';
edit22:string = '';
edit23:string = '';
edit24:string = '';
edit25:string = '';
edit26:string = '';
edit27:string = '';
edit28:string = '';
edit29:string = '';
edit30:string = '';
edit31:string = '';
edit32:string = '';
edit33:string = '';
edit34:string = '';
edit35:string = '';
edit36:string = '';
edit37:string = '';



isEdit1:boolean = false;
isEdit2:boolean = false;
isEdit3:boolean = false;
isEdit4:boolean = false;
isEdit5:boolean = false;
isEdit6:boolean = false;
isEdit7:boolean = false;
isEdit8:boolean = false;
isEdit9:boolean = false;
isEdit10:boolean = false;
isEdit11:boolean = false;
isEdit12:boolean = false;
isEdit13:boolean = false;
isEdit14:boolean = false;
isEdit15:boolean = false;
isEdit16:boolean = false;
isEdit17:boolean = false;
isEdit18:boolean = false;
isEdit19:boolean = false;
isEdit20:boolean = false;
isEdit21:boolean = false;
isEdit22:boolean = false;
isEdit23:boolean = false;
isEdit24:boolean = false;
isEdit25:boolean = false;
isEdit26:boolean = false;
isEdit27:boolean = false;
isEdit28:boolean = false;
isEdit29:boolean = false;
isEdit30:boolean = false;
isEdit31:boolean = false;
isEdit32:boolean = false;
isEdit33:boolean = false;
isEdit34:boolean = false;
isEdit35:boolean = false;
isEdit36:boolean = false;
isEdit37:boolean = false;




isView1!: boolean;
isView2!: boolean;
isView3!: boolean;
isView4!: boolean;
isView5!: boolean;
isView6!: boolean;
isView7!: boolean;
isView8!: boolean;
isView9!: boolean;
isView10!: boolean;
isView11!: boolean;
isView12!: boolean;
isView13!: boolean;
isView14!: boolean;
isView15!: boolean;
isView16!: boolean;
isView17!: boolean;
isView18!: boolean;
isView19!: boolean;
isView20!: boolean;
isView21!: boolean;
isView22!: boolean;
isView23!: boolean;
isView24!: boolean;
isView25!: boolean;
isView26!: boolean;
isView27!: boolean;
isView28!: boolean;
isView29!: boolean;
isView30!: boolean;
isView31!: boolean;
isView32!: boolean;
isView33!: boolean;
isView34!: boolean;
isView35!: boolean;
isView36!: boolean;
isView37!: boolean;


recieved_e_bins:e_bins[]=[

];
[key: string]: any; 
wordToNumberMap: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  twentyone: 21,
  twentytwo: 22,
  twentythree: 23,
  twentyfour: 24,
  twentyfive: 25,
  twentysix: 26,
  twentyseven: 27,
  twentyeight: 28,
  twentynine: 29,
  thirty: 30,
  thirtyone: 31,
  thirtytwo: 32,
  thirtythree: 33,
  thirtyfour: 34,
  thirtyfive: 35,
  thirtysix: 36,
  thirtyseven: 37,
};
mapUrl:string = 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
onEditTap(val:string){
  //console.log(val);
  const index =  this.wordToNumberMap[val.toLowerCase()];
  if (index >= 1 && index <= 37) {
    
    this[`isEdit${index}`] = !this[`isEdit${index}`];
  }

}
onOkTap(val:string){
  //console.log(val);
  const index =  this.wordToNumberMap[val.toLowerCase()];
if (index >= 1 && index <= 37) {
this[`isEdit${index}`] = false; // Accessing the array and setting it to false
}
}

onViewTap(val:string){
  //console.log(val);
  const index =  this.wordToNumberMap[val.toLowerCase()];
if (index >= 1 && index <= 37) {

this[`isView${index}`] = !this[`isView${index}`];
}

}


getFilteredBins(current: string, exclude1: string, exclude2: string, exclude3: string, exclude4: string, exclude5: string, 
  exclude6: string, exclude7: string, exclude8: string, exclude9: string, 
  exclude10: string, exclude11: string, exclude12: string, exclude13: string, exclude14: string, 
  exclude15: string, exclude16: string, exclude17: string, exclude18: string, exclude19: string, 
  exclude20: string, exclude21: string, exclude22: string, exclude23: string, exclude24: string, 
  exclude25: string, exclude26: string, exclude27: string, exclude28: string, exclude29: string, 
  exclude30: string, exclude31: string, exclude32: string, exclude33: string, exclude34: string, 
  exclude35: string, exclude36: string, exclude37: string, exclude38: string, exclude39: string, 
  ): string[] {
  // Include the current selection and exclude the others
  return this.listBins.filter(bin => {
    const exclusions = [exclude1, exclude2, exclude3, exclude4, exclude5, exclude6, exclude7, exclude8, exclude9,
                        exclude10, exclude11, exclude12, exclude13, exclude14, exclude15, exclude16, exclude17, exclude18, 
                        exclude19, exclude20, exclude21, exclude22, exclude23, exclude24, exclude25, exclude26, exclude27, 
                        exclude28, exclude29, exclude30, exclude31, exclude32, exclude33, exclude34, exclude35, exclude36, 
                        exclude37, exclude38, exclude39];
  
    return bin === current || !exclusions.includes(bin);
  });
}
list:string[]= ['Profile1', 'Profile2', 'Profile3', 'Profile4', 'Profile5', 'Profile6', 'Profile7', 'Profile8', 'Profile9', 'Profile10'];
filterdList:string[]=[];
selected_e_bins:string[] = [];
maxSelection = 3
selecteds!:string;
onItemSelect(event: any) {
this.selected_e_bins.push(event.item_text as string)
}
onItemDeSelect(event: any) {
  this.selected_e_bins.indexOf(event.item_text as string)
  this.updateSelecteds()
}
updateSelecteds() {
  this.selecteds = this.selectedItems.map((item: any) => item.item_text).join(', ');
}

CurrentSelect() {
}

  
  dmsToDd(degrees: number, minutes: number, seconds: number): number {
    return degrees + minutes / 60 + seconds / 3600;
  }

  haversineDistanceAndDirection(
    loc1: [number, number],
    loc2: [number, number]
  ): { distance: number; direction: string } {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const toDegrees = (radian: number) => radian * (180 / Math.PI);
    const R = 6371e3; // Radius of Earth in meters
    const φ1 = toRadians(loc1[1]);
    const φ2 = toRadians(loc2[1]);
    const Δφ = toRadians(loc2[1] - loc1[1]);
    const Δλ = toRadians(loc2[0] - loc1[0]);
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    const x = Math.sin(Δλ) * Math.cos(φ2);
    const y =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let bearing = Math.atan2(x, y);
    bearing = toDegrees(bearing);
    bearing = (bearing + 360) % 360;
    const directions = [
      { min: 0, max: 22.5, direction: 'N' },
      { min: 22.5, max: 67.5, direction: 'NE' },
      { min: 67.5, max: 112.5, direction: 'E' },
      { min: 112.5, max: 157.5, direction: 'SE' },
      { min: 157.5, max: 202.5, direction: 'S' },
      { min: 202.5, max: 247.5, direction: 'SW' },
      { min: 247.5, max: 292.5, direction: 'W' },
      { min: 292.5, max: 337.5, direction: 'NW' },
      { min: 337.5, max: 360, direction: 'N' },
    ];
    let direction = 'N'; // Default value
    for (const dir of directions) {
      if (bearing >= dir.min && bearing < dir.max) {
        direction = dir.direction;
        break;
      }
    }
    return { distance, direction };
  }

  travelPathAssign() {
    this.mapService.traveledPath = [];
    if (this.selectedStationType == 'CWPRS01') {
      this.mapService.traveledPath.push(
        fromLonLat([ 72.809854,18.992529 ]) as [number, number],
        fromLonLat([72.808718,18.991402]) as [number, number],
        fromLonLat([ 72.807554,18.992395 ])as [number, number],
        fromLonLat([this.buoy1[0].LONG, this.buoy1[0].LAT]) as [number, number]
      );
      for (let i = 0; i < this.buoy1.length; i++) {
        this.mapService.traveledPath.push(
          fromLonLat([this.buoy1[i].LONG, this.buoy1[i].LAT]) as [
            number,
            number
          ]
        );
      }
    } else if (this.selectedStationType == 'CWPRS02') {
      this.mapService.traveledPath.push(
        fromLonLat([this.buoy2[0].LONG, this.buoy2[0].LAT]) as [number, number]
      );
      for (let i = 0; i < this.buoy2.length; i++) {
        this.mapService.traveledPath.push(
          fromLonLat([this.buoy2[i].LONG, this.buoy2[i].LAT]) as [
            number,
            number
          ]
        );
      }
    }
  }

  checking() {
    this.checked = !this.checked;
    this.stationTypeSelect();
  }
  stationTypeSelect() {
    this.travelPathAssign();
    const selectedStation = this.stations.find(
      (station) => station.station_name === this.selectedStationType
    );
    if (selectedStation) {
      this.selectedcoordinate = selectedStation.geo_format;
      if (this.selectedcoordinate === 'DMS') {
        this.latdeg = selectedStation.latitude_deg;this.latmin = selectedStation.latitude_min;
        this.latsec = selectedStation.latitude_sec;this.langdeg = selectedStation.longitude_deg;
        this.langmin = selectedStation.longitude_min;this.langsec = selectedStation.longitude_sec;this.Lat = 0;this.Lang = 0;
        this.finallang = this.dmsToDd(this.langdeg, this.langmin, this.langsec);
        this.finallat = this.dmsToDd(this.latdeg, this.latmin, this.langsec);
      } else if (this.selectedcoordinate === 'DD') {
        this.Lat = selectedStation.latitude_dd; this.Lang = selectedStation.longitude_dd;
        this.latdeg = 0; this.latmin = 0; this.latsec = 0; this.langdeg = 0; this.langmin = 0;  this.langsec = 0; }
      this.stationName = selectedStation.station; this.Warning = selectedStation.warning_circle;
      this.Danger = selectedStation.danger_circle; this.center = fromLonLat([this.Lang, this.Lat]);
      if (this.selectedStationType == 'CWPRS01') {
        const point1 = fromLonLat([this.finallang, this.finallat]) as [ number,number];
        const point2 = fromLonLat([this.liveloclang1, this.liveloclat1]) as [ number, number];
        const distance = this.haversineDistanceAndDirection(point1, point2);
        this.driftValue = distance.distance.toFixed(2);
        this.driftDirection = distance.direction;
      } else if (this.selectedStationType == 'CWPRS02') {
        const point1 = fromLonLat([this.Lang, this.Lat]) as [number, number];
        const point2 = fromLonLat([this.liveloclang2, this.liveloclat2]) as [number,number];
        const distance = this.haversineDistanceAndDirection(point1, point2);
        this.driftValue = distance.distance.toFixed(2);
        this.driftDirection = distance.direction;
      }
      if (this.selectedcoordinate == 'DD') {
        this.loadMapBasedOnStation(this.Lat, this.Lang, this.checked);
      } else if (this.selectedcoordinate == 'DMS') {
        this.loadMapBasedOnStation(this.finallat, this.finallang, this.checked);
      }
    } else {
      this.show = false;
      this.mapService.destroyMap();
    }
  }

  loadMapBasedOnStation(lat: number, lang: number, sho: boolean): void {
    this.mapService.destroyMap();
    const mapContainer = document.getElementById('ol-map'); // Target HTML element for map
    if (this.selectedStationType === 'CWPRS01') {
      this.mapService.createMap(
        mapContainer!,
        this.finallat,
        this.finallang,
        this.Warning,
        this.Danger,
        sho,
        this.mapUrl
      );
      this.show = true;
    } else if (this.selectedStationType == 'CWPRS02') {
      this.mapService.createMap(
        mapContainer!,
        lat,
        lang,
        this.Warning,
        this.Danger,
        sho,
        this.mapUrl
      );
      this.show = true;
    } else {
      this.mapService.destroyMap();
    }
  }
 
  assign() {
    
    this.tideOffset = parseFloat(this.sensor[0].value);
    this.selectedUnit = this.sensor[0].unit;
    this.selectedcurrentUnit = this.sensor[1].unit;
    this.belowwarning = parseFloat(this.sensor[2].below_warning);
    this.abovewarning = parseFloat(this.sensor[2].above_warning);
    this.belowdanger = parseFloat(this.sensor[2].below_danger);
    this.abovedanger = parseFloat(this.staion.configs[2].above_danger);
    const bin = this.sensor[1].bins;
    const bins = bin.split(',');
    this.selectedSurface = bins[0];
    this.selectedMiddle = bins[1];
    this.selectedLower = bins[2];
    const filteredList = this.list.filter(item => !bins[0].includes(item.trim()) && !bins[1].includes(item.trim()) && !bins[2].includes(item.trim()));
    this.filterdList = filteredList;
    const ee = this.sensor[1].e_bins;
    const ejson = JSON.parse(ee);
    this.recieved_e_bins = ejson;
    for(let i=0; i<this.recieved_e_bins.length; i++){
      this[`edit${i+1}`] = this.recieved_e_bins[i].name;
    }
    for(let i=0; i<this.recieved_e_bins.length; i++){
      this[`isView${i+1}`] = this.recieved_e_bins[i].show;
    }
    for(let i=0; i<this.recieved_e_bins.length; i++){
      this[`e_bin${i+1}`] = this.recieved_e_bins[i].bin;
    }
  }




  selecteoption(typee: String) {
    this.slectedOption = typee;
  }

  selectUnit(unit: string) {
    this.selectedUnit = unit;
  }
  selectcurrentUnit(unit: string) {
    this.selectedcurrentUnit = unit;
  }
  selectcoordinate(unit: string) {
    this.selectedcoordinate = unit;
  }


  online:boolean = true;
  ngOnInit(): void {
    this.staion.page = 'Setting';
    const status = navigator.onLine;
    this.online = status;
    if(!this.online){
      this.mapUrl = '../../../../assets/western/{z}/{x}/{y}.png';
    }else{
      this.mapUrl = 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
    this.dropdownassign()
    const date = new Date();
    const todayDate = date.toISOString().substr(0, 10);
    this.data.getSensorLiveData(todayDate, todayDate).subscribe((response) => {
      if(response.buoy1.length !==4){
        this.buoy1 = this.dummyData1;
        this.buoy2 = this.dummyData2
      }else{  
        this.liveData = response;
        this.buoy1 = this.liveData.buoy1;
        this.buoy2 = this.liveData.buoy2;
      }
      this.liveloclat1 = this.buoy1[0].LAT;
      this.liveloclat2 = this.buoy2[0].LAT;
      this.liveloclang1 = this.buoy1[0].LONG;
      this.liveloclang2 = this.buoy2[0].LONG;
    });
    this.data.getStationNames().subscribe((stations) => {
      this.stations = stations;
      for (let i in stations) {
        this.stationTypes.push(stations[i].station_name);
      }
      this.data.getsensorConfigs().subscribe((sensor) => {
        this.sensor = sensor;
        if (this.sensor != null) {
          this.assign();
        }
      });
    });
    this.assign();
  }

  constructor(
    private staion: LayoutComponent,
    private http: HttpClient,
    private data: ConfigDataService,
    private taost: ToastrService,
    private mapService: MapService
  ) {}
  map!: Map;
  vectorLayer!: VectorLayer;
  map2!: Map;
  center = fromLonLat([80.19146988481407, 14.602590765602967]);

  onsensorSubmit() {
    const e_bins_json = [];
    for(let i=0; i<38; i++){
      e_bins_json.push(
        {
          name:this[`edit${i+1}`] ?? "",
          bin:this[`e_bin${i+1}`] ?? "",
          show:this[`isView${i+1}`] ?? false
        }
      )
    }
    const e_bins = JSON.stringify(e_bins_json);
    const binnn = `${this.selectedSurface},${this.selectedMiddle},${this.selectedLower}`;
    if(this.selectedItems >2){
      this.taost.error('You can select only 3 items');
      return;
    }else{
      let data: any = {};
    if (this.slectedOption === 'tide') {
      data = {
        sensor_type: this.slectedOption,
        value: this.tideOffset.toString(),
        unit: this.selectedUnit,
      };
    } else if (this.slectedOption === 'adcp') {
      data = {
        sensor_type: this.slectedOption,
        unit: this.selectedcurrentUnit,
        bins: binnn,
        e_bins: e_bins
      };
    } else if (this.slectedOption === 'battery') {
      data = {
        sensor_type: this.slectedOption.toString(),
        above_warning: this.abovewarning.toString(),
        below_warning: this.belowwarning.toString(),
        above_danger: this.abovedanger.toString(),
        below_danger: this.belowdanger.toString(),
      };
    }
    this.http.put('http://localhost:3000/api/config', data).subscribe({
      next: (res) => {
        this.taost.success('Sensor settings Updaeted', 'Success');
      },
      error: (err) => {
        this.taost.error('Sensor settings not updated', 'Please try again');
      },
    });
    }
    
  }

  onstationSubmit() {
    let stationConfigData = {};
    if (this.selectedcoordinate == 'DD') {
      stationConfigData = {
        station: this.stationName,
        station_name: this.selectedStationType,
        warning_circle: this.Warning,
        danger_circle: this.Danger,
        geo_format: this.selectedcoordinate, 
        latitude_dd: this.Lat,
        longitude_dd: this.Lang,
        latitude_deg: null,
        latitude_min: null,
        latitude_sec: null,
        longitude_deg: null,
        longitude_min: null,
        longitude_sec: null,
      };
    } else if (this.selectedcoordinate == 'DMS') {
      stationConfigData = {
        station: this.stationName,
        station_name: this.selectedStationType,
        warning_circle: this.Warning,
        danger_circle: this.Danger,
        geo_format: this.selectedcoordinate, 
        latitude_dd: null,
        longitude_dd: null,
        latitude_deg: this.latdeg,
        latitude_min: this.latmin,
        latitude_sec: this.latsec,
        longitude_deg: this.langdeg,
        longitude_min: this.langmin,
        longitude_sec: this.langsec,
      };
    }
    this.http
      .put(
        'http://localhost:3000/api/updatestationconfig',
        stationConfigData
      )
      .subscribe({
        next: (res) => {
          this.taost.success('Station Configuration updated', 'Success');
        },
        error: (err) => {
          this.taost.error(
            'Error Updating Station Configuration',
            'Please try again'
          );
        },
      });
  }
  dropdownassign(){
    this.dropdownList = [
      { item_id: 1, item_text: 'Profile1' },
      { item_id: 2, item_text: 'Profile2' },
      { item_id: 3, item_text: 'Profile3' },
      { item_id: 4, item_text: 'Profile4' },
      { item_id: 5, item_text: 'Profile5' },
      { item_id: 6, item_text: 'Profile6' },
      { item_id: 7, item_text: 'Profile7' },
      { item_id: 8, item_text: 'Profile8' },
      { item_id: 9, item_text: 'Profile9' },
      { item_id:10,item_text: 'Profile10' },
    ];
    this.selectedItems = [
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      enableCheckAll:false,
      allowSearchFilter: false
    };
  }


showImport:boolean = false;
errorMessage: string = '';
  maxFileSizeMB = 5;
  tableData: any[] = [];
  displayedColumns: string[] = []; 
  historyData:any=[]; 
importTap(){
this.showImport = !this.showImport;

}
onFileSelected(event: any) {
  const file: File = event.target.files[0];

  if (!file) {
    this.errorMessage = 'No file selected!';
    return;
  }

  // Check file size (max 5MB)
  const maxSizeBytes = this.maxFileSizeMB * 1024 * 1024; // Convert MB to Bytes
  if (file.size > maxSizeBytes) {
    this.errorMessage = `File size must be less than ${this.maxFileSizeMB}MB!`;
    return;
  }

  // Reset error message if valid
  this.errorMessage = '';

  // Update filename display
  const fileNameSpan = document.getElementById("file-name");
  if (fileNameSpan) {
    fileNameSpan.textContent = file.name;
  }
  this.readFile(event)
}


async readFile(event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = async (e) => {
    const data = new Uint8Array(reader.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    let sheetData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length > 0) {
      this.displayedColumns = Object.keys(sheetData[0]); // Set dynamic columns
    }

    // Convert Excel Serial Date to Proper Date Format
    sheetData = sheetData.map(row => {
      if (!isNaN(row.Date)) { // If date is a number, convert it
        row.Date = this.excelSerialDateToJSDate(row.Date);
      }
      return row;
    });

    this.tableData = sheetData;
    console.log(this.tableData); // Debugging: Show JSON data
    console.log(this.tableData[0].StationID);
    console.log(this.tableData[0].Date);
    const dumpData = []
    for (let i = 0; i < this.tableData.length; i++) {
      dumpData.push(
        {"Battery_Voltage": this.tableData[i].BatteryVoltage,
    "Date": this.tableData[i].Date,
    "GPS_Date": this.tableData[i].GPS_Date,
    "LAT": this.tableData[i].LAT,
    "LONG": this.tableData[i].LONG,
    "Lower_CurrentSpeedDirection": this.tableData[i].Lower_CurrentSpeedDirection,
    "Middle_CurrentSpeedDirection": this.tableData[i].Middle_CurrentSpeedDirection,
    "S1_RelativeWaterLevel": this.tableData[i].S1_RelativeWaterLevel,
    "S2_SurfaceCurrentSpeedDirection":this.tableData[i].S2_SurfaceCurrentSpeedDirection,
    "StationID":this.tableData[i].StationID,
    "Time":this.tableData[i].Time,
    "UTC_Time":this.tableData[i].UTC_Time,
    "Profile4":this.tableData[i].Profile4,
    "Profile5": this.tableData[i].Profile5,
    "Profile6":this.tableData[i].Profile6,
    "Profile7": this.tableData[i].Profile7,
    "Profile8": this.tableData[i].Profile8,
    "Profile9": this.tableData[i].Profile9,
    "Profile10": this.tableData[i].Profile10,
    "Profile11": this.tableData[i].Profile11,
      "Profile12":this.tableData[i].Profile12,
      "Profile13": this.tableData[i].Profile13,
      "Profile14": this.tableData[i].Profile14,
      "Profile15": this.tableData[i].Profile15,
      "Profile16": this.tableData[i].Profile16,
      "Profile17": this.tableData[i].Profile17,
      "Profile18": this.tableData[i].Profile18,
      "Profile19": this.tableData[i].Profile19,
      "Profile20": this.tableData[i].Profile20,
      "Profile21": this.tableData[i].Profile21,
      "Profile22": this.tableData[i].Profile22,
      "Profile23": this.tableData[i].Profile23,
      "Profile24": this.tableData[i].Profile24,
      "Profile25": this.tableData[i].Profile25,
      "Profile26": this.tableData[i].Profile26,
      "Profile27": this.tableData[i].Profile27,
      "Profile28": this.tableData[i].Profile28,
      "Profile29": this.tableData[i].Profile29,
      "Profile30": this.tableData[i].Profile30,
      "Profile31": this.tableData[i].Profile31,
      "Profile32": this.tableData[i].Profile32,
      "Profile33": this.tableData[i].Profile33,
      "Profile34": this.tableData[i].Profile34,
      "Profile35": this.tableData[i].Profile35,
      "Profile36": this.tableData[i].Profile36,
      "Profile37": this.tableData[i].Profile37,
      "Profile38": this.tableData[i].Profile38,
      "Profile39": this.tableData[i].Profile39,
      "Profile40": this.tableData[i].Profile40,}
      )
      
    }
    console.log(dumpData);
    this.historyData = dumpData
   
  };

  reader.readAsArrayBuffer(file);
}

async dump(data: any): Promise<boolean> {
  const d = { datas: data };
  let api = 'dump';

  if(data[0].StationID === 'CWPRS01'){
    api = 'dump'
  }else if(data[0].StationID === 'CWPRS02'){
    api = 'dump2'
  }
  try {
    const response: any = await this.http.post(`http://localhost:3000/api/${api}`, d).toPromise();
    
    console.log(response?.status); // Check if response has status

    if (response?.status) {
      console.log(true);
      return true;
    }
    
    return false; // Return false if status is missing or false
  } catch (error) {
    console.error("Error is", error);
    return false;
  }
}

async removeDump(data: any): Promise<boolean> {
  const d = { datas: data };
  let api = 'removedump';

  if(data[0].StationID === 'CWPRS01'){
    api = 'removedump'
  }else if(data[0].StationID === 'CWPRS02'){
    api = 'removedump2'
  }
  try {
    const response: any = await this.http.post(`http://localhost:3000/api/${api}`, d).toPromise();
    
    console.log(response?.status); // Check if response has status

    if (response?.status) {
      console.log(true);
      return true;
    }
    
    return false; // Return false if status is missing or false
  } catch (error) {
    console.error("Error is", error);
    return false;
  }
}
// removedump
async submitData(fileInput: HTMLInputElement) {
  
  const result = await this.dump(this.historyData);
  
  if (result) {
    this.tableData = [];
    this.displayedColumns = [];
    this.taost.success('Historical Data Updated', 'Success');
    
    // Clear the file input
    const fileNameSpan = document.getElementById("file-name");
    if (fileNameSpan) {
      fileNameSpan.textContent = "Upload file";
    }
  } else {
    this.taost.error('Failed to update Historical Data', 'Error');
  }
}
async submitData2(fileInput: HTMLInputElement) {
  
  const result = await this.removeDump(this.historyData);
  
  if (result) {
    this.tableData = [];
    this.displayedColumns = [];
    this.taost.success('Historical Data Deleted', 'Success');
    
    // Clear the file input
    const fileNameSpan = document.getElementById("file-name");
    if (fileNameSpan) {
      fileNameSpan.textContent = "Upload file";
    }
  } else {
    this.taost.error('Failed to Delete Historical Data', 'Error');
  }
}

deleteRow(index: number) {
  this.tableData.splice(index, 1); // Remove row from the array
  this.tableData = [...this.tableData]; // Update reference to trigger change detection
}


// Function to Convert Excel Serial Number to JavaScript Date
excelSerialDateToJSDate(serial: number): string {
  const excelEpoch = new Date(1899, 11, 30); // Excel epoch starts from 1900-01-01 but needs an offset
  const days = Math.floor(serial);
  const msPerDay = 86400000; // 24 * 60 * 60 * 1000
  const date = new Date(excelEpoch.getTime() + days * msPerDay);

  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
}




menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  downloadFile(type: string) {
    const fileName = type === 'csv' ? 'sample.csv' : 'sample.xlsx'; // Change file names as needed
    const filePath = `assets/data_sheet/${fileName}`;
    
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.menuOpen = false; // Close menu after download
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
  "profile11":"13.3;123.3",
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
