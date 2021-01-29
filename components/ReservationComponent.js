import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-community/picker';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import { Notifications } from 'expo';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showDateTimePicker: false,
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    toggleDateTimePicker = () => {
        this.setState({showDateTimePicker: !this.state.showDateTimePicker});
    }

    onConfirmDateTimePicker = (date) => {
        this.setState({date: date.toISOString()});
        this.toggleDateTimePicker();
    }

    handleReservation = () => {
        console.log(JSON.stringify(this.state));
        this.presentLocalNotification(this.state.date);
        this.addReservationToCalendar(this.state.date);
        this.resetForm();
    }

    resetForm = () => {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    obtainCalendarPermission = async () => {
        let calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);
        if (calendarPermission.status !== 'granted') {
            Alert.alert('Permission not granted to add reserve to calendar');
        }
        return calendarPermission;
    }

    addReservationToCalendar = async (date) => {
        await this.obtainCalendarPermission();

        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.accessLevel === 'owner');

        const calendarId = defaultCalendars[0].id;
        const details = {
            title: 'ConFusion Table Reservation',
            startDate: new Date(Date.parse(date)),
            endDate: new Date(Date.parse(date) + (2*60*60*1000)),
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        }

        await Calendar.createEventAsync(calendarId, details);
    }
    
    render() {
        return(
            <ScrollView>
                <Animatable.View animation="zoomInUp" duration={2000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor='#512DA8'
                            onValueChange={(value) => this.setState({smoking: value})}>
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <Button
                            icon={
                                <Icon
                                    name='calendar'
                                    type='font-awesome'            
                                    size={24}
                                />
                            }
                            type="clear"
                            onPress={() => this.toggleDateTimePicker()}
                        />
                        <TextInput
                            defaultValue={this.state.date === '' ? 'select date and time' : this.state.date}
                            style={{ backgroundColor: '#FFF' }}  
                            editable={false}
                            maxLength={20}
                        />  
                        <DateTimePickerModal
                            isVisible={this.state.showDateTimePicker}
                            mode="datetime"
                            onConfirm={this.onConfirmDateTimePicker}
                            onCancel={() => this.toggleDateTimePicker()}
                        />
                    </View>
                    <View style={styles.modal}>
                        <Button
                            onPress={() => {
                                Alert.alert(
                                    'Your Reservation Ok?',
                                    'Number of Guests: ' + this.state.guests + '\n' +
                                    'Smoking? ' + this.state.smoking + '\n' +
                                    'Date and Time: ' + this.state.date,
                                    [
                                        { 
                                            text: 'Cancel', 
                                            onPress: () => this.resetForm(),
                                            style: ' cancel'
                                        },
                                        {
                                            text: 'OK',
                                            onPress: () => this.handleReservation()
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }}
                            title="Reserve"
                            buttonStyle={{backgroundColor: '#512DA8'}}
                        />
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
});

export default Reservation;