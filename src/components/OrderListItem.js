import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Appbar, Avatar, Button, Card, Title, Paragraph, FAB, TextInput } from 'react-native-paper';

class OrderListItem extends Component {
    _onPress = () => {
        this.props.onPressItem();
      };

    render() {
        return (
            <Card style={styles.card} onPress={this._onPress}>
                <Card.Content style={{ flexDirection: 'row' }}>
                    <Avatar.Icon icon="folder" />
                    <Avatar.Icon icon="local-taxi" style={{ marginLeft: 15 }} />
                    <Avatar.Icon icon="local-laundry-service" style={{ marginLeft: 15 }} />
                    <View style={{ marginLeft: 15 }}>
                        <Title>Card title</Title>
                        <Paragraph>Card content</Paragraph>
                    </View>
                </Card.Content>
            </Card>
        );
    }
}
export default OrderListItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        margin: 5,
    }
});