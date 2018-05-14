import React, { AppRegistry } from 'react-native';
import { TabNavigator, StackNavigator, SwitchNavigator, TabBarTop, TabBarBottom } from 'react-navigation';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Icon } from 'react-native-elements';

import HomeScreen from './src/Home';
import SettingHome from './src/Setting';
import Explore from './src/Explore';
import LandingPage from './src/LandingPage';
import SettingFav from './src/setting/SettingFav';
import About from './src/setting/About';
import InputRecipe from './src/setting/InputRecipe';
import RecipeDetail from './src/recipe/RecipeDetail';

import {COLOR} from './config';

console.disableYellowBox = true; 
const AppNavgator = TabNavigator(
  {
    Home: {
      screen: HomeScreen, 
    },
    Explore: {
      // screen: Explore,
      screen: StackNavigator(
        {
          ExploreHome: {
            screen: Explore,
          },
          RecipeDetail: {
            screen: RecipeDetail,
            navigationOptions: {
              tabBarVisible: false,
            }
          }
        },
        {
          initialRouteName: 'ExploreHome',
          navigationOptions: ({ navigation }) => ({
            tabBarLabel: '探索',
            header: null,
          }),
        }
      ),
    },
    Setting: {
      screen: StackNavigator(
        {
          SettingHome: {
            screen: SettingHome,
          },
          SettingFav: {
            screen: SettingFav,
            navigationOptions: {
              tabBarVisible: false,
            }
          },
          InputRecipe: {
            screen: InputRecipe,
            navigationOptions: {
              tabBarVisible: false,
            }
          },
          About: {
            screen: About,
            navigationOptions: {
              tabBarVisible: false,
            }
          },
        },
        {
          initialRouteName: 'SettingHome',
          navigationOptions: ({ navigation }) => ({
            tabBarLabel: '设置',
            header: null,
          })
        }
      ),
    },
  },
  {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'bottom',
    initialRouteName: 'Home',
    tabBarOptions: {
      showIcon: true,
      labelStyle: {
        margin: 0,
      },
      style: {
        margin: 0,
        padding: 0,
      },
      iconStyle: {
        margin: 0,
        padding: 0,
      },
      indicatorStyle: {
        backgroundColor: '#fff',
      }
    },
    // navigationOptions: ({navigation}) => ({
    //   tabBarOnPress: ({previousScene, scene, jumpToIndex}) => {
    //     console.log("tabBarOnPress", previousScene, scene);
    //     if (scene.route.routeName === "Explore") {
    //       // console.log('jumpToIndex', 0)
    //       console.log('navigation', navigation)
    //       navigation.popToTop()
    //       // jumpToIndex()
    //       // return
    //       // navigation.state.index = 0;
    //       // navigation.goBack();
    //       return
    //     }
    //     jumpToIndex(scene.index)
    //   }
    // })
  }
);

const EntryNavgator = SwitchNavigator(
  {
    LandingPage: {
      screen: LandingPage,
    },
    App: {
      screen: AppNavgator,
    }
  }
);

AppRegistry.registerComponent('recipes', () => EntryNavgator);
