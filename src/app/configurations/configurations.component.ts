import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import View from 'ol/View';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Feature from 'ol/Feature';
import { Point, Circle } from 'ol/geom';
import { number, vector } from 'echarts';
import { parseNumber } from 'devextreme/localization';
import { UnitsComponent } from '../units/units.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FLOAT } from 'ol/webgl';
import { ConfigDataService } from '../config-data.service';
import {
  Config,
  SensorData,
  SensorData2,
  sensorLiveData,
  StationConfigs,
} from '../../model/config.model';
import { Toast, ToastrService } from 'ngx-toastr';
import { MapService } from '../../map/map.service';
import { subscribe } from 'diagnostics_channel';
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
  //  const index = parseInt(val.replace('one', '1').replace('two', '2').replace('three', '3')
  //                             .replace('four', '4').replace('five', '5').replace('six', '6')
  //                             .replace('seven', '7').replace('eight', '8').replace('nine', '9')
  //                             .replace('ten', '10').replace('eleven', '11').replace('twelve', '12')
  //                             .replace('thirteen', '13').replace('fourteen', '14').replace('fifteen', '15')
  //                             .replace('sixteen', '16').replace('seventeen', '17').replace('eighteen', '18')
  //                             .replace('nineteen', '19').replace('twenty', '20').replace('twentyone', '21')
  //                             .replace('twentytwo', '22').replace('twentythree', '23').replace('twentyfour', '24')
  //                             .replace('twentyfive', '25').replace('twentysix', '26').replace('twentyseven', '27')
  //                             .replace('twentyeight', '28').replace('twentynine', '29').replace('thirty', '30')
  //                             .replace('thirtyone', '31').replace('thirtytwo', '32').replace('thirtythree', '33')
  //                             .replace('thirtyfour', '34').replace('thirtyfive', '35').replace('thirtysix', '36')
  //                             .replace('thirtyseven', '37'));


                              //console.log("index in edit" , index);
  if (index >= 1 && index <= 37) {
    
    this[`isEdit${index}`] = !this[`isEdit${index}`];
  }

}
onOkTap(val:string){
  //console.log(val);
  const index =  this.wordToNumberMap[val.toLowerCase()];
  // parseInt(val.replace('one', '1').replace('two', '2').replace('three', '3')
  // .replace('four', '4').replace('five', '5').replace('six', '6')
  // .replace('seven', '7').replace('eight', '8').replace('nine', '9')
  // .replace('ten', '10').replace('eleven', '11').replace('twelve', '12')
  // .replace('thirteen', '13').replace('fourteen', '14').replace('fifteen', '15')
  // .replace('sixteen', '16').replace('seventeen', '17').replace('eighteen', '18')
  // .replace('nineteen', '19').replace('twenty', '20').replace('twentyone', '21')
  // .replace('twentytwo', '22').replace('twentythree', '23').replace('twentyfour', '24')
  // .replace('twentyfive', '25').replace('twentysix', '26').replace('twentyseven', '27')
  // .replace('twentyeight', '28').replace('twentynine', '29').replace('thirty', '30')
  // .replace('thirtyone', '31').replace('thirtytwo', '32').replace('thirtythree', '33')
  // .replace('thirtyfour', '34').replace('thirtyfive', '35').replace('thirtysix', '36')
  // .replace('thirtyseven', '37'));
if (index >= 1 && index <= 37) {
this[`isEdit${index}`] = false; // Accessing the array and setting it to false
}
}

onViewTap(val:string){
  //console.log(val);
  const index =  this.wordToNumberMap[val.toLowerCase()];
  // parseInt(val.replace('one', '1').replace('two', '2').replace('three', '3')
  // .replace('four', '4').replace('five', '5').replace('six', '6')
  // .replace('seven', '7').replace('eight', '8').replace('nine', '9')
  // .replace('ten', '10').replace('eleven', '11').replace('twelve', '12')
  // .replace('thirteen', '13').replace('fourteen', '14').replace('fifteen', '15')
  // .replace('sixteen', '16').replace('seventeen', '17').replace('eighteen', '18')
  // .replace('nineteen', '19').replace('twenty', '20').replace('twentyone', '21')
  // .replace('twentytwo', '22').replace('twentythree', '23').replace('twentyfour', '24')
  // .replace('twentyfive', '25').replace('twentysix', '26').replace('twentyseven', '27')
  // .replace('twentyeight', '28').replace('twentynine', '29').replace('thirty', '30')
  // .replace('thirtyone', '31').replace('thirtytwo', '32').replace('thirtythree', '33')
  // .replace('thirtyfour', '34').replace('thirtyfive', '35').replace('thirtysix', '36')
  // .replace('thirtyseven', '37'));
  //console.log("index == ", index);
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
onCheckboxChange(event: Event, item: string, i:number): void {
  //console.log(`"number:""${i}"`,)
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    // Add item to the selected list if checked
    this.selected_e_bins.push(item);
    // //console.log(this.selected_e_bins);
  } else {
    // Remove item from the selected list if unchecked
    this.selected_e_bins = this.selected_e_bins.filter(selectedItem => selectedItem !== item);
  }
  //console.log(this.selected_e_bins); // To check the updated list in the //console
}
maxSelection = 3
selecteds!:string;
onItemSelect(event: any) {
//console.log(event);
this.selected_e_bins.push(event.item_text as string)
//console.log(this.selected_e_bins, event.item_text)

}


