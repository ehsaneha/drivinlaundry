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

        this.state = {
            active: this.props.active,
        };

        // this.activatedColor = '#fff'//'#ccc'
        // this.deActivatedColor = DefaultTheme.colors.primary;//'#555'

        // if(props.active) {
        //     // this.backgroundColor = new Animated.Value(150);
        //     this.backgroundColor = this.deActivatedColor;
        //     this.color = this.activatedColor;
        // }
        // else {
        //     // this.backgroundColor = new Animated.Value(0);
        //     this.backgroundColor = this.activatedColor;
        //     this.color = this.deActivatedColor;
        // }

        this._renderIcon = this._renderIcon.bind(this);

    }


    // componentDidMount() {
    //     this.props.onRef(this);

    // }

    // componentWillUnmount() {
    //     this.props.onRef(undefined)
    // }

    toggleActivate = () => {
        this.setState({ active: !this.state.active });
        // if (this.color === this.activatedColor) {
        //     // Animated.timing(this.backgroundColor, {
        //     //     toValue: 0,
        //     //     duration: 1000,
        //     // }).start();

        //     this.color = this.activatedColor;
        //     this.color = this.deActivatedColor;
        // }
        // else {
        //     // Animated.timing(this.backgroundColor, {
        //     //     toValue: 150,
        //     //     duration: 1000,
        //     // }).start();

        //     this.backgroundColor = this.deActivatedColor;
        //     this.color = this.activatedColor;
        // }
    }

    // deActivate = () => {
    //     Animated.timing(this.state.xValue, {
    //         toValue: 100,
    //         duration: 1000,
    //         asing: Easing.inOut,
    //     }).start();
    // }

    _renderIcon = (color) => {
        const { index, iconName } = this.props;

        return index === 0 ?
        (
            <TShirtIcon
                color={color}
                name={iconName}
                size={27}
                // style={{
                //     color,
                // }} 
            />
        ) :
        (
            <Icon
                color={color}
                name={iconName}
                size={30}
                // style={{
                //     color,
                // }} 
            />
        );
    }

    render() {
        // const backgroundColor = this.backgroundColor.interpolate({
        //     inputRange: [0, 150],
        //     outputRange: [this.activatedColor, this.deActivatedColor]
        // });

        const {active, style} = this.props;

        let activatedColor = '#fff'//'#ccc'
        let deActivatedColor = DefaultTheme.colors.primary;

        let color = active ? activatedColor : deActivatedColor;
        let backgroundColor = active ? deActivatedColor : activatedColor;

        return (
            <Animated.View style={[styles.icon, { backgroundColor, borderColor: deActivatedColor, }, style]}>
                {this._renderIcon(color)}
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