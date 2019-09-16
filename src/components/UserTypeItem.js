import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";
import { DefaultTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

class UserTypeItem extends Component {

    activatedColor = DefaultTheme.colors.primary;
    deActivatedColor = '#fff';

    state = {
        active: 0,
        backgroundColor: this.props.active ? this.activatedColor : this.deActivatedColor,
        color: this.props.active ? this.deActivatedColor : this.activatedColor,
    };

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        // this.props.onRef(undefined)
    }

    toggleActivate = () => {
        if (this.state.backgroundColor === this.activatedColor) {
            this.setState({
                backgroundColor: this.deActivatedColor,
                color: this.activatedColor
            });
        }
        else {
            this.setState({
                backgroundColor: this.activatedColor,
                color: this.deActivatedColor
            });
        }

    }

    render() {
        const { style, iconName, id, onPress } = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={() => onPress(id)}>
                <View
                    style={[
                        styles.icon,
                        { 
                            backgroundColor: this.state.backgroundColor,
                            borderColor: this.activatedColor, 
                        },
                        style]}>
                    <Icon
                        name={iconName}
                        size={30}
                        style={{
                            color: this.state.color
                        }}
                    />
                </View >
            </TouchableWithoutFeedback>
        );
    }
}
export default UserTypeItem;

const styles = StyleSheet.create({
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "black",
        borderWidth: 1
    }
});