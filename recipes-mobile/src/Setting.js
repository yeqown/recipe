import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { List, ListItem, Icon, Header} from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { COLOR } from '../config';

const list = [
  {
    title: '设置口味',
    icon: 'favorite',
    iconColor: COLOR.Red,
    screen: 'SettingFav',
  },
  {
    title: '录入菜谱',
    icon: 'settings-input-antenna',
    iconColor: COLOR.Blue,
    screen: 'InputRecipe',
  },
  {
    title: '关于软件',
    icon: 'face',
    iconColor: COLOR.Orange,
    screen: 'About',
  },
];

class Setting extends React.Component {
  static navigationOptions = {
    // tabBarLabel: '设置',
    tabBarIcon: ({tintColor}) => (
      <Icon name="settings" color={tintColor}/>
    ),
  };

  _renderCenterHeaderComp() {
    return (
      <Text style={styles.headerTitle}>设置</Text>
    );
  }

  render() {
    return (
      <View>
        <Header
          backgroundColor={COLOR.Theme}
          outerContainerStyles={styles.headerOutContainer}
          centerComponent={this._renderCenterHeaderComp()}
          //leftComponent={this._renderLeftHeaderComp()}
          //rightComponent={this._renderRightHeaderComp()}
        />

        <List containerStyle={styles.listContainer}>
        {
          list.map((item, idx) => (
            <ListItem 
              key={idx}
              title={item.title}
              containerStyle={styles.listItemContainerStyle}
              leftIcon={{ name: item.icon, color: item.iconColor}}
              rightIcon={{ name: 'keyboard-arrow-right', color: COLOR.Theme}}
              onPress={() => {
                console.log(item)
                // this.props.navigation.navigate(item.screen);
                this.props.navigation.navigate(item.screen);
              }}
            />
          ))
        }
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerTitle: {
    color: '#fff'
  },
  headerOutContainer: {
    height: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 0,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 0,
  },
  listContainer: {
    marginTop: 5,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  listItemContainerStyle: {
    // borderBottomColor: COLOR.Theme,
    borderBottomColor: COLOR.Gray,
  },
});

export default withNavigation(Setting);