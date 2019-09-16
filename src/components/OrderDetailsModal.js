import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from "react-native";
import { DefaultTheme, Avatar, Button, Card, Title, Paragraph, TextInput, Dialog } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';

import OrderDetailsModelClothingListItem from '../components/OrderDetailsModelClothingListItem'

class OrderDetailsModal extends Component {

    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    _renderEachListItem = ({ item }) => {
        return (
            <OrderDetailsModelClothingListItem
                itemInfo={item}
                iconName={item.iconName}
                count={item.count}
            />
        );
    }

    render() {
        const data = [
            { iconName: 'Asset-121mdpi', count: 1 },
            { iconName: 'Asset-122mdpi', count: 2 },
            { iconName: 'Asset-123mdpi', count: 2 },
            { iconName: 'Asset-124mdpi', count: 4 },
            { iconName: 'Asset-125mdpi', count: 2 },
            { iconName: 'Asset-126mdpi', count: 20 },
        ];

        return (
            <Card style={{ marginHorizontal: 10 }}>
                <Card.Content >
                    <View style={{ flexDirection: 'row' }}>
                        <Avatar.Icon icon="person" />
                        <View style={{ marginLeft: 15 }}>
                            <Title>Card title</Title>
                            <Paragraph>Card content</Paragraph>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Button mode='contained'>
                                Redo
                            </Button>
                        </View>
                    </View>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginTop: 10 }}
                        data={data}
                        renderItem={this._renderEachListItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                        <Avatar.Icon icon="local-taxi" />
                        <View style={{ marginLeft: 15 }}>
                            <Title>Card title</Title>
                            <Paragraph>Card content</Paragraph>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <AirbnbRating
                                starSize={25}
                                onFinishRating={this.ratingCompleted}
                                selectedColor={DefaultTheme.colors.primary}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                        <Avatar.Icon icon="local-laundry-service" />
                        <View style={{ marginLeft: 15 }}>
                            <Title>Card title</Title>
                            <Paragraph>Card content</Paragraph>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <AirbnbRating
                                starSize={25}
                                onFinishRating={this.ratingCompleted}
                                selectedColor={DefaultTheme.colors.primary}
                            />
                        </View>
                    </View>
                </Card.Content>
            </Card>
        );
    }
}
export default OrderDetailsModal;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        justifyContent: 'center'
    }
});