onItemDeSelect(event: any) {
  this.selected_e_bins.indexOf(event.item_text as string)

  //console.log('Deselected Item:', this.selected_e_bins);
  this.updateSelecteds()
}
updateSelecteds() {
  // Concatenate selected items into a single string
  this.selecteds = this.selectedItems.map((item: any) => item.item_text).join(', ');
  //console.log(this.selecteds)
}

CurrentSelect() {
  //console.log('Surface:', this.selectedSurface);
  //console.log('Middle:', this.selectedMiddle);
  //console.log('Lower:', this.selectedLower);
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

    // Haversine formula to calculate distance
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    // Calculate the initial bearing (direction) in radians
    const x = Math.sin(Δλ) * Math.cos(φ2);
    const y =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let bearing = Math.atan2(x, y);

    // Convert bearing from radians to degrees
    bearing = toDegrees(bearing);

    // Normalize the bearing to be between 0 and 360 degrees
    bearing = (bearing + 360) % 360;

    // Map bearing to cardinal direction
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

    // //console.log(this.mapService.traveledPath);
  }

  checking() {
    // this.mapService.destroyMap();
    this.checked = !this.checked;
    this.stationTypeSelect();
  }
  stationTypeSelect() {
    this.travelPathAssign();
    // //console.log("Station selected:", this.selectedStationType);

    const selectedStation = this.stations.find(
      (station) => station.station_name === this.selectedStationType

    );
    //console.log("selected station:" , selectedStation);

    if (selectedStation) {
      this.selectedcoordinate = selectedStation.geo_format;

      if (this.selectedcoordinate === 'DMS') {
        // Set DMS values
        this.latdeg = selectedStation.latitude_deg;
        this.latmin = selectedStation.latitude_min;
        this.latsec = selectedStation.latitude_sec;
        this.langdeg = selectedStation.longitude_deg;
        this.langmin = selectedStation.longitude_min;
        this.langsec = selectedStation.longitude_sec;
        this.Lat = 0;
        this.Lang = 0;
        this.finallang = this.dmsToDd(this.langdeg, this.langmin, this.langsec);
        this.finallat = this.dmsToDd(this.latdeg, this.latmin, this.langsec);
      } else if (this.selectedcoordinate === 'DD') {
        // Set DD values
        this.Lat = selectedStation.latitude_dd;
        this.Lang = selectedStation.longitude_dd;
        this.latdeg = 0;
        this.latmin = 0;
        this.latsec = 0;
        this.langdeg = 0;
        this.langmin = 0;
        this.langsec = 0;
      }
      this.stationName = selectedStation.station;
      this.Warning = selectedStation.warning_circle;
      this.Danger = selectedStation.danger_circle;

      // Update center and render the map with new station coordinates
      this.center = fromLonLat([this.Lang, this.Lat]);
      // //console.log(this.center)
      if (this.selectedStationType == 'CWPRS01') {
        const point1 = fromLonLat([this.finallang, this.finallat]) as [
          number,
          number
        ];
        //console.log("nano loc",point1);
        const point2 = fromLonLat([this.liveloclang1, this.liveloclat1]) as [
          number,
          number
        ];
        // //console.log("point1:== ", point1, this.center);
        // //console.log("point2: ==", point2);
        const distance = this.haversineDistanceAndDirection(point1, point2);
        // //console.log(distance,'m');
        this.driftValue = distance.distance.toFixed(2);
        this.driftDirection = distance.direction;
      } else if (this.selectedStationType == 'CWPRS02') {
        const point1 = fromLonLat([this.Lang, this.Lat]) as [number, number];
        const point2 = fromLonLat([this.liveloclang2, this.liveloclat2]) as [
          number,
          number
        ];
        // //console.log("point1:== ", point1);
        // //console.log("point2: ==", point2);
        const distance = this.haversineDistanceAndDirection(point1, point2);
        // //console.log(distance,'m');
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
      // //console.log("map:", mapContainer);
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
      // //console.log("map:", mapContainer);
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
    //console.log(bin, bins[0]) 
    this.selectedSurface = bins[0];
    this.selectedMiddle = bins[1];
    this.selectedLower = bins[2];
    const filteredList = this.list.filter(item => !bins[0].includes(item.trim()) && !bins[1].includes(item.trim()) && !bins[2].includes(item.trim()));
    this.filterdList = filteredList;
    this.updatedropdown(bin);
    // //console.log(this.tideOffset, this.selectedUnit, this.selectedcurrentUnit,
    //   this.belowdanger,this.abovedanger, this.belowwarning, this.abovewarning
    // );
    const ee = this.sensor[1].e_bins;
    // //console.log("e_bin:",ee);
    const ejson = JSON.parse(ee);
    
    this.recieved_e_bins = ejson;
    //console.log(this.recieved_e_bins);
    for(let i=0; i<this.recieved_e_bins.length; i++){
      this[`edit${i+1}`] = this.recieved_e_bins[i].name;
    }
    for(let i=0; i<this.recieved_e_bins.length; i++){
      this[`isView${i+1}`] = this.recieved_e_bins[i].show;
    }
    //console.log("view37 is", this.isView37);
    for(let i=0; i<this.recieved_e_bins.length; i++){
      this[`e_bin${i+1}`] = this.recieved_e_bins[i].bin;
    }
    // this.edit1 = this.recieved_e_bins[0].name;
    // this.edit2 = this.recieved_e_bins[1].name;
    // this.edit3 = this.recieved_e_bins[2].name;
    // this.edit4 = this.recieved_e_bins[3].name;
    // this.edit5 = this.recieved_e_bins[4].name;
    // this.edit6 = this.recieved_e_bins[5].name;
    // this.edit7 = this.recieved_e_bins[6].name;
    // this.edit8 = this.recieved_e_bins[7].name;
    // this.edit9 = this.recieved_e_bins[8].name;


    // this.isView1 = this.recieved_e_bins[0].show;
    // this.isView2 = this.recieved_e_bins[1].show;
    // this.isView3 = this.recieved_e_bins[2].show;
    // this.isView4 = this.recieved_e_bins[3].show;
    // this.isView5 = this.recieved_e_bins[4].show;
    // this.isView6 = this.recieved_e_bins[5].show;
    // this.isView7 = this.recieved_e_bins[6].show;

    // this.e_bin1 = this.recieved_e_bins[0].bin;
    // this.e_bin2 = this.recieved_e_bins[1].bin;
    // this.e_bin3 = this.recieved_e_bins[2].bin;
    // this.e_bin4 = this.recieved_e_bins[3].bin;
    // this.e_bin5 = this.recieved_e_bins[4].bin;
    // this.e_bin6 = this.recieved_e_bins[5].bin;
    // this.e_bin7 = this.recieved_e_bins[6].bin;

  }


   // Inside your ConfigurationsComponent class
   warningCircleStyle = new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.2)', // Light red with transparency
    }),
  });

  dangerCircleStyle = new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.2)', // Light yellow with transparency
    }),
  });

  selecteoption(typee: String) {
    this.slectedOption = typee;
    
    // //console.log(`selectedType : ${this.slectedOption}`);
  }

  selectUnit(unit: string) {
    this.selectedUnit = unit;
    // //console.log(`Selected unit: ${this.selectedUnit}`);
  }
  selectcurrentUnit(unit: string) {
    this.selectedcurrentUnit = unit;
    // //console.log(`Selected unit: ${this.selectedcurrentUnit}`);
  }
  selectcoordinate(unit: string) {
    this.selectedcoordinate = unit;
    // //console.log(`Selected unit: ${this.selectedcoordinate}`);
  }


  online:boolean = true;
  ngOnInit(): void {
    this.staion.page = 'Setting';
    const a = 1;
    //console.log(`${a.toString()}`);
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
      // //console.log(response);
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
      //console.log("station setting", stations);

      for (let i in stations) {
        this.stationTypes.push(stations[i].station_name);
      }

      this.data.getsensorConfigs().subscribe((sensor) => {
        this.sensor = sensor;
        // //console.log("Sensors==", this.sensor);
        if (this.sensor != null) {
          this.assign();
        }
      });
    });

    this.assign();
    this.map = new Map({
      target: 'ol-map',
      view: new View({
        center: this.center,
        zoom: 17,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          }),
        }),
      ],
    });
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
  RenderMap(): void {
    // Initialize `this.map` if it hasn't been created yet
    if (!this.map) {
      this.map = new Map({
        view: new View({
          center: this.center,
          zoom: 17,
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            }),
          }),
        ],
        target: 'ol-map',
      });
    }

    // Clear layers if `this.map` is already initialized
    else {
    }

    // Add layers
    const marker = new Feature({ geometry: new Point(this.center) });
    marker.setStyle(
      new Style({
        image: new Icon({ src: '../../assets/buoy.png', scale: 0.04 }),
      })
    );

    const circleFeature = new Feature({
      geometry: new Circle(this.center, this.Warning),
    });
    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({ color: 'yellow', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      })
    );

    const circleFeature2 = new Feature({
      geometry: new Circle(this.center, this.Danger),
    });
    circleFeature2.setStyle(
      new Style({
        stroke: new Stroke({ color: 'red', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      })
    );

    const vectorSource = new VectorSource({
      features: [marker, circleFeature, circleFeature2],
    });
    const vectorLayer = new VectorLayer({ source: vectorSource });

    // Add `vectorLayer` to the map
    this.map.addLayer(vectorLayer);
    // this.map.getLayers().clear();
  }

  RenderMap2(): void {
    // Same logic as RenderMap for `this.map2`
    if (!this.map2) {
      this.map2 = new Map({
        view: new View({
          center: this.center,
          zoom: 17,
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            }),
          }),
        ],
        target: 'ol-map',
      });
    } else {
      this.map2.getLayers().clear();
    }

    const marker = new Feature({ geometry: new Point(this.center) });
    marker.setStyle(
      new Style({
        image: new Icon({ src: '../../assets/buoy.png', scale: 0.04 }),
      })
    );

    const circleFeature = new Feature({
      geometry: new Circle(this.center, this.Warning),
    });
    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({ color: 'yellow', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      })
    );

    const circleFeature2 = new Feature({
      geometry: new Circle(this.center, this.Danger),
    });
    circleFeature2.setStyle(
      new Style({
        stroke: new Stroke({ color: 'red', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      })
    );

    const vectorSource = new VectorSource({
      features: [marker, circleFeature, circleFeature2],
    });
    const vectorLayer = new VectorLayer({ source: vectorSource });

    // Add `vectorLayer` to the map
    this.map2.addLayer(vectorLayer);
  }

  clickon(typr: String) {
    // //console.log(typr);
  }

  //updates
  onsensorSubmit() {
    const e_bins_json = [
      
    ];

    for(let i=0; i<38; i++){
      e_bins_json.push(
        {
          name:this[`edit${i+1}`] ?? "",
          bin:this[`e_bin${i+1}`] ?? "",
          show:this[`isView${i+1}`] ?? false
        }
      )
    }
    //console.log(e_bins_json);
    const e_bins = JSON.stringify(e_bins_json);

    const binnn = `${this.selectedSurface},${this.selectedMiddle},${this.selectedLower}`;
    //console.log("binnss: ===",binnn);
    // //console.log("tapped", this.slectedOption);
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
      // //console.log(data);
    } else if (this.slectedOption === 'adcp') {
      data = {
        sensor_type: this.slectedOption,
        unit: this.selectedcurrentUnit,
        bins: binnn,
        e_bins: e_bins
      };
      // //console.log(data);
    } else if (this.slectedOption === 'battery') {
      data = {
        sensor_type: this.slectedOption.toString(),
        above_warning: this.abovewarning.toString(),
        below_warning: this.belowwarning.toString(),
        above_danger: this.abovedanger.toString(),
        below_danger: this.belowdanger.toString(),
      };
      // //console.log(data);
    }

    this.http.put('http://localhost:3000/api/config', data).subscribe({
      next: (res) => {
        // //console.log(res);
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
        geo_format: this.selectedcoordinate, // or 'DMS'
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
        geo_format: this.selectedcoordinate, // or 'DMS'
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
          // //console.log('response station config ==', res);
          this.taost.success('Station Configuration updated', 'Success');
        },
        error: (err) => {
          // //console.error('Error occurred:', err);
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
  updatedropdown(binname: any) {
    // // Split the bin string into an array and trim spaces
    // const bins = binname.split(',').map((bin: string) => bin.trim());
  
    // // Filter the dropdown list for items matching any bin name
    // this.selected_e_bins = this.dropdownList.filter((item: { item_id: number; item_text: string }) =>
    //   bins.includes(item.item_text)
    // );
  
    // //console.log('Selected Items:', this.selectedItems);
  }







  leftBox = ['Widget 1', 'Widget 2', 'Widget 3', 'Widget 4', 'Widget 5', 'Widget 6', 'Widget 7'];
  rightBox: string[] = [];

  // Move item from one box to another
  drop(event: any, targetBox: string[]) {
    
    const sourceBox = event.previousContainer.data;
    const item = sourceBox[event.previousIndex];

    if (event.previousContainer === event.container) {
      // Same container, do nothing
      return;
    }

    // Remove item from the source
    sourceBox.splice(event.previousIndex, 1);

    // Add item to the target
    targetBox.splice(event.currentIndex, 0, item);

    //console.log(this.rightBox)
  }

  // Remove item from right and add back to left
  removeItem(item: string) {
    const index = this.rightBox.indexOf(item);
    if (index > -1) {
      this.rightBox.splice(index, 1);
      this.leftBox.push(item);
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
