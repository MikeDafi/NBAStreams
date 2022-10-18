import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import TeamInfo from "./TeamInfo.js";
import { Dimensions } from "react-native";
import BoxScore from "./BoxScore.js";
import LinksButtons from "./LinksButtons.js";
const quarterMapping = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
};

function timeOfGame(gameInfo) {
  if (gameInfo["period"]["isHalftime"]) {
    return "HalfTime";
  }
  if (gameInfo["period"]["isEndOfPeriod"]) {
    return "End of " + quarterMapping[gameInfo["period"]["current"]];
  }
  if (gameInfo["clock"] == "" && gameInfo["period"]["current"] <= 1) {
    gameInfo["hTeam"]["score"] = "";
    gameInfo["vTeam"]["score"] = "";
    var myDate = new Date(gameInfo["startTimeUTC"]);
    var pstDate = myDate.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
    });
    var hour = parseInt(pstDate.substring(0, 2));
    return hour + pstDate.substring(2);
  }

  if (gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) {
    return "FINAL";
  }
  return (
    quarterMapping[gameInfo["period"]["current"]] + ", " + gameInfo["clock"]
  );
}

function getNumberOfPlayersPlaying(boxScore,homeSelected){
  const homeOffset = homeSelected ? 13 : 0
  var playersPlaying = 0
  for(var i = 0; i < 13;i++){
    if(boxScore != undefined && boxScore["activePlayers"] != undefined && boxScore["activePlayers"][i + homeOffset] != undefined && boxScore["activePlayers"][i + homeOffset]["min"] != "" && boxScore["activePlayers"][i + homeOffset]["min"] != "0:00"){
      playersPlaying += 1
    }
  }
  return playersPlaying
}


export default function MainCard({ gameInfo, teamUrlNames,onLinkPress,setIndexSelected,setMainCardOn,userData}) {
  const [boxScoreVisible, setBoxScoreVisible] = useState(true);
  const [error, setError] = useState(false);
  const [homeSelected,setHomeSelected] = useState(true)
  const animatedHeight = useRef(new Animated.Value(100)).current;
  useEffect(() => {
    // expanded?setText(props.text): setText(props.text.substring(0, 40));
    Animated.spring(animatedHeight, {
      friction: 100,
      toValue: boxScoreVisible ? 710 : 500,
      useNativeDriver: false,
    }).start();
  }, [boxScoreVisible,homeSelected]);


  return (
    <TouchableOpacity
    delayPressIn={boxScoreVisible ? 2000 : 0}
      onPress={() => {
        setIndexSelected(-1)
        setMainCardOn(false)
      }}
      style={{height:Dimensions.get('window').height,position:"absolute",top:0,left:0,width:"100%",justifyContent:"center",alignItems:"center"}}

    > 
      <Animated.View 
        style={[styles.container, { height: animatedHeight }]}
        >
        <TouchableOpacity activeOpacity={1}>
        <View style={{marginTop:50,display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <TeamInfo home={true} team={gameInfo["hTeam"]} />
        <Text style={{ marginTop: 45 }}>{timeOfGame(gameInfo)}</Text>
        <TeamInfo home={false} team={gameInfo["vTeam"]} />
        <LinksButtons userData={userData} onLinkPress={onLinkPress} teamUrlNames={teamUrlNames} gameInfo={gameInfo}/>
      </View>
      {error && <View style={{left:"0%",position:"absolute",top:0,left:0,width:Dimensions.get('window').width - 10,height:100,justifyContent:"flex-end",alignItems:"center"}}>
        <Text style={{fontWeight:"600"}}>No Box Score Yet</Text>
        </View>}
      <BoxScore homeSelected={homeSelected} setHomeSelected={setHomeSelected} teamUrlNames={teamUrlNames} gameInfo={gameInfo} boxScore={gameInfo["boxScore"]} />
      </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
    backgroundColor: "white",
    // justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("window").width - 10,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: { width: -2, height: 30 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    overflow: "hidden",
  },
});
