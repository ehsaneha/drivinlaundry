import React, { Component } from "react";


const MyNavigator = (props) => {
    const {index, screenProps, navigation, screensList} = props;
    if(index < 0 || index >= screensList.length) return null;

    const Screen = screensList[index];
    return <Screen screenProps={screenProps} navigation={navigation} />;
}
export default MyNavigator;
