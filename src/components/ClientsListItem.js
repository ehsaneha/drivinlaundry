import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Appbar, Avatar, Button, Card, Title, Paragraph, FAB, TextInput, DefaultTheme } from 'react-native-paper';

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
        const {id, name, phone, avatar} = this.props.itemInfo;

        this.setState({
            active: true
        });

        this.props.onPressItem(id, name, phone, avatar);
    }

    deActivate = () => {
        this.setState({
            active: false
        });
    }

    render() {
        const activeTheme = { textColor: 'white', backgroundColor: DefaultTheme.colors.primary };
        const deActiveTheme = { textColor: 'black', backgroundColor: 'white' };

        const {itemInfo, iconName} = this.props;
        const {card, container} = styles;
        const { active } = this.state;
        
        return (
            <Card 
                style={[card, {backgroundColor: active ? activeTheme.backgroundColor : deActiveTheme.backgroundColor}]} 
                onPress={this._onPress}
            >
                <Card.Content style={container}>
                    <Avatar.Icon icon={iconName} />
                    <View>

                        <Title
                            style={{color: active ? activeTheme.textColor : deActiveTheme.textColor}}
                        >
                            {itemInfo.name}
                        </Title>

                        <Paragraph
                            style={{color: active ? activeTheme.textColor : deActiveTheme.textColor}}
                        >
                            Card content
                        </Paragraph>

                    </View>
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