import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import { COLOR } from '../config';

class LandingPage extends Component {
  
  static navigationOptions = {
    tabBarLabel: 'Loading',
  };

  _enter() {
    this.props.navigation.navigate('App');
  }

  componentWillMount() {
    if (false) {
      this._enter()
    }
  }

  render(){
    return (
      <Swiper 
        style={styles.wrapper}
        autoplay={false}
        loop={false}
        activeDotColor="#fff"
      >
        <View style={styles.slide1}>
          <Image source={require('../images/meme.gif')} style={{marginBottom: 20, width: 100, height: 100}}/>
          <Text style={styles.text}>汇集各路美食</Text>
        </View>
        <View style={styles.slide2}>
          <Image source={require('../images/bazou.png')} style={{marginBottom: 20}}/>
          <Text style={styles.text}>每周菜谱推荐</Text>
          <Text style={styles.textNormal}>就怕你不敢吃！！！</Text>
          <Text style={styles.textNormal}>茄子煎蛋</Text>
          <Text style={styles.textNormal}>小龙虾煎牛扒</Text>
          <Text style={styles.textNormal}>巧克力拌饭</Text>
          <Text style={styles.textNormal}>...</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>舌尖上的App</Text>
          <Text style={styles.textNormal}>这滋味～ 这酸爽～</Text>
          <Text style={styles.textNormal}>一个能吃的App</Text>
          <View style={{position: 'absolute', bottom: 80}}>
            <Button
              backgroundColor={COLOR.Theme}
              buttonStyle={styles.btnStyle}
              title="开始使用" 
              color={COLOR.LightRed}
              //titleStyle={styles.titleStyle}
              iconRight={{name: 'done', color: COLOR.LightRed}}
              onPress={() => this._enter()} />
          </View>
        </View>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.LightBlue,
    opacity: 0.9,
  },
  slide2: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.LightYellow,
    paddingTop: 100,
    opacity: 0.9,
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.LightRed,
    opacity: 0.9,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textNormal: {
    color: '#fff',
    fontSize: 15,
  },
  btnStyle: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 300,
  }
});


export default withNavigation(LandingPage);
