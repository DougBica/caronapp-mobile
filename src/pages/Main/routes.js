import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Principal from '../Principal/index';

const Drawer = createDrawerNavigator();

export default function Routes() {
  return (
      <Drawer.Navigator >
          <Drawer.Screen
            name="Principal" component={Principal}
          />
      </Drawer.Navigator>
  );
}

