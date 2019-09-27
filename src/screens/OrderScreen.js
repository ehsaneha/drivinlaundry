import React, { Component } from 'react';
import {
    View,
    Text,
    PermissionsAndroid,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity
} from 'react-native';
import { Button, FAB, Avatar, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { NavigationActions, StackActions } from 'react-navigation'

import OrderSubViewNavigator from '../navigators/OrderSubViewNavigator'
import OrderPageIndicator from '../components/OrderPageIndicator'
import DatabaseUtil from '../database/DatabaseUtil'
import HandleBackButton from '../components/HandleBackButton'
import OrderUtil from '../utils/OrderUtil';

class OrderScreen extends Component {
    state = {
        xValue: new Animated.Value(0),
        fadeValue: new Animated.Value(0),
        currentScreenIndex: 0,
    };

    beforeNextFABPressedList = [];


    screens = [
        { name: 'ClothingSelection', iconName: 'tshirt', ref: null },
        { name: 'TimeSelection', iconName: 'access-time', ref: null },
        { name: 'LocationSelection', iconName: 'location-on', ref: null },
        { name: 'CarSelection', iconName: 'local-taxi', ref: null },
        { name: 'LaundrySelection', iconName: 'local-laundry-service', ref: null },
        { name: 'OrderReciepe', iconName: 'shopping-cart', ref: null },
        { name: 'Payment', iconName: 'attach-money', ref: null },
    ];

    static router = OrderSubViewNavigator.router;

    _nextFABPressed = () => {
        let subViewAllowsToGoNext = this.beforeNextFABPressedList[this.state.currentScreenIndex]();

        if (subViewAllowsToGoNext) {
            this.setState({ currentScreenIndex: this.state.currentScreenIndex + 1 },
                () => {
                    if (this.state.currentScreenIndex < this.screens.length) {
                        this.props.navigation.navigate(this.screens[this.state.currentScreenIndex].name);
                        this.activeNextIndex();
                    }
                    else {
                        // const resetAction = StackActions.reset({
                        //     index: 0,
                        //     key: null,
                        //     actions: [NavigationActions.navigate({ routeName: 'Home' })],
                        //   });

                        //   this.props.navigation.dispatch(resetAction);
                        this.props.navigation.navigate('App');
                    }
                });
        }

    }

    _backFABPressed = () => {
        this.setState({ currentScreenIndex: this.state.currentScreenIndex - 1 },
            () => {
                this.props.navigation.goBack(null);

                if (this.state.currentScreenIndex > -1) this.activePrevIndex();
                else new OrderUtil().clearOrder();

            });
    }

    _renderNextFAB = () => {
        if (this.state.currentScreenIndex < this.screens.length - 1) {
            return (
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.nextFAB}
                    icon="check"
                    onPress={this._nextFABPressed}
                />
            );
        }
    }

    _renderBackFAB = () => {
        return this.state.currentScreenIndex > 0 ?
            (
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.backFAB}
                    icon="arrow-back"
                    onPress={this._backFABPressed}
                />
            ) :
            (
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.backFAB}
                    icon="close"
                    onPress={this._backFABPressed}
                />
            );
    }
    /* 
        _renderSettingButton = () => {
            if (this.state.currentScreenIndex === 0) {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Setting')} >
                        <Avatar.Icon
                            icon={({ size, color }) => (
                                <Icon name={'settings'} size={30} />
                            )}
                            style={{ backgroundColor: 'transparent', position: 'absolute' }}
                        />
                    </TouchableOpacity>
                );
            }
        } */


    render() {
        return (
            <HandleBackButton onPress={this._backFABPressed}>
                <View style={{ flex: 1 }}>
                    <OrderSubViewNavigator
                        navigation={this.props.navigation}
                        screenProps={ref => this.beforeNextFABPressedList[this.state.currentScreenIndex] = ref.beforeNextFABPressed}
                    />

                    {/* {this._renderSettingButton()} */}

                    <OrderPageIndicator
                        screensList={this.screens}
                        onRef={(ref) => {
                            if (ref) {
                                return [
                                    (this.activeNextIndex = ref.activeNextIndex),
                                    (this.activePrevIndex = ref.activePrevIndex),
                                ];
                            }
                        }}
                    />


                    {this._renderNextFAB()}
                    {this._renderBackFAB()}

                </View>
            </HandleBackButton>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        margin: 5,
    },
    nextFAB: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
    },
    backFAB: {
        position: 'absolute',
        margin: 16,
        bottom: 0,
        backgroundColor: 'white',
    },
    textInput: {
        margin: 5,
    }
});


export { OrderScreen }