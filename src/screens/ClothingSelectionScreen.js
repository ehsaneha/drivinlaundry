import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ToastAndroid,
    FlatList,
    Dimensions
} from "react-native";



import ClothingListItem from '../components/ClothingListItem'
import DatabaseUtil from '../database/DatabaseUtil';

class ClothingSelectionScreen extends Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     containerVisible: true,
        // }
        this.clothings = this.initClothings();

        this._onItemChange = this._onItemChange.bind(this);
        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
    }

    initClothings = () => {
        let result = {};

        const { order } = DatabaseUtil.data;
        if (order.clothings.length > 0) {
            order.clothings.forEach(element => {
                result[element.type] = element.count;
            });
        }

        return result;
    }

    componentDidMount = () => {
        this.props.screenProps.setBeforeNextFABPressed(this.beforeNextFABPressed);
        // this.props.screenProps.toggleOpacity(this.toggleOpacity);
    }

    // toggleOpacity = () => {
    //     this.setState({ containerVisible: !this.state.containerVisible })
    // }

    beforeNextFABPressed = () => {
        if (Object.keys(this.clothings).length === 0) {
            ToastAndroid.show('You should select at least one item!', ToastAndroid.SHORT);
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
            result.push({ title: 'Title Text', key: i - 21, iconName: `Asset-1${i}mdpi`, count: (this.clothings[i - 21] ? this.clothings[i - 21] : 0) });
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

    _renderEachListItem = ({ item, index }) => {
        return (
            <ClothingListItem
                itemInfo={item}
                iconName={item.iconName}
                count={item.count}
                onChange={this._onItemChange}
            />
        );
    }

    render() {
        screenWidth = Math.round(Dimensions.get('window').width);
        // if (this.state.containerVisible) {
            return (
                <FlatList
                    style={{ flex: 1, marginTop: 60, }}
                    contentContainerStyle={{ alignItems: 'center', }}
                    data={this._generateListItemsData()}
                    renderItem={this._renderEachListItem}
                    numColumns={screenWidth < 400 ? 4 : 5}
                    keyExtractor={(item, index) => index + '_clothings'}
                />
            );
        // }

        // return null;
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

