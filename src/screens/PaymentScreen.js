import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ToastAndroid,
} from "react-native";
import { Button, ActivityIndicator, DefaultTheme } from 'react-native-paper';
import { NavigationActions, StackActions } from 'react-navigation'

import OrderUtil from "../utils/OrderUtil";

class PaymentScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            payLoading: false,
        }

        this._renderPaypalButtonOrActivityIndicator = this._renderPaypalButtonOrActivityIndicator.bind(this);
    }


    _paypalPaymentPressed = () => {
        this.setState({
            payLoading: true,
        });

        new OrderUtil().createOrder(
            () => {
                    // this.props.navigation.navigate('ServiceProcess');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'ServiceProcess' })],
                    });
                    this.props.navigation.dispatch(resetAction);
            },
            () =>
                this.setState({
                    payLoading: false,
                })
        );
    }

    _renderPaypalButtonOrActivityIndicator = () => {
        return this.state.payLoading ?
            (
                <ActivityIndicator
                    animating={true}
                    color={DefaultTheme.colors.primary}
                    // size={'large'}
                    style={{ marginBottom: 10 }}
                />
            ) :
            (
                <Button
                    mode="contained"
                    style={{ marginBottom: 20 }}
                    onPress={this._paypalPaymentPressed}
                >
                    PayPal
                </Button>
            );

    }

    render() {
        return (
            <View style={styles.container}>

                {this._renderPaypalButtonOrActivityIndicator()}

                {/* <Button
                    mode="contained"
                    onPress={() => console.log('Pressed')}>
                    PaymentScreen
                </Button> */}
            </View>
        );
    }
}
export { PaymentScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});