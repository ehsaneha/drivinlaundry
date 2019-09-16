import React from 'react';
import MapView from 'react-native-maps'
import {
    Image,
    View
} from 'react-native'

export default class Car extends React.Component {
    constructor(props) {
        super(props);

        const car = this.props.car ?
            this.props.car :
            {
                id: "noDriversPassed",
                location: { latitude: 0, longitude: 0 },
                heading: 350
            };

        console.log(car)

        const coordinate = {
            latitude: car.location.latitude,
            longitude: car.location.longitude
        };

        this.state = {
            car: car,
            coordinate: coordinate,
            heading: car.heading
        }
    }

    render() {
        return (
            <MapView.Marker
                coordinate={ this.state.coordinate }
                anchor={{ x: 0.35, y: 0.32 }}
                ref={ marker => { this.marker = marker }}
                style={{ 
                    width: 50, 
                    height: 50, 
                    transform: [{ rotate: `${this.state.heading}deg` }] 
                    }} >
                
                    <Image 
                        source={ require('../assets/car.png') } 
                        style={{
                            width: 32,
                            height: 32
                        }}
                    />

            </MapView.Marker>
        );
    }
}

