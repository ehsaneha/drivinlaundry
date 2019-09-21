import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,Alert,
    Button,
    Image,
    Dimensions,
} from "react-native";
import { Title, DefaultTheme } from 'react-native-paper';
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

                const {navigation} = this.props;
                if(settingIsValid) {
                    DatabaseUtil.getOrder()
                        .then((orderIsValid) => {
                            
                            console.log(orderIsValid);
                            if(orderIsValid) {
                                const {done_time} = DatabaseUtil.data.order;
                                navigation.navigate(done_time === '' ? 'ServiceProcess' : 'Rating');
                            }
                            else {
                                const { userType } = DatabaseUtil.data.setting;
                                navigation.navigate(userType === 1 ? 'Home' : 'HomeDriver');
                            }

                        });
                    
                }
                else navigation.navigate('SignIn');

            });
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

    render() {
        screenWidth = Math.round(Dimensions.get('window').width);
        screenHeight = Math.round(Dimensions.get('window').height);
        const circlesHeight = 70;
        return (
            <View style={{ flex: 1 }}>
                {/* <Image
                    style={styles.backgroundImage}
                    source={require('../assets/imgs/splash-screen-bg.png')}
                /> */}

                <View
                    style={{
                        width: screenWidth,
                        height: screenHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        zIndex: 100,
                        marginTop: -50,
                    }}
                >
                    <View style={{alignSelf: 'center'}}>
                        <Text style={{alignSelf: 'center', fontSize: 40}}>
                            Drivin'
                        </Text>
                        <Text style={{alignSelf: 'center', fontSize: 40, marginTop: -20, marginBottom: 10}}>
                            Laundry
                        </Text>
                        <Image
                            style={{
                                height: 130,
                                alignSelf: 'center'
                            }}
                            source={require('../assets/imgs/logo.png')}
                        />
                    </View>

                </View>

                <View style={{backgroundColor: DefaultTheme.colors.primary}}>
                    

                <View 
                    style={{
                        backgroundColor: 'white', 
                        height: 200,
                        marginTop: 50,
                        borderTopLeftRadius: 300,
                        borderTopEndRadius: 300,
                    }} 
                />
                    
                </View> 

                <View 
                    style={{
                        backgroundColor: DefaultTheme.colors.primary, 
                        height: 150,
                        width: screenWidth,
                        position: 'absolute',
                        bottom: 0,
                    }}
                >
                    <View
                        style={{
                            height: circlesHeight,
                            width: screenWidth,
                            position: 'absolute',
                            top: -circlesHeight/2,
                            flexDirection: 'row'
                        }}
                    >
                    <View 
                        style={{
                            backgroundColor: DefaultTheme.colors.primary, 
                            height: circlesHeight,
                            width: circlesHeight,
                            borderRadius: circlesHeight/2,
                        }} 
                    />
                    <View 
                        style={{
                            backgroundColor: DefaultTheme.colors.primary, 
                            height: circlesHeight,
                            width: circlesHeight,
                            borderRadius: circlesHeight/2,
                        }} 
                    />
                    <View 
                        style={{
                            backgroundColor: DefaultTheme.colors.primary, 
                            height: circlesHeight,
                            width: circlesHeight,
                            borderRadius: circlesHeight/2,
                        }} 
                    />
                    <View 
                        style={{
                            backgroundColor: DefaultTheme.colors.primary, 
                            height: circlesHeight,
                            width: circlesHeight,
                            borderRadius: circlesHeight/2,
                        }} 
                    />
                    <View 
                        style={{
                            backgroundColor: DefaultTheme.colors.primary, 
                            height: circlesHeight,
                            width: circlesHeight,
                            borderRadius: circlesHeight/2,
                        }} 
                    />
                    <View 
                        style={{
                            backgroundColor: DefaultTheme.colors.primary, 
                            height: circlesHeight,
                            width: circlesHeight,
                            borderRadius: circlesHeight/2,
                        }} 
                    />
                    </View>

                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
    }
});


export { SplashScreen };