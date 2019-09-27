import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from "react-native";
import { Avatar, Button, Card, DefaultTheme } from 'react-native-paper';

import OrderDetailsModelClothingListItem from '../components/OrderDetailsModelClothingListItem'

class OrderListItem extends Component {
    _onPress = () => {
        const {index, onPressItem} = this.props;
        onPressItem(index);
      };

      _renderEachListItem = ({ item }) => {
        return (
            <OrderDetailsModelClothingListItem
                itemInfo={item}
                type={item.type}
                count={item.count}
            />
        );
    }

    render() {
        const clothings = this.props.itemInfo;
        // const driverAvatarSource = NetworkUtil.getAvatarUri(driver.avatar);
        // const laundryAvatarSource = NetworkUtil.getAvatarUri(laundry.avatar);

        return (
            <Card style={styles.card}>
                <Card.Content style={{ flexDirection: 'row' }}>
                    {/* <Avatar.Icon icon="folder" />
                    
                    <Avatar.Image
                        source={driverAvatarSource}
                        key={driverAvatarSource.uri}
                        style={{ marginLeft: 15 }} 
                    />

                    <Avatar.Image
                        source={laundryAvatarSource}
                        key={laundryAvatarSource.uri}
                        style={{ marginLeft: 15 }} 
                    />
                    
                     <Avatar.Icon icon="local-taxi" style={{ marginLeft: 15 }} />
                    <Avatar.Icon icon="local-laundry-service" style={{ marginLeft: 15 }} />
                    <View style={{ marginLeft: 15 }}>
                        <Title>Card title</Title>
                        <Paragraph>{moment(done_time, "YYYYMMDD").fromNow()}</Paragraph>
                    </View> */}

                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        // style={{ marginTop: 10 }}
                        data={clothings}
                        renderItem={this._renderEachListItem}
                        keyExtractor={(item, index) => index + '_eachHistoryItemClothings'}
                    />

                    {/* <Button onPress={this._onPress} style={{alignSelf: 'center'}}>
                        Redo
                    </Button> */}

                    <TouchableOpacity onPress={this._onPress} style={{alignSelf: 'center'}}>
                        <Avatar.Icon size={40} icon='arrow-forward' style={{backgroundColor: 'white'}} color={DefaultTheme.colors.primary}/>
                    </TouchableOpacity>

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