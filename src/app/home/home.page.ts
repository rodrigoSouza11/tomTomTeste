import { Component } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { Geolocation, Position } from '@capacitor/geolocation';
import ttapi from '@tomtom-international/web-sdk-services';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map: tt.Map;
  center = null;
  destino = null;
  y = null;
  positionSubscription: any;
  routeGroup: any
  routeOptions: any

  marker: any;

  distanciaParaRecalculo = 0
  lengthMeters: any
  timeParaRecalculo: any
  time: any
  i: boolean 
  f: any

  constructor() {

  }

  ionViewDidEnter() {
    this.a()
  }

  async a() {
    const posicaoAtual: Position = await Geolocation.getCurrentPosition();
    this.center = { lng: posicaoAtual.coords.longitude, lat: posicaoAtual.coords.latitude }

    this.mapStart()
  }

  async mapStart() {
    console.log('load')
    this.destino = { lng: -46.825855, lat: -23.009912 }
    let destino2 = { lng: -46.825860, lat: -23.009935 }

    this.map = tt.map({
      key: "cG20UJo9g3TCvDYuAAecV6F6F2v6BSBe",
      container: "map",
      center: this.center,
      zoom: 16,
      //bearing: 180,  //=> regula a totacao 
      dragRotate: true,
      dragPan: true,
      
           
    });

    this.map.addControl(new tt.FullscreenControl());
    this.map.addControl(new tt.NavigationControl({
      showPitch: true,
    showExtendedRotationControls: true,
    showExtendedPitchControls: true
    }));
    
this.map.addControl( 'top-left');

    this.routeOptions = {
      key: 'cG20UJo9g3TCvDYuAAecV6F6F2v6BSBe',
      locations: [this.center, this.destino],
      travelMode: 'car',
      center: this.center,
      routeType: 'fastest' ,
           
    }

    this.marker = new tt.Marker({ color: 'red' }).setLngLat(this.center).addTo(this.map);
    let marker2 = new tt.Marker({ color: 'black' }).setLngLat(this.destino).addTo(this.map);
    
    this.calculateRoute() 
  }


  

  calculateRoute() {
    ttapi.services.calculateRoute(this.routeOptions).then((routeData) => {
      this.drawRoute(routeData.toGeoJson())
    })
  }

  drawRoute(json) {
    this.createMarker('accident.colors-white.svg', [ -46.825950,  -23.009756 ], '#5327c3', 'SVG icon')
    console.log('www', json)
    this.routeGroup = {}
    this.routeGroup.outlinelayer = {
      id: 'routeOutline',
      type: 'line',
      source: {
        type: 'geojson',
        data: json
      },
      paint: {
        'line-color': 'black',
        'line-width': 16
      }
    }
    this.routeGroup.linelayer = {
      id: 'routeline',
      type: 'line',
      source: {
        type: 'geojson',
        data: json
      },
      paint: {
        'line-color': 'yellow',
        'line-width': 12
      }
    }
    this.map.addLayer(this.routeGroup.outlinelayer)
    this.map.addLayer(this.routeGroup.linelayer)

    const a = this.map.on( null,'routeline', null )

    console.log(a, 'kkkkk')
  }  

  //ateh aki iniciando projeto e funcionndo linha A e B funcionando


  async e() {

    let options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  
    let n = await Geolocation.watchPosition(options, (pos) => {
      if (pos) {
        
        
        this.marker.remove()
  
        this.center = { lng: pos.coords.longitude, lat: pos.coords.latitude }
  
        this.marker = new tt.Marker({ color: 'blue', rotation: 0 }).setLngLat(this.center).setDraggable(true).addTo(this.map)
  
        //console.log(pos,this.center, 'qqqq')    
  
        this.map.setCenter(this.center)
        
        
  
        this.routeOptions = {
          key: 'cG20UJo9g3TCvDYuAAecV6F6F2v6BSBe',
          locations: [this.center, this.destino],
          travelMode: 'car',
          //routeType: 'fastest',
          //traffic: true,
          language: 'pt-BR'
          
                  
        }       
  
        let json = this.routeOptions
  
        this.calculateRoute2(json)
      }
    })
  }

  calculateRoute2(json) {
    

    ttapi.services.calculateRoute(json).then((routeData) => {

      let a = routeData.toGeoJson()

      this.lengthMeters = a.features[0].properties.summary.lengthInMeters
      this.time = a.features[0].properties.summary.travelTimeInSeconds

      console.log(this.lengthMeters, 'metros', this.distanciaParaRecalculo, 'recalculo', this.time, 'segundos' , this.timeParaRecalculo, 'segundos')

      if ((this.lengthMeters > this.distanciaParaRecalculo || this.time > this.timeParaRecalculo)) {
        this.distanciaParaRecalculo = this.lengthMeters  
        this.timeParaRecalculo = this.time       
        console.log(this.lengthMeters, 'aaa')
        this.drawRoute2(routeData.toGeoJson())
      } else {
        this.distanciaParaRecalculo = this.lengthMeters   
        this.timeParaRecalculo = this.time     
      }     

    })
    
  }

  drawRoute2(json) {
    this.f = this.map.getCenter()
    this.i = this.map.isMoving()
    let k = this.map.isRotating()
    
    

  
  
    console.log(this.f, this.i, 'dddd')
    if (this.routeGroup) {
      this.map.removeLayer('routeline')
      this.map.removeSource('routeline')
      this.map.removeLayer('routeOutline')
      this.map.removeSource('routeOutline')
    }
    this.routeGroup = null

    console.log('recalculo sim')

    console.log('www', json)
    this.routeGroup = {}
    this.routeGroup.outlinelayer = {
      id: 'routeOutline',
      type: 'line',
      source: {
        type: 'geojson',
        data: json
      },
      paint: {
        'line-color': 'black',
        'line-width': 16
      }
    }
    this.routeGroup.linelayer = {
      id: 'routeline',
      type: 'line',
      source: {
        type: 'geojson',
        data: json
      },
      paint: {
        'line-color': 'yellow',
        'line-width': 12
      }
    }
    this.map.addLayer(this.routeGroup.outlinelayer)
    this.map.addLayer(this.routeGroup.linelayer)

    this.map.setZoom(17)
    this.map.setBearing(180)
    this.map.setPitch(30)
    
   
  }

  createMarker(icon, position, color, popupText) {
    let markerElement = document.createElement('div');
    markerElement.className = 'marker';

    let markerContentElement = document.createElement('div');
    markerContentElement.className = 'marker-content';
    markerContentElement.style.backgroundColor = color;
    markerElement.appendChild(markerContentElement);

    let iconElement = document.createElement('div');
    iconElement.className = 'marker-icon';
    iconElement.style.backgroundImage =
        'url(https://api.tomtom.com/maps-sdk-for-web/cdn/static/' + icon + ')';
    markerContentElement.appendChild(iconElement);

    let popup = new tt.Popup({offset: 30}).setText(popupText);
    // add marker to map
    let a = new tt.Marker({element: markerElement, anchor: 'bottom'})
        .setLngLat(position)
        .setPopup(popup)
        .addTo(this.map);

    //https://developer.tomtom.com/maps-sdk-web-js/functional-examples

    
}




}












