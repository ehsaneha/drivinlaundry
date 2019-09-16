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
import { Button, FAB, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { NavigationActions, StackActions } from 'react-navigation'

import OrderSubViewNavigator from '../navigators/OrderSubViewNavigator'
import OrderPageIndicator from '../components/OrderPageIndicator'


class OrderScreen extends Component {
    state = {
        xValue: new Animated.Value(0),
        fadeValue: new Animated.Value(0),
        currentScreenIndex: 0,
    };


    screens = [
        { name: 'ClothingSelection', iconName: 'folder', ref: null },
        { name: 'TimeSelection', iconName: 'access-time', ref: null },
        { name: 'LocationSelection', iconName: 'location-on', ref: null },
        { name: 'CarSelection', iconName: 'local-taxi', ref: null },
        { name: 'LaundrySelection', iconName: 'local-laundry-service', ref: null },
        { name: 'OrderReciepe', iconName: 'folder', ref: null },
        { name: 'Payment', iconName: 'attach-money', ref: null },
    ];

    static router = OrderSubViewNavigator.router;

    _nextFABPressed = () => {
        let subViewAllowsToGoNext = this.beforeNextFABPressed();

        if (subViewAllowsToGoNext) {
            this.setState({ currentScreenIndex: this.state.currentScreenIndex + 1 },
                () => {
                    if (this.state.currentScreenIndex < this.screens.length) {
                        this.activeNextIndex();
                        this.props.navigation.push(this.screens[this.state.currentScreenIndex].name);
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
                if (this.state.currentScreenIndex > -1) {
                    this.activePrevIndex();
                }

                this.props.navigation.goBack(null)
            });
    }

    _renderNextFAB = () => {
        if (this.state.currentScreenIndex < this.screens.length) {
            return (
                <FAB
                    style={styles.nextFAB}
                    icon="check"
                    onPress={this._nextFABPressed}
                />
            );
        }
    }

    _renderBackFAB = () => {
        if (this.state.currentScreenIndex > 0) {
            return (
                <FAB
                    style={styles.backFAB}
                    icon="arrow-back"
                    onPress={this._backFABPressed}
                />
            );
        }
    }

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
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <OrderSubViewNavigator
                    navigation={this.props.navigation}
                    screenProps={ref => this.beforeNextFABPressed = ref.beforeNextFABPressed}
                />

                {this._renderSettingButton()}

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
    },
    backFAB: {
        position: 'absolute',
        margin: 16,
        bottom: 0,
    },
    textInput: {
        margin: 5,
    }
});


export { OrderScreen }