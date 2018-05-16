/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { Divider, Button, Icon, Header} from 'react-native-elements';
import RListItem from './components/RListItem';
import { withNavigation } from 'react-navigation';
import { COLOR } from '../config';
import { getRecommendRecipeDaily } from './rest/recipe';

// const todayRecipes = [
//   {
//     name: '重庆辣子鸡',
//     linkId: 12,
//   },
//   {
//     name: '炝炒白菜',
//     linkId: 14,
//   },
//   {
//     name: '火爆花蛤',
//     linkId: 15,
//   }
// ];

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
    this.state = { 
      date: date,
      dailyRecipes: [],
    };
  }

  _fetchDailyRecommendRecipes(force_change=false) {
    getRecommendRecipeDaily({force_change})
    .then(data => {
      if (data.code === 0) {
        this.setState({
          dailyRecipes: data.recommend_recipes,
        })
      } else {
        console.log("get dailyRecipes err")
      }
    })
    .catch(err => {
      console.log(err);
    })
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

  componentDidMount() {
    // console.log('this called')
    this._fetchDailyRecommendRecipes()
  }

  render() {

    let { dailyRecipes=[] } = this.state;

    let ingredients = [];
    let seasonings = [];

    if (dailyRecipes.length) {
      dailyRecipes.forEach(item => {
        ingredients = ingredients.concat(item.material.ingredients);
        seasonings = seasonings.concat(item.material.seasoning);

        // console.log(item.material)
        // item.material.ingredients.forEach(inner_item => {
        //   ingredients
        // });
        // item.material.seasoning.forEach(inner_item => {
        //   seasonings[inner_item.name] += inner_item.weight
        // });
      });
      // console.log(ingredients, seasonings)
    }


    return (
      <View>
        <Header
          backgroundColor={COLOR.Theme}
          outerContainerStyles={styles.headerOutContainer}
          //centerComponent={this._renderCenterHeaderComp()}
          leftComponent={this._renderLeftHeaderComp()}
          //rightComponent={this._renderRightHeaderComp()}
        />

        <View style={{
          padding: 10, 
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderColor: COLOR.Gray,
        }}>
          <Text style={{textAlign: 'center', color: COLOR.Theme}}
            onPress={() => this._fetchDailyRecommendRecipes(true)}
          >
            推荐菜谱不合心意？点我刷新
          </Text>
        </View>

        <ScrollView>
          <View style={styles.container}>
            <Divider/>
            <View style={styles.recipeLinkContainer}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Icon name="tag-faces" color={COLOR.Yellow} />
                <Text style={{textAlign: 'left',fontSize: 20}}>今日菜谱：</Text>
              </View>
              {
                dailyRecipes.map((r, idx) => (
                  <View
                    key={r.id} 
                    style={styles.recommendRecipeCard}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        console.log("this called")
                        this.props.navigation.navigate('RecipeDetail', {id: r.id, formTab: 'Home'});
                      }}
                    >
                    <ImageBackground
                      source={{uri: r.img}} 
                      style={{
                        width: '100%',
                        height: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      imageStyle={{borderRadius: 10}}
                    >
                      <View style={styles.cardImgMb}/>
                      <Text style={styles.recipeLink}>{r.name}</Text>
                      <Text style={styles.recipeLinkCat}>{r.cat} / {r.view_cnt} / {r.mark_cnt}</Text>
                    </ImageBackground>
                    </TouchableOpacity>
                  </View>
                ))
              }
            </View>

            <Divider/>
            <View style={styles.recipeLinkContainer}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Icon name="tag-faces" color={COLOR.Yellow} />
                <Text style={{textAlign: 'left', fontSize: 20}}>营养指数：</Text>
                <View flexDirection='row'>
                  {
                    [1,2,3,4,5].map((item, idx) => (
                      <Icon key={`key_${idx}`} name="star" color={COLOR.Yellow}/>
                    ))
                  }
                </View>
              </View>
            </View>

            <Divider/>
            <View style={styles.recipeLinkContainer}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Icon name="tag-faces" color={COLOR.Yellow} />
                <Text style={{textAlign: 'left',fontSize: 20}}>需要材料：</Text>
              </View>
              <View>
              {
                ingredients.map((i, idx) => (
                  <RListItem 
                    leftText={i.name} 
                    rightText={i.weight} 
                    key={`${i.name}_${idx}`}
                  />
                ))
              }
              {
                seasonings.map((i, idx) => (
                  <RListItem 
                    leftText={i.name} 
                    rightText={i.weight!==""?i.weight:"适量"} 
                    key={`${i.name}_${idx}`}
                  />
                ))
              }
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 100,
    //paddingBottom: 50,
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
    color: COLOR.LightWhite,
    fontSize: 20,
    fontWeight: '500',
  },
  recipeLinkCat: {
    fontSize: 14,
    color: COLOR.LightWhite,
  },
  recipeLinkContainer: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  recommendRecipeCard: {
    position: 'relative',
    marginBottom: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  cardImgMb: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000',
    width: '100%',
    height: 100,
    borderRadius: 10,
    opacity: 0.4,
    // alignItems: 'center',
    // justifyContent: 'center',
  }
});

export default withNavigation(HomeScreen);