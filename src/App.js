import React, {Component} from 'react';
import MapGL, {Marker,Popup,FlyToInterpolator} from 'react-map-gl';
import ControlPanel from './components/control-panel';
import buildings from './data/deco_buildings.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMapMarker} from '@fortawesome/free-solid-svg-icons';

import './App.css'

const mapStyle="mapbox://styles/stefangouyet/ck8v4xh0j20001jm6a1wlo41g"

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN //add Mapbox token here or in .env.local file

class App extends Component {
  state = {
    viewport: {
      latitude: 40.7587,
      longitude: -73.9787,
      zoom: 11,
      bearing: 0,
      pitch: 0,
      minZoom:1.5
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
           mapboxApiAccessToken={mapboxToken}
          
        >
          {this.state.data && this.state.data.features.map(building =>
            <Marker
            key = {building.properties.year}
            latitude={building.geometry.coordinates[1]}
            longitude={building.geometry.coordinates[0]}
            >
              <FontAwesomeIcon 
              icon={faMapMarker} 
              size='1x' 
              color='black' 
              onClick={e => {
                          e.preventDefault();
                          console.log(building)
                          console.log(building.properties['Building Name'] + '.jpg')
                          this.setState({selectedBuilding:building})
          }}
              />
            
            </Marker>
          )}

          {selectedBuilding ? (
            <Popup
            latitude={selectedBuilding.geometry.coordinates[1]}
            longitude={selectedBuilding.geometry.coordinates[0]}
            closeOnClick={false}
            onClose={() => this.setState({selectedBuilding: null})}>
              <button className='button'>
                  <h1>{selectedBuilding.properties['Building Name']}</h1>
                  <h3>Completed in {selectedBuilding.properties['Year Completed']}</h3>
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