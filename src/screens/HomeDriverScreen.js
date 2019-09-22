import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    BackHandler,
    Image,
} from "react-native";
import { Modal, Portal, Appbar, Avatar, Button, Card, Title, Paragraph, FAB, DefaultTheme } from 'react-native-paper';

import HandleBackButton from '../components/HandleBackButton'
import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'
import ServiceProcess from '../components/ServiceProcess'

class HomeDriverScreen extends Component {
    state = {
        fabVisible: true,
        online: false,
        serviceProcessExists: false,
    };

    componentDidMount = () => {
        this._getOrderIfExists();
    }

    _visibilityFABPressed = () => {
        const { setting } = DatabaseUtil.data;
        NetworkUtil.updateUserOnline(setting, !this.state.online)
            .then((online) => {
                // DatabaseUtil.data.setting.online = online;

                // DatabaseUtil.storeSetting()
                //     .then(() => {
                this.setState(prevState => {
                    state = { ...prevState };
                    state.online = online;
                    return state;
                });
                // });

            });
    }

    _getOrderIfExists = () => {
        NetworkUtil.getOrderByUserId(DatabaseUtil.data.setting)
            .then((response) => {
                console.log(response);
                if (response.id > 0) {
                    DatabaseUtil.setOrderFromResponse(response);

                    this.setState(prevState => {
                        state = { ...prevState };
                        state.serviceProcessExists = true;
                        state.fabVisible = false;
                        return state;
                    });

                }
                else setTimeout(this._getOrderIfExists, 15000);
            });
    }

    _onServiceProcessDone = () => {
        this.setState(prevState => {
            state = { ...prevState };
            state.serviceProcessExists = false;
            state.fabVisible = true;
            return state;
        });
        this._getOrderIfExists();
    }

    _renderServiceProcessIfExists = () => {
        if (this.state.serviceProcessExists) {
            return (
                <ServiceProcess
                    info={DatabaseUtil.data.order}
                    onDone={this._onServiceProcessDone}
                />
            );
        }
    }

    _renderFABIFNeeded = () => {
        const { online, fabVisible } = this.state;
        if(fabVisible) {
            return(
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.fab}
                    icon={online ? "visibility" : "visibility-off"}
                    onPress={this._visibilityFABPressed}
                />
            );
        }
    }

    render() {
        return (
            <HandleBackButton>
                <View style={{ flex: 1 }}>
                    <Appbar.Header>
                        <Appbar.Content />
                        <Appbar.Action icon="settings" onPress={() => this.props.navigation.push('Settings')} />
                    </Appbar.Header>

                    <Image
                        style={styles.backgroundImage}
                        source={require('../assets/map.png')}
                    />

                    {this._renderServiceProcessIfExists()}

                    {this._renderFABIFNeeded()}
                    
                </View>
            </HandleBackButton>
        );
    }
};

export { HomeDriverScreen };



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    card: {
        margin: 5,
    },
    fab: {
        backgroundColor: 'white',
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
    }
});