import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Appbar, Avatar, Button, Card, Title, Paragraph, FAB, TextInput, DefaultTheme } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';

class ClientsListItem extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            active: props.active
        }
    }
    
    componentDidMount = () => {
        this.props.onRef(this);
    }

    _onPress = () => {
        const {id, name, phone, avatar, cost} = this.props.itemInfo;

        this.setState({
            active: true
        });

        this.props.onPressItem(id, name, phone, avatar, cost);
    }

    deActivate = () => {
        this.setState({
            active: false
        });
    }

    render() {
        const activeTheme = { textColor: 'white', backgroundColor: DefaultTheme.colors.primary };
        const deActiveTheme = { textColor: 'black', backgroundColor: 'white' };

        const {itemInfo, iconName, avatarSource} = this.props;
        const {card, container} = styles;
        const { active } = this.state;

        const rating = itemInfo.rating == '' ? 3 : Math.round(itemInfo.rating);
        const cost = itemInfo.cost == '' ? 5 : itemInfo.cost;

        return (
            <Card 
                style={[card, {backgroundColor: active ? activeTheme.backgroundColor : deActiveTheme.backgroundColor}]} 
                onPress={this._onPress}
            >
                <Card.Content style={container}>
                    {/* <Avatar.Icon icon={iconName} /> */}
                    <Avatar.Image
                        // size={160}
                        source={avatarSource}
                        key={avatarSource.uri}
                    />

                        <Title
                            style={{
                                color: active ? activeTheme.textColor : deActiveTheme.textColor,
                                fontSize: 15
                            }}
                        >
                            {itemInfo.name}
                        </Title>

                        <AirbnbRating
                            size={15}
                            defaultRating={rating}
                            count={rating}
                            isDisabled
                            showRating={false}
                            onFinishRating={this.ratingCompleted}
                            selectedColor={active ? activeTheme.textColor : DefaultTheme.colors.primary}
                        />

                        <Title
                            style={{
                                color: active ? activeTheme.textColor : deActiveTheme.textColor,
                                fontSize: 15
                            }}
                        >
                            {cost} $
                        </Title>
                </Card.Content>
            </Card>
        );
    }
}
export default ClientsListItem;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 3,
    }
});