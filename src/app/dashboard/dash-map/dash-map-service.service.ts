import { Injectable } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import { Icon, Style, Fill, Stroke, Text } from 'ol/style';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root',
})
export class dashMapServiceService {
  private map: Map | undefined;

  constructor() {}

  initializeMap(
    targetId: string,
    center: [number, number],
    buoyName: string,
    buoyIconUrl: string,
    redCircleRadius: number,
    yellowCircleRadius: number
  ): void {
    try {
      //console.log("started map init")
      if (this.map) {
        //console.log('Destroying existing map instance.');
        this.map.setTarget(undefined);
      }
      const cc = fromLonLat([center[1], center[0]]) as [number, number];
      // Base map layer
      const baseLayer = new TileLayer({
        source: new XYZ({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        }),
      });
  
      // Marker style
      const markerStyle = new Style({
        image: new Icon({
          src: buoyIconUrl,
          scale: 0.06,
        }),
        text: new Text({
          text: buoyName,
          font: '12px Calibri,sans-serif',
          offsetY: -20,
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
      });
  
      // Create marker
      const marker = new Feature({
        geometry: new Point(cc),
      });
      marker.setStyle(markerStyle);
  
      // Red circle
      const redCircle = new Feature({
        geometry: new Circle(cc, redCircleRadius),
      });
      redCircle.setStyle(
        new Style({
          stroke: new Stroke({ color: 'red', width: 2 }),
          fill: new Fill({ color: 'rgba(255, 0, 0, 0.1)' }),
        })
      );
  
      // Yellow circle
      const yellowCircle = new Feature({
        geometry: new Circle(cc, yellowCircleRadius),
      });
      yellowCircle.setStyle(
        new Style({
          stroke: new Stroke({ color: 'yellow', width: 2 }),
          fill: new Fill({ color: 'rgba(255, 255, 0, 0.1)' }),
        })
      );
  
      // Vector layer for marker and circles
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [marker, redCircle, yellowCircle],
        }),
      });
  
      // Initialize map
      this.map = new Map({
        target: targetId,
        layers: [baseLayer, vectorLayer],
        view: new View({
          center: cc,
          zoom: 15,
          // projection: 'EPSG:4326', // Use latitude and longitude
        }),
      });
    } catch (error) {
      //console.log("map Error",error);
    }
    // Cleanup existing map instance
    
  }

  destroyMap(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = undefined;
    }
  }
}


