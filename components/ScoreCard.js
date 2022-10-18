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
  5 :"OT1",
  6: "OT2",
  7 :"OT3",
  8: "OT4",
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

  if (gameInfo["clock"] == "" && (gameInfo["isGameActivated"] == false || quarterMapping[gameInfo["period"]["current"]] == "4th")) {
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

export default function ScoreCard({ gameInfo, date,onLinkPress, teamUrlNames,index,setIndexSelected,userData }) {
  const [boxScoreVisible, setBoxScoreVisible] = useState(false);
  const [error, setError] = useState(false);
  const [homeSelected,setHomeSelected] = useState(true)
  const animatedHeight = useRef(new Animated.Value(100)).current;

  useEffect(() => {

    Animated.spring(animatedHeight, {
      friction: 100,
      toValue: boxScoreVisible ? (getNumberOfPlayersPlaying(gameInfo["boxScore"],homeSelected) * 28) + 190 : 100,
      useNativeDriver: false,
    }).start();

}, [boxScoreVisible,homeSelected]);

  useEffect(() => {
    setBoxScoreVisible(false)
    setError(false)
  },[date])

  return (
    <View 
    // onLayout={(event) => {
    //   const layout = event.nativeEvent.layout;
    //   const score = scoreboard;
    //   score[index]["yVal"] = layout.y;
    //   setscoreboard(score)
    // }}
    style={{marginBottom:3}}
    >
    <TouchableOpacity
      onPress={async () => {
        const temp = boxScoreVisible;
        if(!(gameInfo["clock"] == "" && gameInfo["period"]["current"] <= 1)){
          await setBoxScoreVisible(!temp);
          setError(false)
        }else{
          setError(true)
        }
        // scrollHandler(index)
        setIndexSelected(index)
      }}
    > 
      <Animated.View 
        style={[styles.container, { height: animatedHeight }]}
        >
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <TeamInfo home={true} team={gameInfo["hTeam"]} />
        <View  style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <Text style={{ marginTop: 45 }}>{timeOfGame(gameInfo)}</Text>
        {gameInfo["playoffs"] && <Text>{gameInfo["playoffs"]["seriesSummaryText"]}</Text>}
        </View>
        <TeamInfo home={false} team={gameInfo["vTeam"]} />
          <LinksButtons userData={userData} onLinkPress={onLinkPress} teamUrlNames={teamUrlNames} gameInfo={gameInfo}/>
      </View>
      {error && <View style={{left:"0%",position:"absolute",top:0,left:0,width:Dimensions.get('window').width - 10,height:100,justifyContent:"flex-end",alignItems:"center"}}>
        <Text style={{fontWeight:"600"}}>No Box Score Yet</Text>
        </View>}

      { boxScoreVisible && 
      <View>
        <BoxScore homeSelected={homeSelected} setHomeSelected={setHomeSelected} teamUrlNames={teamUrlNames} gameInfo={gameInfo} boxScore={gameInfo["boxScore"]} />

      </View>}
      </Animated.View>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
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
    shadowRadius: 5,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    overflow: "hidden",
  },
});
