import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import { Icon, Divider} from 'react-native-elements';
// import { withNavigation } from 'react-navigation';
// import StackHeader from '../components/StackHeader';
import { DEFAULT_NAV_BAR_STYLE, COLOR } from '../../config';

class RListItem extends React.Component {
  render() {

    let {
      leftText,
      rightText,
    } = this.props;

    return (
      <View style={styles.container}>
        { 
          leftText !== undefined?
          (<Text style={{flex: 1}}>{leftText}</Text>)
          :
          null
        }
        {
          rightText !== undefined?
          (<Text style={{flex: 1, textAlign: 'right'}}>{rightText}</Text>)
          :
          null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    height: 25,
    flexDirection: 'row',
  }
});

export default RListItem;