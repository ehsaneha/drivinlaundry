import React, { Component } from "react";

import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'

class LogoutIcon extends Component {
    render() {
        const { name, size, color } = this.props;

        return (
            <Icon
                name={name}
                size={size}
                color={color} 
            />
        );
    }
}
export default LogoutIcon;
