import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Button, ActivityIndicator, DefaultTheme } from 'react-native-paper';
import { NavigationActions, StackActions } from 'react-navigation'

import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'

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

        const { setting, order } = DatabaseUtil.data;
        NetworkUtil.createOrder(setting.id, order)
            .then((response) => {
                console.log(response);
                DatabaseUtil.setOrderFromResponse(response);
                if (DatabaseUtil.orderHasChanged()) {
                    // this.props.navigation.navigate('ServiceProcess');
                    
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'ServiceProcess' })],
                      });
                      this.props.navigation.dispatch(resetAction);


                }
            });
    }

    _renderPaypalButtonOrActivityIndicator = () => {
        if (this.state.payLoading) {
            return (
                <ActivityIndicator
                    animating={true}
                    color={DefaultTheme.colors.primary}
                    // size={'large'}
                    style={{marginBottom: 10}}
                />
            );
        }

        return (
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

                <Button
                    mode="contained"
                    onPress={() => console.log('Pressed')}>
                    PaymentScreen
                </Button>
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