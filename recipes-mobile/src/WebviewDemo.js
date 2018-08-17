import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, WebView } from 'react-native';
import { List, ListItem, Icon, Header} from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { COLOR } from '../config';
import axios from 'axios';

const version = "3.0"
const service =  "reapal.trust.userContract"
const partner =  "100000000007744"
const signType =  "0"
const sign =  "d5efc72a16eaa7e4f8af30fca85ca366"

class WebviewDemo extends React.Component {

  state = {
    respHTML: `<p>Loading</p>`
  }

  constructor(props) {
    super(props)
    this.serailBody()
  }

  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="settings" color={tintColor}/>
    ),
  };

  serailBody(){
    let reqData = {
      "orderNo": "CR201504108539",
      "userType":"02",
      "userName": "张三",
      "remark": "",
      "busway": "01",
      "returnUrl": "https://www.baidu.com",
      "notifyUrl": "http://111.203.228.5:28002/simu/conNot.htm", 
      "applyTime": "2015-01-10 15:04:42"
    }

    // var form = document.createElement("form")
    var postData = {
      "service": service,
      "version": version,
      "reqData": reqData,
      "sign": sign,
      "partner": partner,
      "signType": signType
    }
    
    let form = new FormData()
    for(let x in postData) {
      val = postData[x]
      if (x == "reqData") {
        val = JSON.stringify(postData[x])
      }
      form.append(x, val)
    }
    console.log("calling")
    let config = {
      
    }
    axios.post("http://118.31.228.185:12010/reagw/agreement/agree.htm", form, config).then((res) => {
      console.log("res", res)
      this.setState({respHTML: res.data})
    }).catch((err) => {
      // console.error("err", err, err["_response"], err["response"])
      this.setState({respHTML: err.response.data})
    })

    // axios.get("http://www.baidu.com").then((res) => {
    //   console.log(res)
    //   this.setState({respHTML: res.data})
    // })
    // axios.post("https://api.dev.gogofinance.com/user/account/login").then((res) => {
    //   console.log(res)
    //   this.setState({respHTML: res.data})
    // })
  }
  
  render() {
    console.log("rendering", this.state.respHTML)
    return (
      <WebView
        // source={{uri: 'http://118.31.228.185:12010/reagw/agreement/agree.htm', method: "POST", body: body}}
        source={{html: this.state.respHTML}}
      />
    );
  }
}

const styles = StyleSheet.create({

});

export default withNavigation(WebviewDemo);