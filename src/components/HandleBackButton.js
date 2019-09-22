import React, { Component } from "react";
import { BackHandler, Alert, } from "react-native";
import { withNavigation } from "react-navigation";

class HandleBackButton extends Component {
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentDidMount() {
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    _exitProcess = () => {
        Alert.alert(
            'Exit Alert',
            'Do you want to exit the app?',
            [
                {
                    text: 'No',
                    onPress: () => false,
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        BackHandler.exitApp();
                    }
                },
            ],
            { cancelable: false },
        );
    }

    onBackButtonPressAndroid = () => {
        const {onPress} = this.props;

        if(onPress) {
            onPress();
        }
        else {
            this._exitProcess();
        }

        return true;
    };

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    render = () => this.props.children;
}

export default withNavigation(HandleBackButton);
