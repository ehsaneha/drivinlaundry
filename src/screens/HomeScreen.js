import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    BackHandler,
} from "react-native";
import { Modal, Portal, Appbar, Avatar, Button, Card, Title, Paragraph, FAB, TextInput } from 'react-native-paper';

import OrderListItem from '../components/OrderListItem'
import OrderDetailsModal from '../components/OrderDetailsModal'
import ExitOnBackButton from '../components/ExitOnBackButton'

class HomeScreen extends Component {
    state = {
        text: '',
        visible: false,
    };

    _showModal = () => this.setState({ visible: true });
    _hideModal = () => this.setState({ visible: false });

    _renderEachOrderListItem = ({ eachOrder }) => {
        return (
            <OrderListItem
                orderInfo={eachOrder}
                onPressItem={() => this._showModal()}
            />
        );
    }

    render() {
        return (
            <ExitOnBackButton>
            <View style={{ flex: 1 }}>
                <Appbar.Header>
                    <Appbar.Content />
                    <Appbar.Action icon="settings" onPress={() => this.props.navigation.push('Settings')} />
                </Appbar.Header>

                <FlatList
                    data={[
                        { title: 'Title Text', key: 'item1' },
                        { title: 'Title Text', key: 'item1' },
                        { title: 'Title Text', key: 'item1' },
                        { title: 'Title Text', key: 'item1' },
                        { title: 'Title Text', key: 'item1' },
                        { title: 'Title Text', key: 'item1' },
                        { title: 'Title Text', key: 'item1' },
                        { title: 'Title Text', key: 'item1' }
                    ]}
                    renderItem={this._renderEachOrderListItem}
                />
                <Portal>
                    <Modal visible={this.state.visible} onDismiss={this._hideModal}>
                        <OrderDetailsModal />
                    </Modal>
                </Portal>

                <FAB
                    style={styles.fab}
                    icon="add"
                    onPress={() => this.props.navigation.navigate('Order')}
                />
            </View>
            </ExitOnBackButton>
        );
    }
};

export { HomeScreen };



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        margin: 5,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    textInput: {
        margin: 5,
    },
});