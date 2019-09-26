import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ToastAndroid
} from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import { DefaultTheme, Title } from 'react-native-paper';
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import moment from "moment";

import DatabaseUtil from '../database/DatabaseUtil';

class TimeSelectionScreen extends Component {

    constructor(props) {
        super(props);

        let hourNow = moment().format('HH');
        let minuteNow = moment().format('mm');
        let startTime = parseFloat(hourNow) + (parseFloat(minuteNow) < 30 ? 0.5 : 1);

        this.state = {
            selectedStartDate: moment(),
            multiSliderValue: [startTime, startTime + 1],
        };
        this.onDateChange = this.onDateChange.bind(this);
        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
    }

    componentDidMount = () => {
        this.props.screenProps(this);
    }

    _floatToIsoTime = (value) => {
        return (value >= 10 ? '' : '0') + Math.floor(value) + ((value * 10) % 10 === 5 ? ':30' : ':00')
    }
    
    beforeNextFABPressed = () => {
        const {selectedStartDate, multiSliderValue} = this.state;

        // DatabaseUtil.data.order.time.start = multiSliderValue[0];
        // DatabaseUtil.data.order.time.end = multiSliderValue[1];
        // DatabaseUtil.data.order.time.date = moment(selectedStartDate).format("YYYY-MM-DD");
        
        let selectedDate = moment(selectedStartDate).format("YYYY-MM-DD");
        let isBefor = moment(selectedDate + ':' + this._floatToIsoTime(multiSliderValue[0]), "YYYY-MM-DD:HH:mm").isBefore();

        // ToastAndroid.show(selectedDate, ToastAndroid.LONG);
        // ToastAndroid.show(this._floatToIsoTime(multiSliderValue[0]), ToastAndroid.LONG);
        // ToastAndroid.show(this._floatToIsoTime(multiSliderValue[0]), ToastAndroid.LONG);
        // ToastAndroid.show(moment().format('YYYY-MM-DD:HH:mm'), ToastAndroid.LONG);
        // ToastAndroid.show(isBefor ? 'yes' : 'no', ToastAndroid.LONG);

        // console.log(moment().format('YYYY-MM-DD:HH:mm'));
        // console.log(selectedDate + ':' + this._floatToIsoTime(multiSliderValue[0]));

        if(isBefor) {
            ToastAndroid.show('You should choose time for future!', ToastAndroid.LONG);
            return false;
        }


        DatabaseUtil.data.order.start_time = 
            multiSliderValue[0] + ' ' + 
            multiSliderValue[1] + ' ' + 
            selectedDate;
            
        return true;

    }

    onDateChange(date) {
        this.setState({
            selectedStartDate: date,
        });
    }

    multiSliderValuesChange = values => {
        if(values[0] )
        this.setState({
            multiSliderValue: values,
        });
    };

    _floatToTime = (value) => {
        return Math.floor(value) + ((value * 10) % 10 === 5 ? ':30' : '')
    }

    render() {
        const minDate = new Date();
        const { selectedStartDate, multiSliderValue } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        return (
            <View style={styles.container}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Title>Time: {this._floatToTime(multiSliderValue[0])} - {this._floatToTime(multiSliderValue[1])}</Title>
                    <MultiSlider
                        values={[
                            multiSliderValue[0],
                            multiSliderValue[1],
                        ]}
                        onValuesChange={this.multiSliderValuesChange}
                        selectedStyle={{
                            backgroundColor: DefaultTheme.colors.primary,
                        }}
                        markerStyle={{backgroundColor: DefaultTheme.colors.primary}}
                        isMarkersSeparated={true}
                        sliderLength={360}
                        min={0}
                        max={24}
                        step={0.5}
                        snapped
                    />
                </View>
                <CalendarPicker
                    minDate={minDate}
                    selectedDayColor={DefaultTheme.colors.primary}
                    // todayBackgroundColor={DefaultTheme.colors.primary}
                    selectedDayTextColor="#FFFFFF"
                    onDateChange={this.onDateChange}
                />

            </View>
        );
    }
}
export { TimeSelectionScreen };
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 100,
    },
});