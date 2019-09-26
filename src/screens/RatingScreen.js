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
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

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

        this.ratings = [3, 3];
        // this.driverRating = 3;
        // this.laundryRating = 3;

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

            NetworkUtil.updateUserRating(driver.id, laundry.id, this.ratings[0], this.ratings[1])
                .then((response) => {
                    console.log(response);

                    DatabaseUtil.clearOrder();
                    this.props.navigation.navigate('Home');
                    DatabaseUtil.reloadHistoryFunc();
                })
                .catch((error) => {
                    console.log(error);
                    ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                });

        });

    }

    _renderRatingItems = () => {
        const { driver, laundry } = DatabaseUtil.data.order;
        const driverAvatarSource = { uri: NetworkUtil.getAvatarUri(driver.avatar) };
        const laundryAvatarSource = { uri: NetworkUtil.getAvatarUri(laundry.avatar) };
        let users = [
            {value: driver, avatarSource: driverAvatarSource, iconName: 'local-taxi'}, 
            {value: laundry, avatarSource: laundryAvatarSource, iconName: 'local-laundry-service'}
        ];

        return users.map((each, index) => {
            return(
                <View 
                    key={index + '_eachRatingItems'}
                    style={{ flexDirection: 'row', marginTop: (index === 1 ? 10 : 0) }}>

                    <View>
                        <Avatar.Image
                            source={each.avatarSource}
                            key={each.avatarSource.uri}
                        />

                        <Avatar.Icon
                            style={{ position: 'absolute', left: -5, top: -5, borderWidth: 1, borderColor: 'white' }}
                            size={25}
                            icon={({ size, color }) => (
                                <Icon name={each.iconName} size={15} color='white' />
                            )}
                        />
                    </View>

                    <View style={{ marginLeft: 15 }}>
                        <Title>{each.value.name}</Title>
                        <AirbnbRating
                            size={25}
                            showRating={false}
                            onFinishRating={rating => this.ratings[index] = rating}
                            selectedColor={DefaultTheme.colors.primary}
                        />
                    </View>
                </View>
            );
        });
    }

    render() {

        return (
            <HandleBackButton>
                <View style={{ flex: 1 }}>
                    <Appbar.Header>
                        <Appbar.Content
                            titleStyle={{ textAlign: 'center' }}//, paddingRight: 15
                            title="Rating"
                        />
                    </Appbar.Header>

                    <View style={styles.container}>
                      {this._renderRatingItems()}
                    </View>

                        <FAB
                            color={DefaultTheme.colors.primary}
                            style={styles.fab}
                            icon={"check"}
                            onPress={this._FABPressed}
                        />
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