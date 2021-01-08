import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import { View, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

const HomeNav = createStackNavigator({
    Home: { screen: Home }
  }, 
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: "#fff"            
      }
    }
  }
);

const HomeNavigator = createAppContainer(HomeNav);

const MenuNav = createStackNavigator({
    Menu: { screen: Menu },
    Dishdetail: { screen: Dishdetail }
  },
  {
    initialRouteName: 'Menu',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: "#fff"            
      }
    }
  }
);

const MenuNavigator = createAppContainer(MenuNav);

const MainNav = createDrawerNavigator({
    Home: { 
      screen: HomeNavigator,
      navigationOptions: {
        title: 'Home',
        drawerLabel: 'Home'
      }
    },
    Menu: { 
      screen: MenuNavigator,
      navigationOptions: {
        title: 'Menu',
        drawerLabel: 'Menu'
      } 
    }
  }, 
  {
    drawerBackgroundColor: '#D1C4E9'
  }
);

const MainNavigator = createAppContainer(MainNav);

class Main extends Component {

  render() {
    return (
      <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight}}>
        <MainNavigator />
      </View>
    );
  }
}

export default Main;