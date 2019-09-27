import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
} from "react-native";
import { Avatar, Appbar, TextInput, ActivityIndicator, Button  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
// import Icon as IconF from 'react-native-vector-icons/dist/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { NavigationActions, StackActions } from 'react-navigation'

import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'
import LogoutIcon from '../components/LogoutIcon'
import UserUtil from '../utils/UserUtil'
import OrderUtil from "../utils/OrderUtil";

class SettingsScreen extends Component {

    constructor(props) {
        super(props);

        this.userUtil = new UserUtil();

        const { id, name, phone, password, avatar, cost, userType } = DatabaseUtil.data.setting;
        this.state = {
            id,
            avatarSource: this.userUtil.getAvatarUri(avatar),
            nameText: name,
            phoneText: phone,
            passwordText: password,
            costText: cost + '',
            userType,
            backLoading: false,
            imgLoading: false,
        };

    }

    _backPressed = () => {
        const { nameText, phoneText, passwordText, costText } = this.state;
        const { name, phone, password, cost, userType } = DatabaseUtil.data.setting;
        if (nameText !== name || phoneText !== phone || passwordText !== password || (costText != cost && userType > 1)) {

            this.setState({
                backLoading: true,
            }, () => {

                this.userUtil.updateUser(
                    this.state,
                    () => this.props.navigation.goBack(null),
                    () => this.setState({ backLoading: false, }),
                );

            });

        }
        else this.props.navigation.goBack(null)
    }
    
    _cancelPressed = () => this.props.navigation.goBack(null)

    _callCamera = () => {

        const options = {
            title: 'Select Avatar',
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // this.setState({
                //   avatarSource: source,
                // });

                this.setState({
                    imgLoading: true,
                }, () => {

                    this.userUtil.uploadImage(
                        response,
                        avatarSource => 
                            this.setState({
                                avatarSource,
                                imgLoading: false,
                            }),
                        () => {}
                    );

                });
            }
        });


    }

    _SignOutButtonPresssed = () => {
        clearTimeout(NetworkUtil.serviceProcessTimeout);
        new OrderUtil().clearOrder();
        this.userUtil.clearSetting();

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'SignIn' })],
        });
        this.props.navigation.dispatch(resetAction);
    }


    _renderButtonOrActivityIndicator = () => {
        return this.state.backLoading ?
            (
                <ActivityIndicator
                    animating={true}
                    color={'white'}
                    style={{ marginRight: 25 }}
                />
            ) :
            (
                <Appbar.Action 
                    icon="check" 
                    onPress={this._backPressed} 
                />
            );
    }

    _renderCostInputIfUserIsDriver = () => {
        if(DatabaseUtil.data.setting.userType != 1) {
            const { costText } = this.state;
            return(
                <TextInput
                    style={styles.textInput}
                    label='cost'
                    value={costText}
                    onChangeText={costText => this.setState({ costText })}
                    keyboardType={'numeric'}
                />
            );
        }
    }

    _renderActivityIndicator = () => {
        if(this.state.imgLoading) {
            return(
                <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', height: 160, width: 160,}}>
                    <ActivityIndicator
                        animating={true}
                        color={'white'}
                    />
                </View>
            );
        }
    }

    _renderAvatar = () => {
        const {avatar} = DatabaseUtil.data.setting;
        return avatar == 'avatar.jpg' || avatar == 'avatar.jpeg' ?
        (
            <Avatar.Icon size={160} icon={'person'} />
        ) :
        (
            <Avatar.Image
                size={160}
                source={this.state.avatarSource}
                key={this.state.avatarSource.uri}
            />
        );
    }

    render() {
        const { phoneText, nameText, passwordText } = this.state;
        return (
            <View style={styles.container}>

                <Appbar.Header>

                    <Appbar.Action 
                        icon="close" 
                        onPress={this._cancelPressed} 
                    />

                    <Appbar.Content
                        titleStyle={{ textAlign: 'center' }}
                        title="Settings"
                    />

                    {this._renderButtonOrActivityIndicator()}

                </Appbar.Header>

                <View style={styles.selectImageSection}>
                    <View>
                        <TouchableOpacity onPress={this._callCamera}>
                            {this._renderAvatar()}
                        </TouchableOpacity>

                        <Avatar.Icon
                            style={{ position: 'absolute', right: 5, bottom: 5, borderWidth: 1, borderColor: 'white' }}
                            size={30}
                            icon={({ size, color }) => (
                                <Icon name={'photo-camera'} size={size} color='white' />
                            )}
                        />

                        {this._renderActivityIndicator()}
                    </View>
                </View>

                <TextInput
                    style={styles.textInput}
                    label='Phone'
                    value={phoneText}
                    onChangeText={phoneText => this.setState({ phoneText })}
                    keyboardType={'numeric'}
                />

                <TextInput
                    style={[styles.textInput, { marginVertical: 5 }]}
                    label='name'
                    value={nameText}
                    onChangeText={nameText => this.setState({ nameText })}
                />

                <TextInput
                    style={styles.textInput}
                    label='Password'
                    value={passwordText}
                    onChangeText={passwordText => this.setState({ passwordText })}
                    secureTextEntry={true}
                />

                {this._renderCostInputIfUserIsDriver()}

                <Button 
                    icon={({ size, color }) => (
                        <LogoutIcon name={'logout'} size={size} color={color} />
                    )}
                    onPress={this._SignOutButtonPresssed}
                    style={{marginTop: 10,  width: 180}}
                    uppercase={false}
                >
                    Sign Out
                </Button>

            </View>
        );
    }
}
export { SettingsScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    textInput: {
        marginHorizontal: 40,
    },
    selectImageSection: {
        alignItems: 'center',
        marginVertical: 20
    },
});