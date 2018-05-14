/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Divider, Button, Icon, Header} from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { COLOR } from '../config';

const todayRecipes = [
  {
    name: '重庆辣子鸡',
    linkId: 12,
  },
  {
    name: '炝炒白菜',
    linkId: 14,
  },
  {
    name: '火爆花蛤',
    linkId: 15,
  }
];

class HomeScreen extends Component<Props> {

  static navigationOptions = {
    tabBarLabel: '首页',
    tabBarIcon: ({tintColor}) => (
      <Icon name="hot-tub" color={tintColor}/>
    ),
  };

  constructor(props) {
    super(props);
    let date = this._getDateString()
    this.state = { date };
  }

  _getDateString() {
    let d = new Date();  
    var str = d.toLocaleDateString();
    const Week = ['日','一','二','三','四','五','六'];
    str += ' 星期' + Week[d.getDay()];
    return str;
  }

  _renderLeftHeaderComp() {
    return (<Text style={{color: '#fff'}}>{this.state.date}</Text>);
  }

  // _renderRightHeaderComp() {
  //   return (<Icon name="call" color="#fff" size={26}/>);
  // }

  // _renderCenterHeaderComp() {
  //   return (
  //     <View style={{flexDirection: 'row'}}>
  //       <Text style={styles.centerHeaderComp}>当前菜系：川菜</Text>
  //       <Icon name="arrow-drop-down" color="#fff" size={20}/>
  //     </View>
  //   );
  // }

  render() {
    return (
      <ScrollView>
        <Header
          backgroundColor={COLOR.Theme}
          outerContainerStyles={styles.headerOutContainer}
          //centerComponent={this._renderCenterHeaderComp()}
          leftComponent={this._renderLeftHeaderComp()}
          //rightComponent={this._renderRightHeaderComp()}
        />

        <View style={styles.container}>
          <View style={styles.recipeLinkContainer}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="tag-faces" color={COLOR.Yellow} />
              <Text style={{textAlign: 'left',fontSize: 20}}>今日菜谱：</Text>
            </View>
            {
              todayRecipes.map((r, idx) => (
                <Text
                  key={`${r.name}_${idx}`}
                  style={styles.recipeLink}
                  onPress={() => {
                    {/*console.log(r)*/}
                    this.props.navigation.navigate('RecipeDetail', {id: r.linkId, formTab: 'Home'});
                  }}>
                {r.name}</Text>
              ))
            }
          </View>
          <Divider/>

          <View style={styles.recipeLinkContainer}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="tag-faces" color={COLOR.Yellow} />
              <Text style={{textAlign: 'left',fontSize: 20}}>营养指数：</Text>
            </View>
          </View>
          <Divider/>

          <View style={styles.recipeLinkContainer}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="tag-faces" color={COLOR.Yellow} />
              <Text style={{textAlign: 'left',fontSize: 20}}>需要材料：</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 5,
  },
  centerHeaderComp: {
    color: '#fff',
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
  recipeLink: {
    color: COLOR.Theme,
    fontSize: 20,
  },
  recipeLinkContainer: {
    padding: 10,
  }
});

export default withNavigation(HomeScreen);