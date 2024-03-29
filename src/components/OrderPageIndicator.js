import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
    Image
} from "react-native";

import EachPageIndicator from './EachPageIndicator'

class OrderPageIndicator extends Component {

    screenWidth = Math.round(Dimensions.get('window').width);
    eachPageIndicatorWidth = 50;
    eachPageIndicatorMargin = 10;

    initLeft = (this.screenWidth / 2) - (this.eachPageIndicatorWidth / 2);
    deltaX = this.eachPageIndicatorWidth + this.eachPageIndicatorMargin;

    state = {
        xValue: new Animated.Value(this.initLeft),
        selectedIndex: 0,
    };



    componentDidMount() {
        this.props.onRef(this.activeIndex)
    }

    componentWillUnmount() {
        this.props.onRef(this.activeIndex)
    }

    // activeNextIndex = () => {
    //     this.activeIndex(this.state.selectedIndex + 1);
    // }

    // activePrevIndex = () => {
    //     this.activeIndex(this.state.selectedIndex - 1);
    // }

    activeIndex = (index) => {
        // if(index === this.state.selectedIndex) return;

        this.setState({ selectedIndex: index })

        // this._toggleIndicator(index);
        // this._toggleIndicator(this.state.selectedIndex);
        this._moveAnimation(this.initLeft - (index * this.deltaX));

        // this.state.selectedIndex = index;
    }

    // toggleActivate = () => {
    //     this._toggleIndicator(index);
    // }

    // _toggleIndicator = (index) => {
    //     this.props.screensList[index].ref.toggleActivate();
    // }

    _moveAnimation = (toValue) => {
        Animated.timing(this.state.xValue, {
            toValue,
            duration: 1000,
            asing: Easing.inOut,
        }).start();
    }

    render() {
        const { screensList } = this.props;
        return (
            <Animated.View style={[styles.orderPageIndicator, { left: this.state.xValue }]}>

                <View 
                    style={{ 
                        position: 'absolute', 
                        flexDirection: 'row', 
                        height: this.eachPageIndicatorWidth, 
                        alignItems: 'center',
                    }}
                >
                    {screensList.map((each, index) => {
                        if (index < screensList.length - 1) {
                            return (
                                <Image
                                    key={index + '_EachPageIndicatorBridge'}
                                    style={{
                                        height: this.eachPageIndicatorWidth-20,
                                        width: this.eachPageIndicatorMargin * 2,
                                        marginLeft: this.eachPageIndicatorWidth - (index === 0 ? 5 : 10),
                                        resizeMode: "stretch",
                                    }}
                                    source={require('../assets/imgs/indicatorBridge.png')}
                                />
                            );
                        }
                    })}
                </View>

                {screensList.map((each, index) => {
                    return (
                        <EachPageIndicator
                            key={index + '_EachPageIndicator'}
                            // onRef={ref => each.ref = ref}
                            iconName={each.iconName}
                            style={{ marginLeft: index === 0 ? 0 : 10 }}
                            active={index === this.state.selectedIndex}
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
        justifyContent: 'space-between',
        position: 'absolute',
        marginTop: 10
        // backgroundColor: 'red'
    }
});