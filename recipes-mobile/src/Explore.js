import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Picker, TextInput, FlatList, Image} from 'react-native';
import { Button, Card, Icon, Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { COLOR } from '../config';
import { getRecipeCategories, getRecipeListByCategory, searchRecipe } from './rest/recipe';

// const categories = [
//   {
//     label: '川菜',
//     value: '川菜',
//   },
//   {
//     label: '川菜',
//     value: '川菜',
//   },
//   {
//     label: '川菜',
//     value: '川菜',
//   },
//   {
//     label: '川菜',
//     value: '川菜',
//   }
// ]


// mode for page header showing
const searchMode = 1;
const displayMode = 2;

class Explore extends React.Component {

  static navigationOptions = {
    tabBarLabel: '发现',
    tabBarIcon: ({tintColor}) => (
      <Icon name="book" color={tintColor}/>
    ),
  };

  state = {
    selectedCategory: '川菜',
    categories: ['川菜'],
    page: 1,
    recipes: [],
    categoryRecipeCnt: 0,
    mode: displayMode,
    noMore: false,
    searchRecipeName: '',
  }

  refresh() {
    this._fetchCategories()
    this._fetchCurrentCateRecipes(
      this.state.selectedCategory,
      this.state.page
    );
  }

  _fetchCategories() {
    getRecipeCategories().
    then(data => {
      if (data.code === 0) {
        this.setState({
          categories: data.recipe_categories,
        });
      }
    })
    .catch(err => {
      console.log("error", err);
    })
  }

  _fetchCurrentCateRecipes(cat, page) {
    let limit = 10,
        skip = (page - 1) * 10;
    getRecipeListByCategory({cat, limit, skip})
    .then(data => {
      if (data.code === 0) {

        // no more recipe data
        if (data.recipe.length === 0) {
          console.log('no more');
          this.setState({ noMore: true })
          return
        }

        // has recipe data
        if (page === 1) {
          this.setState({
            recipes: data.recipe,
            page: page,
            categoryRecipeCnt: data.total,
          });
        } else {
          this.setState({
            recipes: this.state.recipes.concat(data.recipe),
            page: page,
            categoryRecipeCnt: data.total,
          });
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  _searchRecipeByName(recipe_name, page) {
    let limit = 10,
        skip = (page - 1) * 10;
    searchRecipe({recipe_name, limit, skip})
    .then(data => {
      console.log(data)
      if (data.code === 0) {
        this.setState({
          recipes: data.recipes, 
          noMore: data.recipes.length === 0,
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  _searchInputBlur() {
    let {searchRecipeName} = this.state;
    this.setState({
      mode: displayMode,
    });
    if (!searchRecipeName.length) {
      return
    }
    this._searchRecipeByName(searchRecipeName, 1);
  }

  _renderLeftHeaderComp() {
    let comp = null;
    let { mode } = this.state; 

    switch (mode) {
      case searchMode:
        comp = (
          <View style={{width: '100%', flexDirection: 'row'}}>
            <Icon name="arrow-back" color="#fff" size={18}
              underlayColor={COLOR.Theme}
              onPress={() => this.setState({mode: displayMode})}/>
            <TextInput
              placeholder='搜索菜名'
              placeholderTextColor={COLOR.Gray}
              style={{
                fontSize: 16, 
                color: '#fff', 
                padding: 0,
                paddingLeft: 10, 
                paddingRight: 10, 
                margin: 0, 
                marginLeft: 10,
                width: 250, 
                borderWidth: 1, 
                borderColor: COLOR.Gray,
                borderRadius: 10,
              }}
              underlineColorAndroid="transparent"
              onBlur={() => this._searchInputBlur() }
              onChangeText={(text) => this.setState({searchRecipeName: text})}
              returnKeyLabel="done"
            />
          </View>
        );
        break;
      case displayMode:
      default:
        comp = (
          <View style={{marginTop: 5, marginBottom: 5}}>
            <Icon name="search" color="#fff" size={18}
              underlayColor={COLOR.Theme}
              onPress={() => this.setState({mode: searchMode})}/>
          </View>
        );
    }
    return comp
  }

  _renderRightHeaderComp() {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 5, marginTop: 5}}>
        <Icon name="av-timer" color="#fff" size={18}/>
        <Text style={{fontSize: 16, color: '#fff'}}> {this.state.categoryRecipeCnt}</Text>
      </View>
    );
  }

  _renderCenterHeaderComp() {
    let comp = null;
    let { mode } = this.state;
    switch (mode) {
      case searchMode:
        break;
      case displayMode:
      default:
        comp = (
          <View style={{flexDirection: 'row', marginBottom: 5, marginTop: 5}}>
            <Text style={styles.centerHeaderComp}>当前类别：</Text>
            <Picker 
              selectedValue={this.state.selectedCategory}
              prompt={this.state.selectedCategory} 
              onValueChange={(value) => this.onCategoryChange(value)}
              style={styles.catPicker}
            > 
              {
                this.state.categories.map((cat, idx) => (
                  <Picker.Item label={cat} value={cat} key={`${cat}_${idx}`}/>
                ))
              }
            </Picker>
          </View>
        );
    }
    return comp
  }

  _renderListFooterComp() {
    return (
      <View style={{alignItems: 'center', padding: 5}}>
        {
          this.state.noMore?
          <Text>———— 没有更多了 ————</Text>
          :
          (<View>
            <Text>加载中...</Text>
            <Image source={require('../images/meme.gif')} style={{width: 50, height: 50}}/>
          </View>)
        }
      </View>
    );
  }

  onCategoryChange(value) {
    this.setState({
      selectedCategory: value,
      page: 1,
      noMore: false,
    })

    this._fetchCurrentCateRecipes(value, 1);
  }

  // _onScroll(event) {
  //   if(this.state.loadMore){
  //     return;
  //   }
  //   let y = event.nativeEvent.contentOffset.y;
  //   let height = event.nativeEvent.layoutMeasurement.height;
  //   let contentHeight = event.nativeEvent.contentSize.height;

  //   // console.log('offsetY-->' + y);
  //   // console.log('height-->' + height);
  //   // console.log('contentHeight-->' + contentHeight);
  //   // 
  //   if ((y + height) >= (contentHeight-20)) {
  //       this.setState({ loadMore: true});
  //   }
  // }
  
  onEndReach(info) {
    // show loading bar
    let { selectedCategory, page, recipes } = this.state
    this._fetchCurrentCateRecipes(selectedCategory, page+1);
    this.setState({
      page: page+1,
    })
  }

  gotoRecipeDetail({id}) {
    this.props.navigation.navigate('RecipeDetail', {id: id, formTab: 'Explore'})
  }

  componentDidMount() {
    this.refresh()
  }

  render() {
    return (
    <View>
      <Header
        backgroundColor={COLOR.Theme}
        outerContainerStyles={styles.headerOutContainer}
        centerComponent={this._renderCenterHeaderComp()}
        leftComponent={this._renderLeftHeaderComp()}
        rightComponent={this._renderRightHeaderComp()}
      />
      <View style={styles.container}>
        <FlatList
          data={this.state.recipes}
          style={{width: '100%', paddingLeft: 5, paddingRight: 5}}
          onEndReached={(info) => this.onEndReach(info)}
          onEndReachedThreshold={0.05}
          keyExtractor={(item, index) => item.id}
          ListFooterComponent={this._renderListFooterComp()}
          renderItem={({item: recipe}) => (
            <Card
              //key={recipe.id}
              //image={require('../images/smalld.jpg')}
              title={recipe.name}
              titleStyle={styles.cardHeader}
              image={{uri: recipe.img, width: '100%', height: 100}}
              containerStyle={styles.cardContainer}
            >
              <View style={{flexDirection: 'row', margin: 5}}>
                <View style={{flexDirection: 'row', flex: 3, justifyContent: 'center'}}>
                  <Icon name="remove-red-eye" size={16} color={COLOR.Orange}/>
                  <Text> {recipe.view_cnt}</Text>
                </View>
                <View style={{flexDirection: 'row', flex: 3, justifyContent: 'center'}}>
                  <Icon name="star" size={16} color={COLOR.Orange}/>
                  <Text> {recipe.mark_cnt}</Text>
                </View>
                <View style={{flexDirection: 'row', flex: 3, justifyContent: 'center'}}>
                  <Icon name="book" size={16} color={COLOR.Orange}/>
                  <Text> {recipe.cat}</Text>
                </View>
              </View>

              {/* follow view btn*/}
              <View style={{alignItems: 'center', margin: 5}}>
                <Button
                  small
                  icon={{name:'find-in-page', color:'#fff'}}
                  backgroundColor={COLOR.Theme}
                  fontFamily='Lato'
                  buttonStyle={styles.recipeBtnStyle}
                  title='查看做法'
                  onPress={() => this.gotoRecipeDetail({id: recipe.id})}
                />
              </View>
            </Card>
          )}
        />
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 80,
  },
  headerOutContainer: {
    height: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 0,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
  },
  centerHeaderComp: {
    fontSize: 16,
    color: '#fff',
  },
  catPicker: {
    width: 100,
    height: '100%',
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    // fontSize: 14,
    color: '#fff',
    // backgroundColor: '#fff'
  },
  cardHeader: {
    // backgroundColor: COLOR.Theme,
    // backgroundColor: '#000',
    // opacity: 0.5,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 0,
    marginBottom: 0,
    // color: '#fff',
  },
  cardContainer: {
    width: '100%',
    // height: 300,
    margin: 0,
    marginBottom: 10,
    padding: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  recipeBtnStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    padding: 8,
    width: 130,
    borderRadius: 20,
  }
});

export default withNavigation(Explore);