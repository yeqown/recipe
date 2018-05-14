import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ListItem, Header, Icon} from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import StackHeader from '../components/StackHeader';
import { COLOR } from '../../config';

class SettingFav extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="settings" color={tintColor}/>
    ),
  };

  // static navigatorStyle = DEFAULT_NAV_BAR_STYLE;

  render() {
    return (
      <View>
        <StackHeader title="设置口味" containerStyle={{width: '100%'}}/>
        <Text>设置口味</Text>
      </View>
    );
  }
}

export default withNavigation(SettingFav);