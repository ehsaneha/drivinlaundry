import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Appbar, Avatar, Button, Card, Title, Paragraph, FAB, TextInput, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

class LocationsListItem extends Component {

    

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
        const {latitude, longitude, key} = this.props.itemInfo;

        this.setState({
            active: true
        });

        this.props.onPressItem(latitude, longitude, key);
    }

    deActivate = () => {
        this.setState({
            active: false
        });
    }

    _renderIconIfExists = (active, activeTheme, deActiveTheme) => {
        const {iconName} = this.props.itemInfo;

        if(iconName) {
            return (
                <Icon 
                    name={iconName} 
                    size={25} 
                    style={{marginRight: 5}} 
                    color={active ? activeTheme.textColor : deActiveTheme.textColor}
                />
            );
        }
    }

    render() {
        const activeTheme = { textColor: 'white', backgroundColor: DefaultTheme.colors.primary };
        const deActiveTheme = { textColor: 'black', backgroundColor: 'white' };

        const {latitude, longitude, title} = this.props.itemInfo;
        const { active } = this.state;

        return (
            <Card 
                style={[styles.card, {backgroundColor: active ? activeTheme.backgroundColor : deActiveTheme.backgroundColor}]} 
                onPress={this._onPress}
            >
                <Card.Content>
                    <View style={{flexDirection: 'row', height: 25}}>
                        {this._renderIconIfExists(active, activeTheme, deActiveTheme)}
                        <Title 
                            style={{alignSelf: 'center', color: active ? activeTheme.textColor : deActiveTheme.textColor}}
                        >
                            {title}
                        </Title>
                    </View>
                    <Paragraph 
                        style={{color: active ? activeTheme.textColor : deActiveTheme.textColor}}
                    >
                        {latitude}, {longitude}
                    </Paragraph>
                </Card.Content>
            </Card>
        );
    }
}
export default LocationsListItem;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 3,
    }
});