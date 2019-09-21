import React, { Component } from "react";

import Icon from 'react-native-vector-icons/dist/FontAwesome5'

class TShirtIcon extends Component {
    render() {
        const { name, size, style } = this.props;

        return (
            <Icon
                name={name}
                size={size}
                style={style} 
            />
        );
    }
}
export default TShirtIcon;
