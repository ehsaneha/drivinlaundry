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

class OrderDetailsModelClothingListItem extends Component {
    render() {
        const { iconName, count } = this.props;

        return (
            <View style={{ marginRight: 5, }} >
                <Avatar.Icon
                    icon={({ size, color }) => (
                        <ClothingIcon name={iconName} size={40} color='white' />
                    )}
                />
                <Badge style={{ position: 'absolute', bottom: 0 }}>{count}</Badge>
            </View>
        );
    }
}
export default OrderDetailsModelClothingListItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});