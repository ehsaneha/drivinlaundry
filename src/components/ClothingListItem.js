import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity
} from "react-native";

import ClothingIcon from '../assets/clothing icons/ClothingIcon.js'
import { Avatar, Badge } from 'react-native-paper';


class ClothingListItem extends Component {

    state = {
        count: 0
    };

    _increamentCount = () => {
        this.setState({ count: this.state.count + 1 });
        this.props.onChange(this.props.itemInfo.key, this.state.count + 1);
    };

    _delete = () => {
        this.setState({ count: 0 });
        this.props.onChange(this.props.itemInfo.key, 0);
    };

    _renderDeleteBadge = () => {
        if(this.state.count > 0) {
            return (
                <TouchableOpacity onPress={this._delete} style={{ position: 'absolute', left: 0 }} >
                    {/* <Avatar.Icon size={20} icon="close" /> */}
                    <Badge>X</Badge>
                </TouchableOpacity>
            );
        }
    }
    
    _renderCountBadge = () => {
        if(this.state.count > 0) {
            return (
                <Badge style={{ position: 'absolute', bottom: 0 }}>{this.state.count}</Badge>
            );
        }
    }

    _setColor = () => {
        return this.state.count > 0 ? 'black' : 'red';
    }


    render() {
        const { iconName } = this.props;
        return (
            <View style={{ margin: 5, }} >
                <TouchableOpacity onPress={this._increamentCount} >
                    <Avatar.Icon
                        // style={{backgroundColor: this._setColor()}}
                        icon={({ size, color }) => (
                            <ClothingIcon name={iconName} size={40} color='white' />
                        )}
                    />
                </TouchableOpacity>

                { this._renderCountBadge() }
                { this._renderDeleteBadge() }
            </View>
        );
    }
}
export default ClothingListItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});