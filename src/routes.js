import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main/index';
import Login from './pages/Login';

const Drawer = createDrawerNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Drawer.Navigator  screenOptions={{ gestureEnabled: false }} initialRouteName="Login">
          <Drawer.Screen
            name="Login" component={Login}
          />
          <Drawer.Screen
            name="Main" component={Main}
          />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

