import React, { Component } from "react";
import { 
    View,
    Alert,
    Text,
    StyleSheet
} from "react-native";

import UserTypeItem from './UserTypeItem'

class UserTypeSelection extends Component {
    
    userTypeList = [
        {id: 0, toggleItemActive: null, iconName: 'person'},
        {id: 1, toggleItemActive: null, iconName: 'local-taxi'},
        {id: 2, toggleItemActive: null, iconName: 'local-laundry-service'},
    ];
    
    selectedItemIndex = 0;

    activeNextIndex = () => {
        this.activeIndex(this.selectedItemIndex + 1);
    }
    
    activePrevIndex = () => {
        this.activeIndex(this.selectedItemIndex - 1);
    }

    activeIndex = (index) => {
        // if(index === this.selectedItemIndex) return;

        // this._toggleIndicator(index);
        // this._toggleIndicator(this.selectedItemIndex);
        // this._moveAnimation(this.initLeft - (index * this.deltaX));

        // this.selectedItemIndex = index;
    }

    _toggleIndicator = (index) => {
        // this.props.screensList[index].ref.toggleActivate();
    }

    itemClicked = (id) => {
        if(id === this.selectedItemIndex) return;
        
        this.userTypeList[id].toggleItemActive();
        this.userTypeList[this.selectedItemIndex].toggleItemActive();
        this.selectedItemIndex = id;

        this.props.onUserTypeChange(id + 1);
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                {this.userTypeList.map((each, index) => {
                    return (
                        <UserTypeItem 
                            key={index}
                            id={index}
                            iconName={each.iconName} 
                            style={{
                                marginLeft: index === 0 ? 0 : 10
                            }} 
                            active={index === 0} 
                            onPress={this.itemClicked}
                            onRef={ref => (each.toggleItemActive = ref.toggleActivate)}
                        />
                    );
                })}
            </View>
        );
    }
}
export default UserTypeSelection;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    }
});