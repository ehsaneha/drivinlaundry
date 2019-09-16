import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,Alert,
    Button,
} from "react-native";
// import { StackActions, NavigationActions } from 'react-navigation';
import NetworkUtil from '../network/NetworkUtil';
import DatabaseUtil from "../database/DatabaseUtil";

class SplashScreen extends Component {

    componentDidMount() {
        this.timeoutHandle = setTimeout(this._gotoNextScreen, 2000);
    }

    _gotoNextScreen = () => {
        DatabaseUtil.getSetting()
            .then((settingIsValid) => {

                if(settingIsValid) {
                    const { userType } = DatabaseUtil.data.setting;
                    this.props.navigation.navigate(userType === 1 ? 'Home' : 'HomeDriver')
                }
                else this.props.navigation.navigate('SignIn')

            });
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Button
                    title="Ehsan"
                    onPress={this._gotoNextScreen}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export { SplashScreen };