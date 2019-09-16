import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import { List, Divider, } from 'react-native-paper';

class OrderReciepeScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                 <List.Section style={{marginTop: -100}}>
                    <List.Subheader 
                        style={{paddingTop: 0,paddingBottom: 0,}}>
                        Some title
                    </List.Subheader>
                    <List.Item
                    title="First Item"
                    left={() => <List.Icon icon="folder" />}
                    right={() => <List.Icon icon="add" />}
                />
                <List.Item
                title="Second Item"
                left={() => <List.Icon color="#000" icon="folder" />}
                right={() => <List.Icon icon="add" />}
                />
            <List.Item
            title="Second Item"
            left={() => <List.Icon color="#000" icon="folder" />}
            right={() => <List.Icon icon="add" />}
            />
        <Divider />
        <List.Item
        title="Total:                 20€"
        left={() => <List.Icon color="#000" icon="folder" />}
    />
                </List.Section>
            </View>
        );
    }
}
export {OrderReciepeScreen};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center'
    }
});