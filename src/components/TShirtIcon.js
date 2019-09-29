import React from "react";

import Icon from 'react-native-vector-icons/dist/FontAwesome5'

const TShirtIcon = (props) => {
    const { name, size, color } = props;
    return (
        <Icon
            name={name}
            size={size}
            color={color} 
        />
    );
}
export default TShirtIcon;
