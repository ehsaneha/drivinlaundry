import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    Keyboard,
    ToastAndroid,

} from "react-native";
import { Button, TextInput, DefaultTheme, ActivityIndicator } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';

import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'
import HandleBackButton from '../components/HandleBackButton'
import UserTypeSelection from '../components/UserTypeSelection'
// import { TouchableOpacity } from "react-native-gesture-handler";

class SignUpScreen extends Component {
    initState = {
        nameText: '',
        phoneText: '',
        passwordText: '',
        confirmPasswordText: '',
        cost: '',
        userType: '',
        loading: false,
    };

    state = this.initState;

    setUserType = (userType) => {
        this.setState((prevState) => {
            state = { ...prevState };
            state.userType = userType;
            return state;
        });
    }

    _createUser = () => {
        NetworkUtil.createUser(this.state)
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
                    ToastAndroid.show('This Phone number is already registered!', ToastAndroid.LONG);
                    this.setState({
                        loading: false,
                    });
                }

            })
            .catch((error) => {
                ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                this.setState({
                    loading: false,
                });
            });
    }

    _validate = () => {
        const { passwordText, confirmPasswordText, } = this.state;

        if(passwordText !== confirmPasswordText) {
            ToastAndroid.show('password and confirm password is not the same!', ToastAndroid.LONG);
            return false;
        }


        return true;
    }

    _signUpPressed = () => {
        Keyboard.dismiss();

        if (this._validate()) {

            this.setState((prevState) => {
                state = { ...prevState };
                state.loading = true;

                state.cost = state.userType === 1 ? '0' : state.userType === 2 ? '1' : '2';

                return state;
            },
            this._createUser);

        }
    }

    _signInPressed = () => {
        this.props.navigation.navigate('SignIn')
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
                    onPress={this._signUpPressed}
                >
                    Sign Up
                </Button>
            );
    }

    render() {
        const { phoneText, nameText, passwordText, confirmPasswordText } = this.state;
        return (
            <HandleBackButton>
                <NavigationEvents onWillFocus={() => this.setState(this.initState)} />
                <View style={styles.container}>

                    <UserTypeSelection
                        style={{
                            alignSelf: 'center',
                            marginBottom: 40,
                        }}
                        onUserTypeChange={this.setUserType}
                    />

                    <TextInput
                        style={styles.textInput}
                        label='Phone'
                        value={phoneText}
                        onChangeText={phoneText => this.setState({ phoneText })}
                        keyboardType={'numeric'}
                    />

                    <TextInput
                        style={[styles.textInput, { marginTop: 5 }]}
                        label='name'
                        value={nameText}
                        onChangeText={nameText => this.setState({ nameText })}
                    />

                    <TextInput
                        style={[styles.textInput, { marginTop: 5 }]}
                        label='Password'
                        value={passwordText}
                        onChangeText={passwordText => this.setState({ passwordText })}
                        secureTextEntry={true}
                    />

                    <TextInput
                        style={[styles.textInput, { marginTop: 5 }]}
                        label='Confirm Password'
                        value={confirmPasswordText}
                        onChangeText={confirmPasswordText => this.setState({ confirmPasswordText })}
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
                        <Text>I have an account.</Text>
                        <TouchableOpacity onPress={this._signInPressed} >
                            <Text
                                style={{
                                    color: DefaultTheme.colors.primary,
                                    fontWeight: 'bold',
                                    paddingLeft: 4
                                }}
                            >
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </HandleBackButton>
        );
    }
}
export { SignUpScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 110
    },
    textInput: {
        marginHorizontal: 40,
    }
});