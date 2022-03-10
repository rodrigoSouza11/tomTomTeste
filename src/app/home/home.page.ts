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

  constructor() {

  }

  ionViewDidEnter() {
    this.a()
    //this.e()    
  }

  async mapStart() {
    console.log('load')

    console.log(this.center, 'cccc')

    this.center
    this.destino = { lng: -46.825855, lat: -23.009912 }


    this.map = tt.map({
      key: "cG20UJo9g3TCvDYuAAecV6F6F2v6BSBe",
      container: "map",
      center: this.center,
      zoom: 16,
      bearing: 180,  //=> regula a totacao         
    });

    this.map.addControl(new tt.FullscreenControl());
    this.map.addControl(new tt.NavigationControl());

    this.routeOptions = {
      key: 'cG20UJo9g3TCvDYuAAecV6F6F2v6BSBe',
      locations: [this.center, this.destino],
      travelMode: 'truck'
    }

    this.pointCentralMark();

  }



  calculateRoute() {
    ttapi.services.calculateRoute(this.routeOptions).then((routeData) => {
      console.log(routeData.toGeoJson())
      this.drawRoute(routeData.toGeoJson())
    })
  }

  drawRoute(json) {
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
        'line-width': 12
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
        'line-width': 8
      }
    }
    this.map.addLayer(this.routeGroup.outlinelayer)
    this.map.addLayer(this.routeGroup.linelayer)
  }


  async a() {
    const posicaoAtual: Position = await Geolocation.getCurrentPosition();
    this.center = { lng: posicaoAtual.coords.longitude, lat: posicaoAtual.coords.latitude }
    this.y = posicaoAtual.coords.latitude

    console.log(posicaoAtual, 'GPS endereco')

    this.mapStart()

  }

  async getLocation() {
    //const posicaoAtual: Position = await Geolocation.getCurrentPosition();
    //console.log('a', posicaoAtual )  
  }

  async pointCentralMark() {
    const posicaoAtual: Position = await Geolocation.getCurrentPosition()
    this.marker = new tt.Marker({ color: 'red' }).setLngLat(this.center).addTo(this.map);
  }

  async e() {
    let options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    let n = await Geolocation.watchPosition(options, (pos) => {
      console.log(pos, 'iiiii')
      this.marker.remove()
      console.log('1')

      this.center = { lng: pos.coords.longitude, lat: pos.coords.latitude }

      this.marker = new tt.Marker({ color: 'green', rotationAlignment: 'auto' }).setLngLat(this.center).addTo(this.map);

      let marker2 = new tt.Marker({ color: 'black' }).setLngLat(this.destino).addTo(this.map);

      console.log(pos, this.center, 'qqqq')      
      this.map.setCenter(this.center)
      this.map.setZoom(16)
      this.map.setBearing(180)
      return this.calculateRoute()
    })
  }
}







/*
watchPosition = async () => {
  try {
      this.setState({
          loading: true
      })
      this.watchId = Geolocation.watchPosition({}, (position, err) => {

          if (err) {
              return;
          }
          this.setState({
              center: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
              },
              loading: false
          }, () => {
              this.clearWatch();
          })
      })
  }
  catch (err) { console.log('err', err) }
}
*/



