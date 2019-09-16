import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from "react-native";



import ClothingListItem from '../components/ClothingListItem'
import DatabaseUtil from '../database/DatabaseUtil';

class ClothingSelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.clothings = {};

        this._onItemChange = this._onItemChange.bind(this);
        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
    }

    componentDidMount = () => {
        this.props.screenProps(this);
    }

    beforeNextFABPressed = () => {
        if (Object.keys(this.clothings).length === 0) {
            return false;
        }

        DatabaseUtil.data.order.clothings = [];
        for (key in this.clothings) {
            DatabaseUtil.data.order.clothings.push({
                type: key,
                count: this.clothings[key],
            });
        }

        return true;
    }

    _generateListItemsData = () => {
        let result = [];
        for (let i = 21; i < 59; i++) {
            result.push({ title: 'Title Text', key: i - 21, iconName: `Asset-1${i}mdpi` });
        }
        return result;
    }

    _onItemChange(key, count) {
        if (count === 0) {
            delete this.clothings[key];
        }
        else {
            this.clothings[key] = count;
        }
    }

    _renderEachListItem = ({ item }) => {
        return (
            <ClothingListItem
                itemInfo={item}
                iconName={item.iconName}
                onChange={this._onItemChange}
            />
        );
    }

    render() {
        return (
            <FlatList
                style={{ flex: 1, paddingTop: 60 }}
                contentContainerStyle={{ alignItems: 'center', }}
                data={this._generateListItemsData()}
                renderItem={this._renderEachListItem}
                numColumns={5}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    }
}

export { ClothingSelectionScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: 80,
        height: 80,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    }
});

