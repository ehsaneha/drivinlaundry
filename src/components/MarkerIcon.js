import React, { Component } from "react";
import { View } from 'react-native';
import { Avatar, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

class MarkerIcon extends Component {
    render() {
        const {iconName, style, offset, active} = this.props;
        const wrapperMarkerSize = 60;

        const frontColor = active ? DefaultTheme.colors.primary : 'white';
        const backColor = active ? 'white' : DefaultTheme.colors.primary;

        return (
            <View style={[{marginTop: (offset ? -(wrapperMarkerSize*4/5) : 0)}, style]}>
                <Icon
                    color={frontColor}
                    name={'location-on'}
                    size={wrapperMarkerSize}
                    style={{backgroundColor: 'transparent'}}
                />

                <Avatar.Icon
                    color={frontColor}
                    size={(wrapperMarkerSize/2)}
                    icon={iconName}
                    style={{
                        backgroundColor: backColor,
                        position: 'absolute',
                        top: 8,
                        left: (wrapperMarkerSize/4),
                    }}
                />
            </View>
        );
    }
}
export default MarkerIcon;
