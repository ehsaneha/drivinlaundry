import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    Dimensions
} from "react-native";

import EachPageIndicator from './EachPageIndicator'

class OrderPageIndicator extends Component {

    screenWidth = Math.round(Dimensions.get('window').width);
    eachPageIndicatorWidth = 50;
    eachPageIndicatorMargin = 10;
    
    initLeft = (this.screenWidth/2) - (this.eachPageIndicatorWidth/2);
    deltaX = this.eachPageIndicatorWidth + this.eachPageIndicatorMargin;
    
    state = {
        xValue: new Animated.Value(this.initLeft),
    };
    
    selectedIndex = 0;

    
    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    activeNextIndex = () => {
        this.activeIndex(this.selectedIndex + 1);
    }
    
    activePrevIndex = () => {
        this.activeIndex(this.selectedIndex - 1);
    }

    activeIndex = (index) => {
        // if(index === this.selectedIndex) return;

        this._toggleIndicator(index);
        this._toggleIndicator(this.selectedIndex);
        this._moveAnimation(this.initLeft - (index * this.deltaX));

        this.selectedIndex = index;
    }

    // toggleActivate = () => {
    //     this._toggleIndicator(index);
    // }

    _toggleIndicator = (index) => {
        this.props.screensList[index].ref.toggleActivate();
    }

    _moveAnimation = (toValue) => {
        Animated.timing(this.state.xValue, {
            toValue,
            duration: 1000,
            asing: Easing.inOut,
        }).start();
    }

    render() {
        return (
            <Animated.View style={[styles.orderPageIndicator, { left: this.state.xValue }]}>
                {this.props.screensList.map((each, index) => {
                    return (
                        <EachPageIndicator 
                            key={index}
                            onRef={ref => (each.ref = ref)} 
                            iconName={each.iconName} 
                            style={{
                                marginLeft: index === 0 ? 0 : 10
                            }} 
                            active={index === 0} 
                            index={index}
                        />
                    );
                })}
            </Animated.View>
        );
    }
}
export default OrderPageIndicator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    orderPageIndicator: {
        flexDirection: 'row',
        justifyContent:'space-between',
        position: 'absolute',
        marginTop: 10
        // backgroundColor: 'red'
    }
});