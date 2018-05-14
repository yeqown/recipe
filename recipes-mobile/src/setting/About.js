import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import { List, ListItem, Header, Icon} from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import StackHeader from '../components/StackHeader';
import { COLOR } from '../../config';

class About extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="settings" color={tintColor}/>
    ),
  };

  render() {
    return (
      <View style={styles.container}>
        <StackHeader title="关于" containerStyle={{width: '100%', marginBottom: 20}}/>
        <View style={styles.logoContainer}>
          <Text style={styles.softwareName}>Recipes</Text>
          <Image 
            source={require('../../images/ic_launcher.png')} 
            style={styles.img}/>
        </View>

        <List containerStyle={styles.listContainer}>
          <ListItem 
            title="Github"
            containerStyle={styles.listItemContainerStyle}
            leftIcon={{ name: "code", color: COLOR.Theme}}
            rightTitle="github.com/yeqown/recipes"
            onPress={() => {
              console.log("item clicked")
            }}
          />
          <ListItem 
            title="当前版本"
            containerStyle={styles.listItemContainerStyle}
            leftIcon={{ name: "info", color: COLOR.Theme}}
            rightTitle="v1.0.0"
            onPress={() => {
              console.log("item clicked")
            }}
          />
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  softwareName: {
    fontSize: 30,
    color: COLOR.Theme,
  },
  listContainer: {
    width: '100%',
    marginTop: 5,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  listItemContainerStyle: {
    borderBottomColor: COLOR.Gray,
  },
  img: {
    height: 100,
    width: 100,
    margin: 30,
  }
});

export default withNavigation(About);