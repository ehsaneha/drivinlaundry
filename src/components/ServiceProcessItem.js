import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { Avatar, Title, Paragraph, DefaultTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

class ServiceProcessItem extends Component {


    iconsList = [
        { main: 'local-taxi', sub: 'arrow-forward' },
        { main: 'local-laundry-service', sub: 'check' },
        { main: 'local-taxi', sub: 'arrow-back' },
        { main: 'person', sub: 'check' },
    ];

    _onPress = () => {
        const { id, onPress } = this.props;
        onPress(id);
    }

    _renderButtonOrDoneOrActivityIndicatorIfNeeded = () => {
        const { doneIconVisible, buttonVisible } = this.props;//, loading

        // if (loading) {
        //     return (
        //         <ActivityIndicator
        //             animating={true}
        //             color={DefaultTheme.colors.primary}
        //             // size={'large'}
        //             style={{ marginLeft: 'auto' }}
        //         />
        //     );
        // }
        // else 
        if (buttonVisible) {
            return (
                <TouchableOpacity
                    style={{ marginLeft: 'auto' }}
                    onPress={this._onPress}
                >
                    <Avatar.Icon icon={'check'} size={50} />
                </TouchableOpacity>
            );
        }
        else if (doneIconVisible) {
            return (
                <Avatar.Icon
                    style={{ marginLeft: 'auto', backgroundColor: 'white' }}
                    icon={'check'}
                    size={50}
                    color={'black'}
                />
            );
        }
    }

    _renderTurnIndicatorCenterIfIsTurn() {
        if (this.props.turn) {
            return (
                <View style={styles.turnIndicatorCenter}></View>
            );
        }
    }

    render() {
        const { id, title } = this.props;
        return (
            <View style={styles.container}>

                <View style={styles.turnIndicatorBorder}>
                    {this._renderTurnIndicatorCenterIfIsTurn()}
                </View> 

                <View>
                    <Avatar.Icon
                        style={{ backgroundColor: 'white' }}
                        icon={this.iconsList[id].main}
                        size={40}
                        color={'black'}
                    />
                    <Avatar.Icon
                        style={{ position: 'absolute', right: -5, top: -5, backgroundColor: 'transparent' }}
                        icon={this.iconsList[id].sub}
                        size={30}
                        color={DefaultTheme.colors.primary}
                    />
                </View>

                <View style={{ marginLeft: 5 }}>
                    <Title style={{ marginBottom: 0, fontSize: 16 }}>{title}</Title>
                    <Paragraph style={{ marginTop: 0 }}>Card content</Paragraph>
                </View>

                {this._renderButtonOrDoneOrActivityIndicatorIfNeeded()}
            </View>
        );
    }
}
export default ServiceProcessItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    turnIndicatorBorder: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    turnIndicatorCenter: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'black'
    }
});