import * as React from 'react';
import {PureComponent} from 'react';

import CITIES from '../data/cities.json';

export default class ControlPanel extends PureComponent {
  _renderButton = (city, index) => {
    return (
      <div key={`btn-${index}`} className="input">
        <input
          type="radio"
          name="city"
          id={`city-${index}`}
          defaultChecked={city.city === ' 1. New York'}
          onClick={() => this.props.onViewportChange(city)}
        />
        <label htmlFor={`city-${index}`}>{city.city}</label>
      </div>
    );
  };

  render() {
    return (
      <div className="control-panel">
        <h3>Deco Cities</h3>
        <div className="source-link">
        </div>
        <hr />

        {CITIES.map(this._renderButton)}
      </div>
    );
  }
}