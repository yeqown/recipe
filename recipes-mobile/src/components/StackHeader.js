import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, Header} from 'react-native-elements';
import { withNavigation, NavigationActions } from 'react-navigation';
import { COLOR } from '../../config';

class StackHeader extends React.Component {

  // @title headerTitle text
  // @color headerTitle color
  _renderCenterHeaderComp({title, color}) {
    // console.log(color)
    return (
      <Text style={[styles.title, {color: color}]}>{title}</Text>
    );
  }

  _renderLeftHeaderComp({backTab, color, headerBackgroundColor}) {
    return (
      <Icon 
        name="keyboard-arrow-left" 
        color={color}
        size={30}
        onPress={() => {
          // console.log(backTab)
          if (backTab === "") {
            this.props.navigation.goBack()
            return
          }
          let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'ExploreHome'})
            ]
          });
          this.props.navigation.dispatch(resetAction)
          this.props.navigation.navigate(backTab)
        }}
        underlayColor='transparent'
      />
    );
  }

  render() {

    let {
      containerStyle,
      headerBackgroundColor = COLOR.Theme,
      headerOpacity = 1.0,
      color = '#fff',
      title,
      backTab = '',
    } = this.props;

    return (
      <View style={[styles.defaultContainerStyle, containerStyle]}>
        <Header
          backgroundColor={headerBackgroundColor}
          outerContainerStyles={[styles.headerOutContainer, {opacity: headerOpacity}]}
          centerComponent={this._renderCenterHeaderComp({title, color})}
          leftComponent={this._renderLeftHeaderComp({backTab, color, headerBackgroundColor})}
          //rightComponent={this._renderRightHeaderComp()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultContainerStyle: {
    width: '100%',
    borderBottomWidth: 0,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    margin: 5,
  },
  headerOutContainer: {
    opacity: 0.5,
    height: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 0,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomWidth: 0,
    // paddingTop: 0,
  }
});

export default withNavigation(StackHeader);