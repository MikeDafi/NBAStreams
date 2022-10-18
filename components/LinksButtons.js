import React from 'react'
import { StyleSheet, Text, View,TouchableHighlight } from 'react-native';
import {streams} from "./ProfileCard"
import { Dimensions } from 'react-native';
export default function LinksButtons({gameInfo,onLinkPress,teamUrlNames,userData}) {
  return (
    <View style={{display:"flex",flexDirection:"row",left:"0%",position:"absolute",top:0,left:0,width:Dimensions.get('window').width - 10,justifyContent:"center",alignItems:"center"}}>
      
    <TouchableHighlight
        style={{ borderColor: 'black',backgroundColor:"white", borderWidth:3,    marginLeft: 8,
        height: 40,
        width: 40,
        borderRadius: 40,overflow:"hidden",justifyContent:"center",alignContent:"center" }}
        onPress={()=> { onLinkPress('https://'+ userData.domains[streams[0].streamName] + teamUrlNames[gameInfo["hTeam"]["triCode"]][0] + '-live-stream?sport=basketball')}}
      >
      <Text adjustsFontSizeToFit numberOfLines={2} style={{fontSize:50,textAlign:"center",textAlignVertical:"center"}}>GiveMe Streams</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{ borderColor: 'black',backgroundColor:"white", borderWidth:3,    marginLeft: 8,
        height: 40,
        width: 40,
        borderRadius: 40,overflow:"hidden",justifyContent:"center",alignContent:"center" }}
        onPress={()=> {onLinkPress('https://'+ userData.domains[streams[1].streamName] + (gameInfo["playoffs"] ? "nba-espn-tnt" : teamUrlNames[gameInfo["hTeam"]["triCode"]][1].toLowerCase()) + "/?sport=basketball")}}
      >
      <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize:20,textAlign:"center",textAlignVertical:"center"}}>Hockey</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{ borderColor: 'black',backgroundColor:"white", borderWidth:3,    marginLeft: 8,
        height: 40,
        width: 40,
        borderRadius: 40,overflow:"hidden",justifyContent:"center",alignContent:"center" }}
        onPress={()=> {onLinkPress('https://'+ userData.domains[streams[2].streamName]  + teamUrlNames[gameInfo["hTeam"]["triCode"]][1].toLowerCase() + "-vs-" + teamUrlNames[gameInfo["vTeam"]["triCode"]][1].toLowerCase() + '/?sport=basketball')}}
      >
      <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize:30,textAlign:"center",textAlignVertical:"center"}}>Azulito</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{ borderColor: 'black',backgroundColor:"white", borderWidth:3,    marginLeft: 8,
        height: 40,
        width: 40,
        borderRadius: 40,overflow:"hidden",justifyContent:"center",alignContent:"center" }}
        onPress={()=> {onLinkPress('https://'+ userData.domains[streams[3].streamName]   + (gameInfo["playoffs"] ? "" : teamUrlNames[gameInfo["hTeam"]["triCode"]][1]) + '/?sport=basketball')}}
      >
      <Text adjustsFontSizeToFit numberOfLines={2} style={{fontSize:30,textAlign:"center",textAlignVertical:"center"}}>Cycling Streams</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:100,
    display:"flex",
    flexDirection:"row",
    width:140,
    alignItems: 'center',
    justifyContent: 'space-between',

    // position: "relative",
    // overflow: "hidden",
  },
  tinyLogo: {
    width: 50,
    height: 50,
    overflow: 'visible',
    margin: "auto",
    shadowColor: '#000',
    shadowOffset: {width: -2, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,

  }
});
