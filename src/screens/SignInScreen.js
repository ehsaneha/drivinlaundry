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

import HandleBackButton from '../components/HandleBackButton'
// import { TouchableOpacity } from "react-native-gesture-handler";
import UserUtil from '../utils/UserUtil'

class SignInScreen extends Component {
    initState = {
        text: '',
        phoneText: '',
        passwordText: '',
        loading: false,
    };

    state = this.initState;

    _signUpPressed = () => {
        this.props.navigation.navigate('SignUp');
    }

    _signInPressed = () => {
        Keyboard.dismiss();
        this.setState({
            loading: true,
        });

        new UserUtil().getUserByPhonePassword(
            this.state,
            userType => this.props.navigation.navigate(userType === 1 ? 'Home' : 'HomeDriver'),
            () => {
                this.setState({
                    loading: false,
                });
            }
        );
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
            <HandleBackButton>
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
            </HandleBackButton>
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