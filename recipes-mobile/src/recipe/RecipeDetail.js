import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import { Icon, Divider} from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import StackHeader from '../components/StackHeader';
import RListItem from '../components/RListItem';
import { DEFAULT_NAV_BAR_STYLE, COLOR } from '../../config';
import { getRecipeDetailById } from '../rest/recipe';

// const Recipe = {
//   name: '水煮肉片',
//   cost: '45分钟',
//   pic_link: 'https://cp1.douguo.com/upload/caiku/6/4/c/600x400_64b997cc9c9089cae229a56cdc67d47c.jpg',
//   // pic_link : 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
//   view_cnt: 6645794,
//   mark_cnt: 2453,
//   material: {
//     ingredients: [
//       {
//         name: "瘦肉",
//         weight: "300g",
//       },
//       {
//         name: "青菜",
//         weight: "4颗",
//       },
//       {
//         name: "金针菇",
//         weight: "适量",
//       }
//     ],
//     seasoning: [
//       {
//         name: "干辣椒",
//         weight: "6个",
//       },
//       {
//         name: "蒜",
//         weight: "6个",
//       },
//       {
//         name: "花椒",
//         weight: "适量",
//       },
//       {
//         name: "生抽",
//         weight: "1茶匙",
//       },
//       {
//         name: "蛋清",
//         weight: "半个",
//       },
//     ]
//   },
//   steps: [
//     "将瘦肉切成约5厘米长、2.5；厘米宽、0.3厘米厚的大薄片（只是大概，不用严格衡量，总之薄一些会比较好），如果觉得不好切，可以将肉放入冷冻室稍冻，待肉有些硬时切片，这个活需要细心和耐心哈~",
//     "用淀粉2茶匙、家乐鸡粉1汤匙、生抽1茶匙、料酒1茶匙、蛋清半个，盐、胡椒粉和少量水将肉抓匀冷藏半小时备用。",
//     "锅子里放入少量油，烧热后，将除小青菜外的所有配菜倒入,快炒几下，加入适量水，煮开去生后，放入小青菜（烫一下就好）, 将煮好的所有配菜一并捞入大碗中。（烫菜的水不要倒掉，可以留待后面做水煮用的汤汁）",
//     "锅子烧热，放入干辣椒和川花椒，转小火，慢慢焙干，当干辣椒的颜色由亮红转为暗红色，有香味焙出时，关火, 放在案板上，用刀子先切一切, 再用擀面杖细细擀碎，尤其是花椒粒要擀的碎碎的，吃起来才不影响口感，而且麻香味儿十分浓郁.",
//     "锅注油烧至四成热，下郫县红油豆瓣酱3汤匙, 中小火炒出香味, 加入生姜末, 继续翻炒. 炒至吐出红油, 放入葱段, 煸炒几下, 将刚才烫菜的水倒入锅子里（不够可再加沸水）。",
//     "加入一勺味精，再调入一勺白糖，因为郫县豆瓣酱很咸，所以要下一些白糖去综合它的咸味， 汤烧开后，就可以下肉片了。将所有的肉片下完。煮开后1、2分钟就好，不然肉老了哈~",
//     "将煮好的肉片码在配菜上。汤也一并倒入其中。将焙干擀碎的干辣椒、干花椒，还有蒜末等均匀的撒在上面。然后炒锅置于火上，下入食用油，待油烧至7、8成热时，关火，稍微凉一下，淋在上面，听到“哧拉”一声，香味四溢啊，受不袅啦~~",
//   ],
//   tip: `1.干辣椒段和花椒一定要先用小火慢慢焙干焙出香味，焙过的辣椒花椒剁碎以后撒在肉片上，吃起来焦香满口，十分有味。
//     2.浇上的热油至少要八成热，浇上去才能把辣椒末、花椒末、蒜末的香味炝出来。
//     3.生姜末要和郫县豆瓣一起下锅，而蒜末要最后放，就是浇热油的那一刻，才能最大限度激发出蒜香。
//     4.我选的蔬菜是家里有的，也可以选择自己爱吃的蔬菜，我放了一点点油炒后煮，这样比较香，太多油爆炒就有点腻了，喜欢清淡的也可以只是煮一下哈~
//     5.我用的鸡蛋个头比较大，所以放了半个，小鸡蛋可以放2/3哦~`
// };

