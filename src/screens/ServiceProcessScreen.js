import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

import DatabaseUtil from '../database/DatabaseUtil'
import ServiceProcess from '../components/ServiceProcess'

class ServiceProcessScreen extends Component {

    _onServiceProcessDone = () => {
        this.props.navigation.navigate('ClothingSelection');
    }

    render() {
        return (
            <View style={styles.container}>
                <ServiceProcess 
                    info={DatabaseUtil.data.order} 
                    onDone={this._onServiceProcessDone}
                />
            </View>
        );
    }
}
export { ServiceProcessScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
        // alignItems: 'center',
        // justifyContent: 'center'
    }
});