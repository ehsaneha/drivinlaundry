import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { List, Divider, Avatar, Button, Card, Title, Paragraph, FAB, DefaultTheme } from 'react-native-paper';

import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'

class OrderReciepeScreen extends Component {
       
    constructor(props) {
        super(props);

        this.totalCost = 0;

        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
    }

    componentDidMount = () => {
        this.props.screenProps(this);
    }

    beforeNextFABPressed = () => {
        DatabaseUtil.data.order.cost = this.totalCost.toString();
        return true;
    }
    
    render() {
        const { driver, laundry } = DatabaseUtil.data.order;
        const driverAvatarSource = {uri: NetworkUtil.getAvatarUri(driver.avatar)};
        const laundryAvatarSource = {uri: NetworkUtil.getAvatarUri(laundry.avatar)};
        const primaryColor = DefaultTheme.colors.primary;

        const usingAppCost = 0.49;
        const tax = 1;
        this.totalCost = 
            (typeof driver.cost == 'string' ? parseFloat(driver.cost.replace(',', '.')) : driver.cost) + 
            (typeof laundry.cost == 'string' ? parseFloat(laundry.cost.replace(',', '.')) : laundry.cost) + 
            usingAppCost + 
            tax;

        return (
            <View style={styles.container}>

                <Title style={{marginBottom: 15}}>Costs:</Title>

                <View style={{ flexDirection: 'row', }}>
                    <Avatar.Image
                        source={driverAvatarSource}
                        key={driverAvatarSource.uri}
                    />

                    <View style={{ marginLeft: 15 }}>
                        <Title style={{fontSize: 17}}>{driver.name}</Title>
                        <Text>{driver.cost} €</Text>
                    </View>
                    
                    <Avatar.Icon
                        style={[{ backgroundColor: 'white' }, styles.farRightside]}
                        icon={'add'}
                        size={50}
                        color={'black'}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Avatar.Image
                        source={laundryAvatarSource}
                        key={laundryAvatarSource.uri}
                    />

                    <View style={{ marginLeft: 15 }}>
                        <Title style={{fontSize: 17}}>{laundry.name}</Title>
                        <Text>{laundry.cost} €</Text>
                    </View>
                    
                    <Avatar.Icon
                        style={[{ backgroundColor: 'white' }, styles.farRightside]}
                        icon={'add'}
                        size={50}
                        color={'black'}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ marginLeft: 15 }}>
                        <Title style={{fontSize: 17}}>For using the app</Title>
                        <Text>{usingAppCost} €</Text>
                    </View>
                    
                    <Avatar.Icon
                        style={[{ backgroundColor: 'white' }, styles.farRightside]}
                        icon={'add'}
                        size={50}
                        color={'black'}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ marginLeft: 15 }}>
                        <Title style={{fontSize: 17}}>Tax</Title>
                        <Text>{tax} €</Text>
                    </View>

                    <Avatar.Icon
                        style={[{ backgroundColor: 'white' }, styles.farRightside]}
                        icon={'add'}
                        size={50}
                        color={'black'}
                    />
                </View>

                <Divider style={{backgroundColor: 'black'}}/>

                <View style={{ marginLeft: 15, marginTop: 10, }}>
                    <Title style={{fontSize: 17}}>Total</Title>
                    <Title style={[styles.farRightside, {fontSize: 17}]}>{this.totalCost} €</Title>
                </View>

            </View>
        );
    }
}
export { OrderReciepeScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    farRightside: {
        position: 'absolute',
        right: 0,
        marginRight: 20,
    }
});