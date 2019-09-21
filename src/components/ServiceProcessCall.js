import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import NetworkUtil from '../network/NetworkUtil'

class ServiceProcessCall extends Component {

    _onPress = () => {
        const {onPress, phone} = this.props;
        onPress(phone);
    }

    render() {
        const { style, iconName, avatar } = this.props;
        const avatarSource = {uri: NetworkUtil.getAvatarUri(avatar)};

        return (
            <View style={[{}, style]} >

                <TouchableOpacity onPress={this._onPress} >
                    {/* <Avatar.Icon
                        icon={({ size, color }) => (
                            <Icon name={'local-taxi'} size={40} color='white' />
                        )}
                    /> */}
                    
                    <Avatar.Image
                        source={avatarSource}
                        key={avatarSource.uri}
                    />
                </TouchableOpacity>
                
                <Avatar.Icon
                    style={{ position: 'absolute', left: -5, top: -5, borderWidth: 1, borderColor: 'white' }}
                    size={25}
                    icon={({ size, color }) => (
                        <Icon name={iconName} size={15} color='white' />
                    )}
                />

                <Avatar.Icon
                    style={{ position: 'absolute', right: -5, bottom: -5, borderWidth: 1, borderColor: 'white' }}
                    size={25}
                    icon={({ size, color }) => (
                        <Icon name={'local-phone'} size={15} color='white' />
                    )}
                />

            </View>
        );
    }
}
export default ServiceProcessCall;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});