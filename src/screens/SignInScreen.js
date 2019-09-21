import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    ToastAndroid,
    Keyboard,
} from "react-native";
import { Button, TextInput, DefaultTheme, ActivityIndicator } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';

import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'
import ExitOnBackButton from '../components/ExitOnBackButton'
// import { TouchableOpacity } from "react-native-gesture-handler";

class SignInScreen extends Component {
    initState = {
        text: '',
        phoneText: '',
        passwordText: '',
        loading: false,
    };

    state = this.initState;

    _signUpPressed = () => {
        this.props.navigation.navigate('SignUp')
    }

    _signInPressed = () => {
        // this.props.navigation.navigate('Home');
        Keyboard.dismiss();
        this.setState((prevState) => {
            state = { ...prevState };
            state.loading = true;
            return state;
        }, () => {
            NetworkUtil.getUserByPhonePassword(this.state)
                .then((response) => {
                    console.log(response);
                    if (response.id > -1) {
                        DatabaseUtil.setSettingFromResponse(response);

                        DatabaseUtil.storeSetting()
                            .then(() => {
                                const { userType } = DatabaseUtil.data.setting;
                                this.props.navigation.navigate(userType === 1 ? 'Home' : 'HomeDriver')
                            });

                    }
                    else {
                        ToastAndroid.show('Your Phone or Password was not correct!', ToastAndroid.SHORT);

                        this.setState((prevState) => {
                            state = { ...prevState };
                            state.loading = false;
                            return state;
                        });
                    }
                });
        });
    }

    _renderButtonOrActivityIndicator = () => {
        return this.state.loading ?
            (
                <ActivityIndicator
                    animating={true}
                    color={DefaultTheme.colors.primary}
                    // size={'large'}
                    style={{ marginTop: 20 }}
                />
            ) :
            (
                <Button
                    style={{ alignSelf: 'center', marginTop: 20 }}
                    mode="contained"
                    onPress={this._signInPressed}
                >
                    Sign In
                </Button>
            );
    }

    render() {
        const { phoneText, passwordText } = this.state;
        return (
            <ExitOnBackButton>
                <NavigationEvents onWillFocus={() => this.setState(this.initState)} />
                <View style={styles.container}>

                    <TextInput
                        style={styles.textInput}
                        label='Phone'
                        value={phoneText}
                        onChangeText={phoneText => this.setState({ phoneText })}
                        keyboardType={'numeric'}
                    />

                    <TextInput
                        style={[styles.textInput, { marginTop: 5 }]}
                        label='Password'
                        value={passwordText}
                        onChangeText={passwordText => this.setState({ passwordText })}
                        secureTextEntry={true}
                    />

                    {this._renderButtonOrActivityIndicator()}

                    <View
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            marginTop: 20
                        }}
                    >
                        <Text>I don't have an account.</Text>
                        <TouchableOpacity onPress={this._signUpPressed} >
                            <Text
                                style={{
                                    color: DefaultTheme.colors.primary,
                                    fontWeight: 'bold',
                                    paddingLeft: 4
                                }}
                            >
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ExitOnBackButton>
        );
    }
}
export { SignInScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 200
    },
    textInput: {
        marginHorizontal: 40,
    }
});