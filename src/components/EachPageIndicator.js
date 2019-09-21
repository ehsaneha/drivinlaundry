import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated
} from "react-native";

import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { DefaultTheme } from 'react-native-paper'

import TShirtIcon from '../components/TShirtIcon'

class EachPageIndicator extends Component {

    constructor(props) {
        super(props)

        state = {
            active: 0,

        };

        this.activatedColor = '#fff'//'#ccc'
        this.deActivatedColor = DefaultTheme.colors.primary;//'#555'

        if(props.active) {
            this.backgroundColor = new Animated.Value(150);
            this.color = this.activatedColor;
        }
        else {
            this.backgroundColor = new Animated.Value(0);
            this.color = this.deActivatedColor;
        }

        this._renderIcon = this._renderIcon.bind(this);

    }


    componentDidMount() {
        this.props.onRef(this);

    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    toggleActivate = () => {
        if (this.color === this.activatedColor) {
            Animated.timing(this.backgroundColor, {
                toValue: 0,
                duration: 1000,
            }).start();

            this.color = this.deActivatedColor;
        }
        else {
            Animated.timing(this.backgroundColor, {
                toValue: 150,
                duration: 1000,
            }).start();

            this.color = this.activatedColor;
        }
    }

    // deActivate = () => {
    //     Animated.timing(this.state.xValue, {
    //         toValue: 100,
    //         duration: 1000,
    //         asing: Easing.inOut,
    //     }).start();
    // }

    _renderIcon = () => {
        const { index, iconName } = this.props;

        return index === 0 ?
        (
            <TShirtIcon
                name={iconName}
                size={27}
                style={{
                    color: this.color
                }} 
            />
        ) :
        (
            <Icon
                name={iconName}
                size={30}
                style={{
                    color: this.color
                }} 
            />
        );
    }

    render() {
        const backgroundColor = this.backgroundColor.interpolate({
            inputRange: [0, 150],
            outputRange: [this.activatedColor, this.deActivatedColor]
        });

        return (
            <Animated.View style={[styles.icon, { backgroundColor, borderColor: this.deActivatedColor, }, this.props.style]}>
                {this._renderIcon()}
            </Animated.View>
        );
    }
}
export default EachPageIndicator;

const styles = StyleSheet.create({
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    }
});