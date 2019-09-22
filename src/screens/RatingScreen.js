import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    BackHandler,
} from "react-native";
import { Appbar, Avatar, Button, Card, Title, Paragraph, FAB, DefaultTheme } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';

import HandleBackButton from '../components/HandleBackButton'
import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'

class RatingScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fabVisible: true,
            loading: false,
        };

        this.driverRating = 3;
        this.laundryRating = 3;

        this._FABPressed = this._FABPressed.bind(this);

    }

    _FABPressed = () => {
        const { driver, laundry } = DatabaseUtil.data.order;

        this.setState((prevState) => {
            state = { ...prevState };
            state.fabVisible = false;
            state.loading = true;
            return state;
        }, () => {

            NetworkUtil.updateUserRating(driver.id, laundry.id, this.driverRating, this.laundryRating)
                .then((response) => {
                    console.log(response);

                    DatabaseUtil.clearOrder();
                    this.props.navigation.navigate('Home');
                });

        });

    }

    render() {
        const { driver, laundry } = DatabaseUtil.data.order;
        const driverAvatarSource = {uri: NetworkUtil.getAvatarUri(driver.avatar)};
        const laundryAvatarSource = {uri: NetworkUtil.getAvatarUri(laundry.avatar)};

        return (
            <HandleBackButton>
            <View style={{flex: 1}}>
                <Appbar.Header>
                        <Appbar.Content
                            titleStyle={{ textAlign: 'center' }}//, paddingRight: 15
                            title="Rating"
                        />
                    </Appbar.Header>
            <View style={styles.container}>

                <View style={{ flexDirection: 'row',}}>

                    <Avatar.Image
                        source={driverAvatarSource}
                        key={driverAvatarSource.uri}
                    />

                    <View style={{ marginLeft: 15 }}>
                        <Title>{driver.name}</Title>
                        <AirbnbRating
                            size={25}
                            showRating={false}
                            onFinishRating={rating => this.driverRating = rating}
                            selectedColor={DefaultTheme.colors.primary}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>

                    <Avatar.Image
                        source={laundryAvatarSource}
                        key={laundryAvatarSource.uri}
                    />

                    <View style={{ marginLeft: 15 }}>
                        <Title>{laundry.name}</Title>
                        <AirbnbRating
                            size={25}
                            showRating={false}
                            onFinishRating={rating => this.laundryRating = rating}
                            selectedColor={DefaultTheme.colors.primary}
                        />
                    </View>
                </View>

                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.fab}
                    icon={"check"}
                    onPress={this._FABPressed}
                />
            </View>
            </View>
            </HandleBackButton>
        );
    }
};

export { RatingScreen };



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    fab: {
        backgroundColor: 'white',
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});