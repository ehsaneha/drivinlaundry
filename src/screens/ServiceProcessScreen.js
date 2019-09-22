import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import { Appbar, FAB, ActivityIndicator, DefaultTheme, Title } from 'react-native-paper';

import DatabaseUtil from '../database/DatabaseUtil'
import ServiceProcess from '../components/ServiceProcess'
import HandleBackButton from '../components/HandleBackButton'

class ServiceProcessScreen extends Component {

    _onServiceProcessDone = () => {
        this.props.navigation.navigate('Rating');
    }

    render() {
        return (
            <HandleBackButton>
                <View style={{ flex: 1 }}>

                    <Appbar.Header>
                        {/* <View style={{ flexDirection: 'row', height: 40, marginLeft: 10 }}>
                        <Image
                            style={{ height: 40, width: 40 }}
                            source={require('../assets/imgs/logo.png')}
                        />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ color: 'white' }}>
                                Drivin'
                            </Text>
                            <Text style={{ marginTop: -5, color: 'white' }}>
                                Laundry
                        </Text>
                        </View>
                    </View> */}
                        <Appbar.Content
                            titleStyle={{ textAlign: 'center' }}//, paddingRight: 15
                            title="Service Process"
                        />
                    </Appbar.Header>


                    <ServiceProcess
                        info={DatabaseUtil.data.order}
                        onDone={this._onServiceProcessDone}
                    />
{/* 
                    <Image
                        style={styles.backgroundImage}
                        source={require('../assets/map.png')}
                    /> */}
                </View>
            </HandleBackButton>

        );
    }
}
export { ServiceProcessScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
        zIndex: 200,
    },
});