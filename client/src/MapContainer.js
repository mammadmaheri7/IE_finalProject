import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';

const MyMap = withScriptjs(withGoogleMap(props =>{
    let defaultLat = props.lat ? props.lat :  35.6892;
    let defaultLong = props.lng ? props.lng :  51.3890;
   return <GoogleMap
        defaultZoom={8}
        defaultCenter={{  lat: defaultLat, lng: defaultLong}}
        onClick={props.onClick}
    >

        <Marker
            position={{
                lat: props.lat,
                lng: props.lng
            }}
        />
    </GoogleMap>
}
));
export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (<MyMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDjs0u02-62FMwrtxMxci5pc6PIubSyW28&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            onClick={this.props.onClick}
            lat={this.props.lat}
            lng={this.props.lng}
        />);
    }
}