class RecipeDetail extends React.Component {

  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="settings" color={tintColor}/>
    ),
  };

  constructor(props) {
    super(props)

    let { navigation } = this.props;
    let { id, formTab } = navigation.state.params;

    this.state = {
      recipeDetail: null,
      formTab,
    };
    // console.log(this.state.recipeDetail);
    // console.log(id, formTab);

    this._fetchRecipeDetailById(id)
  }

  _fetchRecipeDetailById(id) {
    // console.log(id)
    getRecipeDetailById({id})
    .then(data => {
      // console.log(data)
      this.setState({
        recipeDetail: data.recipe_detail,
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  static navigatorStyle = DEFAULT_NAV_BAR_STYLE;

  render() {
    let { recipeDetail } = this.state;

    if (!this.state.recipeDetail) {
      return (
        <View>
          <StackHeader
            title='加载中...'
            backTab={this.state.formTab}
            color='#fff'
            headerOpacity={0.5}
            headerBackgroundColor='#000'
            containerStyle={{
              marginBottom: 5, 
              position: 'absolute', 
              left: 0,
              top: 0,
              zIndex: 99,
            }}/>
          <View style={{paddingTop: 50, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require('../../images/bazou.png')} style={{marginBottom: 10}}/>
              <Text style={{fontSize: 24, color: COLOR.Orange, textAlign: 'center'}}>Oop! 嘿嘿...</Text>
          </View>
        </View>
      );
    }

    return (
      <View>
        <StackHeader
          title={recipeDetail.name} 
          backTab={this.state.formTab}
          color='#fff'
          headerOpacity={0.5}
          headerBackgroundColor='#000'
          containerStyle={{
            marginBottom: 5, 
            position: 'absolute', 
            left: 0,
            top: 0,
            zIndex: 99,
          }}/>
        <ScrollView>
          <View style={styles.wrapperContainer}>
            <View style={styles.recipeContainer}>
              {/* 图片 */}
              <Image 
                source={{uri: recipeDetail.img}} 
                style={styles.image}
                resizeMode="cover"
              />
              {/* 标题 */}
              <View style={styles.listWrapper}>
                <Text style={styles.recipeName}>
                  {recipeDetail.name}
                </Text>
              </View>
              <Divider />

              {/* 材料列表：[主材料和佐料] */}
              <View style={styles.listWrapper}>
                <Text style={styles.recipeNormalTitle}>
                  食材清单：
                </Text>
                <View style={{}}>
                  {
                    //console.log(recipeDetail.ingredients)
                    recipeDetail.material.ingredients.map((i, idx) => (
                      <RListItem 
                        leftText={i.name} 
                        rightText={i.weight} 
                        key={`${i.name}_${idx}`}
                      />
                    ))
                  }
                  {
                    //console.log(recipeDetail.seasoning)
                    recipeDetail.material.seasoning.map((i, idx) => (
                      <RListItem 
                        leftText={i.name} 
                        rightText={i.weight} 
                        key={`${i.name}_${idx}`}
                      />
                    ))
                  }
                </View>
              </View>
              <Divider />

              {/* 做法步骤 */}
              <View style={styles.listWrapper}>
                <Text style={styles.recipeNormalTitle}>
                  做法步骤：
                </Text>

                <View>
                  {
                    recipeDetail.steps.map((step, idx) => (
                      <View style={{marginBottom: 5}} key={`cooking_desc_${idx}`}>
                        <Text style={styles.cookStepIdx}>{`步骤${idx+1}`}:</Text>
                        <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
                          <Image 
                            source={{uri: step.img, width: 100, height: 100}}
                            style={{marginRight: 20, flex: 4, borderRadius: 10}}
                          />
                          <Text style={styles.cookStepDesc}>{step.desc}</Text>
                        </View>
                      </View>
                    ))
                  }
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {

  },
  recipeContainer: {
    width: '100%',
    //alignItems: 'center',
  },
  image: {
    width: 600,
    height: 200,
  },
  recipeName: {
    fontSize: 30,
    fontWeight: "500",
    // color: COLOR.Gray,
    color: '#000',
  },
  recipeNormalTitle: {
    fontSize: 20,
    marginBottom: 5,
    // fontWeight: "500",
    // color: COLOR.Gray,
    color: '#000',
  },
  listWrapper: {
    padding: 15
  },
  cookStepIdx: {
    fontSize: 18,
    color: '#000',
  },
  cookStepDesc: {
    lineHeight: 20,
    flex: 6,
    // letterSpacing: 5,
  }
});

export default withNavigation(RecipeDetail);