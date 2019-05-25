import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

import { googleApiKey } from "../../../../config/config.js";

const MapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" +
      googleApiKey +
      "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={props.defaultCenter}>
    {props.isMarkerShown && (
      <Marker position={props.positions} onClick={props.onMarkerClick} />
    )}
  </GoogleMap>
));

class Map extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMarkerShown: false
    };

    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.delayedShowMarker = this.delayedShowMarker.bind(this);
  }

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker() {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  }

  handleMarkerClick() {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  }

  render() {
    return (
      <MapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        defaultCenter={this.props.defaultCenter}
        positions={this.props.positions}
      />
    );
  }
}

export default Map;
