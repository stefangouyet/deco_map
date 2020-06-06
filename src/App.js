import React, {Component, useEffect} from 'react';
import {render} from 'react-dom';
//import Geocoder from "react-map-gl-geocoder";
import MapGL, {Source, Layer,Marker,NavigationControl,Popup,FlyToInterpolator} from 'react-map-gl';

import ControlPanel from './components/control-panel';
import buildings from './data/deco_buildings.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBiking, faTrophy} from '@fortawesome/free-solid-svg-icons';
import BuildingInfo from './components/BuildingInfo';

import './App.css'

const mapStyle="mapbox://styles/stefangouyet/ck8v4xh0j20001jm6a1wlo41g"

// useEffect(() => {
//     const listener = (e) => {
//       if (e.key == "Escape") {
//         this.setState({
//           builingData:null
//         })
//       }
//     };
//     window.addEventListener('keydown',listener);


//   }, 

// [])

class App extends Component {
  state = {
    viewport: {
      latitude: 37.7751,
      longitude: -122.4193,
      zoom: 11,
      bearing: 0,
      pitch: 0
    },
    popupInfo: null
  };

  componentDidMount() {
    this.setState({
      data: buildings
    })
  };

  mapRef = React.createRef();

  _onViewportChange = viewport =>
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });

  _goToViewport = ({longitude, latitude}) => {
    this._onViewportChange({
      longitude,
      latitude,
      zoom: 11,
      transitionInterpolator: new FlyToInterpolator({speed: 1.2}),
      transitionDuration: 'auto'
    });
  };


  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  _onClickMarker = building => {
    this.setState({popupInfo: building});
    console.log('set')
    console.log(building)
  };


  _renderPopup() {
    const {popupInfo} = this.state;

    const filterBuilding =(data, building) => {
      const features = data.features.filter(feature => {
        return (
            feature.properties['Building Name'] === building
        )})
        return {type: 'FeatureCollection', features};
    };

    const buildingData = filterBuilding(this.state.data,popupInfo);

    // console.log('stefan')
    // console.log(buildingData)

    // console.log(buildingData.features[0])

    return (
      popupInfo && (
        <Popup
          tipSize={1}
          anchor="top"
          latitude={buildingData.features[0].geometry.coordinates[1]}
          longitude={buildingData.features[0].geometry.coordinates[0]}
          closeOnClick={false}
          onClose={() => this.setState({buildingData: null})}
        >
          {/* <BuildingInfo info={buildingData} /> */}
          <button>
            <img src = './public/Chrysler_Building_eagle.jpg' alt='icon' />
          </button>
        </Popup>
      )
    );
  }

  render() {
    const {viewport, selectedBuilding} = this.state;

    return (
      <div style={{height: '100%'}}>
        <MapGL
           {...viewport}
           width="100vw"
           height="100vh"
           ref = {this.mapRef}
           {...viewport}
           onViewportChange={this.handleViewportChange}
           mapStyle={mapStyle}
           onClick={() => this.setState({ selectedBuilding: null })}
           mapboxApiAccessToken={'pk.eyJ1Ijoic3RlZmFuZ291eWV0IiwiYSI6ImNrNzlqbm8ycTA5bXUzbXFyMWZreGMxb24ifQ.hGYafiv-Xt5DXaUZgz4M8Q'}
          
        >
          {this.state.data && this.state.data.features.map(building =>
            <Marker
            key = {building.properties.year}
            latitude={building.geometry.coordinates[1]}
            longitude={building.geometry.coordinates[0]}
            >
              <FontAwesomeIcon 
              icon={faTrophy} 
              size='1x' 
              color='black' 
              onClick={e => {//this._onClickMarker(building.properties['Building Name'])}
                          e.preventDefault();
                          console.log(building)
                          console.log(building.properties['Building Name'] + '.jpg')
                          this.setState({selectedBuilding:building})
          }}
              />
              {this._renderPopup()}
            </Marker>
          )}

          {selectedBuilding ? (
            <Popup
            latitude={selectedBuilding.geometry.coordinates[1]}
            longitude={selectedBuilding.geometry.coordinates[0]}
            closeOnClick={false}
            onClose={() => this.setState({selectedBuilding: null})}>
              <button className='button'>
                  {/* <img src = '../public/Chrysler_Building_eagle.jpg' alt='icon' /> */}
                  <h1>{selectedBuilding.properties['Building Name']}</h1>
                  <h3>Constructed in {selectedBuilding.properties['Year Built']}</h3>
                  <img 
                  className='photo' 
                  src={require('./images/'+selectedBuilding.properties['Building Name'] + '.jpg')} 
                  alt='./images/general_deco.jpg'  />
                  
              </button>
            </Popup>
          ) : null
        }
        <ControlPanel
          containerComponent={this.props.containerComponent}
          onViewportChange={this._goToViewport}
        />
        </MapGL>
      </div>
    );
  }
}

export default App;