import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { Avatar, Appbar, TextInput, ActivityIndicator, Button  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
// import Icon as IconF from 'react-native-vector-icons/dist/FontAwesome';
import ImagePicker from 'react-native-image-picker';

import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'
import LogoutIcon from '../components/LogoutIcon'

class SettingsScreen extends Component {

    constructor(props) {
        super(props);

        const { id, name, phone, password, avatar, cost } = DatabaseUtil.data.setting;
        this.state = {
            id,
            avatarSource: { uri: NetworkUtil.getAvatarUri(avatar), cache: 'reload' },
            nameText: name,
            phoneText: phone,
            passwordText: password,
            costText: cost,
            backLoading: false,
        };

    }

    _backPressed = () => {
        const { nameText, phoneText, passwordText, costText } = this.state;
        const { name, phone, password, cost } = DatabaseUtil.data.setting;
        if (nameText !== name || phoneText !== phone || passwordText !== password || costText !== cost) {

            this.setState((prevState) => {
                state = { ...prevState };
                state.backLoading = true;
                return state;
            }, () => {

                NetworkUtil.updateUser(this.state)
                    .then((response) => {
                        console.log(response);
                        DatabaseUtil.setSettingFromResponse(response);

                        DatabaseUtil.storeSetting();
                        this.props.navigation.goBack(null);

                    });

            });

        }
        else {
            this.props.navigation.goBack(null)
        }
    }

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

                NetworkUtil.uploadImage(DatabaseUtil.data.setting, response)
                    .then((avatar) => {
                        DatabaseUtil.data.setting.avatar = avatar;
                        this.setState(prevState => {
                            state = {...prevState};
                            state.avatarSource = { uri: NetworkUtil.getAvatarUri(avatar), cache: 'reload' };
                            return state;
                        });
                        DatabaseUtil.storeSetting();
                    })
                    .catch((error) => {
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                    });
            }
        });


    }

    _SignOutButtonPresssed = () => {
        DatabaseUtil.clearSetting()
            .then(() => this.props.navigation.navigate('SignIn'));
    }


    _renderButtonOrActivityIndicator = () => {
        return this.state.backLoading ?
            (
                <ActivityIndicator
                    animating={true}
                    color={'white'}
                    style={{marginLeft: 25}}
                />
            ) :
            (
                <Appbar.Action 
                    icon="arrow-back" 
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

                    {this._renderButtonOrActivityIndicator()}
                    
                    <Appbar.Content
                        titleStyle={{ textAlign: 'center', paddingRight: 15 }}
                        title="Settings"
                    />
                    <Appbar.Action />
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