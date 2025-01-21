import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text } from 'ol/style';
import { Point, Circle } from 'ol/geom';
import { getDistance } from 'ol/sphere';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  private map!: Map;
  private vectorLayer!: VectorLayer;
  // private mapUrl: string = 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

  initializeMap(targetId: string, center: [number, number], zoom: number, mapUrl:string): void {
    if (this.map) {
      console.warn('Map is already initialized.');
      return;
    }

    const vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({ source: vectorSource });

    this.map = new Map({
      view: new View({
        center,
      zoom:  mapUrl ==='../../../../assets/western/{z}/{x}/{y}.png'? 10: zoom,
        maxZoom: mapUrl ==='../../../../assets/western/{z}/{x}/{y}.png'? 14 : undefined,
        minZoom: mapUrl ==='../../../../assets/western/{z}/{x}/{y}.png'? 8 : undefined,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({ url: mapUrl }),
        }),
        this.vectorLayer,
      ],
      target: targetId,
    });

    this.map.getViewport().addEventListener('pointermove', (event) => {
        const pixel = this.map!.getEventPixel(event);
      
        // Reset cursor by default
        this.map!.getTargetElement().style.cursor = '';
      
        // Check if a feature exists at the pixel where the pointer is hovering
        this.map!.forEachFeatureAtPixel(pixel, (feature) => {
          if (feature instanceof Feature && feature.get('name')) { // 'name' or any unique property of marker
            this.map!.getTargetElement().style.cursor = 'pointer';
          }
        });
      });
  }

  destroyMap(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = undefined as unknown as Map;
    }
  }

  updateMapLayer(url: string): void {
    if (!this.map) {
      console.error('Map is not initialized.');
      return;
    }

    const tileLayer = this.map.getLayers().getArray().find(layer => layer instanceof TileLayer) as TileLayer;
    if (tileLayer) {
      tileLayer.setSource(new XYZ({ url }));
    }
  }

  addMarker(coordinate: [number, number], name: string, img: string): void {
    const vectorSource = this.vectorLayer.getSource() as VectorSource;

    const markerStyle = new Style({
      image: new Icon({
        src: img,
        scale: 0.06,
      }),
      text: new Text({
        font: '12px Calibri,sans-serif',
        text: name,
        offsetY: -50,
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
    });

    const marker = new Feature({
      name,
      geometry: new Point(coordinate),
    });
    marker.setStyle(markerStyle);
    vectorSource.addFeature(marker);
  }

  addCircle(center: [number, number], radius: number, color: string): void {
    const vectorSource = this.vectorLayer.getSource() as VectorSource;

    const circleFeature = new Feature({
      geometry: new Circle(center, radius),
    });

    const circleStyle = new Style({
      stroke: new Stroke({ color, width: 2 }),
      fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
    });
    circleFeature.setStyle(circleStyle);
    vectorSource.addFeature(circleFeature);
  }

  getMapInstance(): Map | undefined {
    return this.map;
  }


  registerClickListener(callback: (feature: Feature) => void): void {
    if (!this.map) {
      console.error('Map is not initialized.');
      return;
    }
  
    this.map.on('click', (event) => {
      let clickedFeatureFound = false; // Track if any feature was clicked
      this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature instanceof Feature) {
          callback(feature);
          clickedFeatureFound = true;
        }
      });
  
      if (!clickedFeatureFound) {
        console.log('No feature clicked at this location.');
      }
    });
  }
  
  formatDistance(distancee:number) {
    return distancee.toFixed(14); // Formats to 14 decimal places
}

  checkBuoyRange(markerCoords: [number, number], center:[number, number], danger:number,wrange:number, buoyName:string): string {
       const ddd = this.formatDistance(danger)
      const distance = getDistance(center, markerCoords);
       if (distance > wrange && distance < danger) {
        return  `${buoyName} Crossed Out of Warning Range`;
      } else if (distance > danger) {
        return `${buoyName} Crossed Danger Range`;
      } else {
        return `Buoy is within range`;
      }
      // const newState = distance > this.radius ? 'Buoy 1 missing or out of range' : 'Buoy 1 within range';
      // if (newState !== this.lastBuoyRangeState) {
        
      //   this.lastBuoyRangeState = newState;
      // }
    }
  
    // checkBuoyRange2(markerCoords: [number, number]): void {
    //   const distance = getDistance(this.buoy2, markerCoords);
    //    const newWarningState = distance > this.wrange ? 'Buoy 2 far beyond range' : 'Buoy 2 within warning range';
    //   if(distance>this.buoy2wrange && distance < this.buoy2danger){
    //     this.buoy2range = `CWPRS02 Crossed Out of Warning Range`;
    //   }else if(distance > this.buoy2danger){
    //     this.buoy2range = `CWPRS02 Crossed Danger Range`;
    //   }
    //   // if (newWarningState !== this.lastWarningState) {
        
    //   //   this.lastWarningState = newWarningState;
    //   // }
  
  
  
  
    // }
  
}
