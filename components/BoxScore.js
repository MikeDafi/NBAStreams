import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableHighlight,TouchableOpacity, Image, Button } from 'react-native';
import { Dimensions } from "react-native";
const rgbValues = {
  "Cleveland Cavaliers": "rgba(134,0,56,1)",
  "Milwaukee Bucks": "rgba(0,71,27,1)",
  "Boston Celtics": "rgba(0,122,51,1)",
  "Atlanta Hawks": "rgba(225,68,52,1)",
  "Brooklyn Nets": "rgba(0,0,0,1)",
  "Charlotte Hornets": "rgba(29,17,96,1)",
  "Chicago Bulls": "rgba(206,17,65,1)",
  "Dallas Mavericks": "rgba(0,83,188,1)",
  "Denver Nuggets": "rgba(13,34,64,1)",
  "Detroit Pistons": "rgba(200,16,46,1)",
  "Golden State Warriors": "rgba(29,66,138,1)",
  "Houston Rockets": "rgba(206,17,65,1)",
  "Indiana Pacers": "rgba(0,45,98,1)",
  "LA Clippers": "rgba(206,16,46,1)",
  "Los Angeles Lakers": "rgba(85,37,130,1)",
  "Memphis Grizzlies": "rgba(93,118,169,1)",
  "Miami Heat": "rgba(152,0,46,1)",
  "Minnesota Timberwolves": "rgba(12,35,64,1)",
  "New Orleans Pelicans": "rgba(0,22,65,1)",
  "New York Knicks": "rgba(0,107,182,1)",
  "Oklahoma City Thunder": "rgba(0,125,195,1)",
  "Orlando Magic": "rgba(0,125,197,1)",
  "Philadelphia 76ers": "rgba(0,107,182,1)",
  "Phoenix Suns": "rgba(29,17,96,1)",
  "Portland Trail Blazers": "rgba(224,58,62,1)",
  "Sacramento Kings": " rgba(91,43,130,1)",
  "San Antonio Spurs": "rgba(6,25,34,1)",
  "Toronto Raptors": "rgba(206,17,65,1)",
  "Utah Jazz": "rgba(0,43,92,1)",
  "Washington Wizards": "rgba(0,43,92,1)"

}
const size1Column = 65
const size2Column = 35
const size3Column = 25
const starters = [
  { "cat": "Starters", "textWidth": size1Column },
  { "cat": "Min", "textWidth": size3Column },
  { "cat": "Pts", "textWidth": size3Column },
  { "cat": "FG", "textWidth": size2Column },
  { "cat": "FT", "textWidth": size2Column },
  { "cat": "3PT", "textWidth": size2Column },
  { "cat": "+/-", "textWidth": size3Column },
  { "cat": "Reb", "textWidth": size3Column },
  { "cat": "Ast", "textWidth": size3Column },
  { "cat": "TO", "textWidth": size3Column },
  { "cat": "Stl", "textWidth": size3Column },
  { "cat": "Blk", "textWidth": size3Column },
]
const bench = [
  { "cat": "Bench", "textWidth": size1Column },
  { "cat": "Min", "textWidth": size3Column },
  { "cat": "Pts", "textWidth": size3Column },
  { "cat": "FG", "textWidth": size2Column },
  { "cat": "FT", "textWidth": size2Column },
  { "cat": "3PT", "textWidth": size2Column },
  { "cat": "+/-", "textWidth": size3Column },
  { "cat": "Reb", "textWidth": size3Column },
  { "cat": "Ast", "textWidth": size3Column },
  { "cat": "TO", "textWidth": size3Column },
  { "cat": "Stl", "textWidth": size3Column },
  { "cat": "Blk", "textWidth": size3Column },
]
const catToCatMatching = {
  "Pts" : "points",
  "Min" : "min",
  "FG"  : "fgm",
  "FT"  : "ftm",
  "3PT" : "tpm",
  "+/-" : "plusMinus",
  "Reb" : "totReb",
  "Ast" : "assists",
  "TO"  : "turnovers",
  "Stl" : "steals",
  "Blk" : "blocks",
}

function namePlayer(first, last) {
  return first.substring(0, 1) + ". " + last
}

const inGame = "900"
export default function BoxScore({ gameInfo, boxScore, teamUrlNames, homeSelected, setHomeSelected }) {
  const [count, setCount] = useState(0)
  const [playersSeen, setPlayersSeen] = useState([])
  const [home,setHome] = useState([])
  const [away,setAway] = useState([])
  const [showHome,setShowHome] = useState(true)
  const [chosenCategory, setChosenCategory] = useState("points")
  const [ascending, setAscending] = useState(-1)
  useEffect(async () => {
    if (boxScore != undefined && boxScore["activePlayers"] != undefined) {
        const homeArray = boxScore["activePlayers"].slice(13, 26)
        const awayArray = boxScore["activePlayers"].slice(0, 13)

        setHome(homeArray)
        setAway(awayArray)
        filterPlayers(homeSelected ? homeArray : awayArray,chosenCategory,ascending)
      setAscending(-1)
    }

  }, []);

  function filterPlayers(pS,cat,ascendingVar) {
    var starting5 = []
    var bench = []
    for (var i = 0; i < pS.length; i++) {
      if (pS[i]["min"] != "" && pS[i]["min"] != "0:00") {
        if(starting5.length < 5){
          starting5.push(pS[i])
        }else{
          bench.push(pS[i])
        }
      }
    }
    newPlayersSeen = starting5.sort(function(a, b) {
        return ascendingVar * (parseCat(a[cat]) - parseCat(b[cat]));
    }).concat(bench.sort(function(a, b) {
      return  ascendingVar *(parseCat(a[cat]) - parseCat(b[cat]));
    }))
    setPlayersSeen(newPlayersSeen)
  }

  function parseCat(string){
    if(chosenCategory == "min"){
      return parseInt(string.substring(0, string.indexOf(":")))
    }else{
      return parseInt(string)
    }
  }

  function twoLayerSetChosenCategory(cat){
    var ascendingVar = -1
    if(cat != chosenCategory){
      setChosenCategory(cat)
    }else{
      ascendingVar = -1 * ascending
    }
    setAscending(ascendingVar)
    return ascendingVar

  }
  


  return (
    <View >
      <TouchableOpacity activeOpacity={1}>
      {boxScore != undefined && boxScore["activePlayers"] != undefined &&
        <View style={styles.container}>
          <View style={{ display: "flex", flexDirection: "row", alignContent: "center", }}>
            <TouchableHighlight
              style={{ justifyContent: "center", alignItems: "center", width: (Dimensions.get("window").width - 50) / 2, height: 25, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, backgroundColor: homeSelected ? rgbValues[teamUrlNames[gameInfo["hTeam"]["triCode"]][1].replaceAll("-", " ")] : "white", borderWidth: 3, borderColor: 'black', }}
              onPress={() => { setCount(0); if (!homeSelected) {setShowHome(true);filterPlayers(home,chosenCategory,ascending) } setHomeSelected(true) }}>
              <Text adjustsFontSizeToFit numberOfLines={1} style={{ fontSize: 100, color: homeSelected ? "white" : "black" }}>{teamUrlNames[gameInfo["hTeam"]["triCode"]][1].replaceAll("-", " ")}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ justifyContent: "center", alignItems: "center", width: (Dimensions.get("window").width - 50) / 2, height: 25, borderTopRightRadius: 50, borderBottomRightRadius: 50, backgroundColor: !homeSelected ? rgbValues[teamUrlNames[gameInfo["vTeam"]["triCode"]][1].replaceAll("-", " ")] : "white", borderWidth: 3, borderColor: 'black', }}
              onPress={() => { setCount(0); if (homeSelected) {setShowHome(false);filterPlayers(away,chosenCategory,ascending) } setHomeSelected(false) }}>
              <Text adjustsFontSizeToFit numberOfLines={1} style={{ fontSize: 100, color: !homeSelected ? "white" : "black" }}>{teamUrlNames[gameInfo["vTeam"]["triCode"]][1].replaceAll("-", " ")}</Text>
            </TouchableHighlight>
          </View>
          <View style={{ display: "flex", flexDirection: "column", marginTop: 2, borderTopColor: "black", borderTopWidth: 2, backgroundColor: "white", borderBottomLeftRadius: 50, borderBottomRightRadius: 50, width: Dimensions.get("window").width - 10 }}>
            <View style={{ display: "flex", height: 25, alignItems: "center", paddingHorizontal: 10, flexDirection: "row", backgroundColor: homeSelected ? rgbValues[teamUrlNames[gameInfo["hTeam"]["triCode"]][1].replaceAll("-", " ")] : rgbValues[teamUrlNames[gameInfo["vTeam"]["triCode"]][1].replaceAll("-", " ")] }}>
              {starters.map((catObject, index) => {
                return(
                  <TouchableOpacity key={index} activeOpacity={1} onPress={() => {const ascendingVar = twoLayerSetChosenCategory(catToCatMatching[catObject.cat]); filterPlayers(showHome ? home : away,catToCatMatching[catObject.cat],ascendingVar)}}>
                    <Text numberOfLines={1} style={{ textAlign: "center",paddingTop:5,height:25, fontSize: 10,width: catObject.textWidth, color: "white" }}>{catObject.cat}{ catToCatMatching[catObject.cat] == chosenCategory && (ascending == -1 ? <Text style={{fontSize:9,fontWeight:"700"}}>▼</Text> : <Text style={{fontSize:9,fontWeight:"700"}}>▲</Text>)}</Text>
                  </TouchableOpacity>
                );
                })}
            </View>
            {playersSeen.map((player, index) => {
              if (index < 5) {
                return (
                  <View key={index} style={{ display: "flex", height: 28, alignItems: "center", paddingHorizontal: 10, flexDirection: "row", backgroundColor: index % 2 ? "rgba(188, 183, 186, 0.5)" : "rgba(237, 236, 236, 0.5)" }}>
                    <Text numberOfLines={1} style={{ fontSize: 10, width: size1Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{namePlayer(player["firstName"], player["lastName"])}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{parseInt(player["min"].substring(0, player["min"].indexOf(":")))}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["points"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size2Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["fgm"] + "-" + player["fga"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size2Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["ftm"] + "-" + player["fta"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size2Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["tpm"] + "-" + player["tpa"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["plusMinus"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["totReb"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["assists"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["turnovers"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["steals"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["blocks"]}</Text>
                  </View>
                );
              }
            })}

            <View style={{ display: "flex", height: 25, alignItems: "center", paddingHorizontal: 10, flexDirection: "row", backgroundColor: homeSelected ? rgbValues[teamUrlNames[gameInfo["hTeam"]["triCode"]][1].replaceAll("-", " ")] : rgbValues[teamUrlNames[gameInfo["vTeam"]["triCode"]][1].replaceAll("-", " ")] }}>
              {bench.map((catObject, index) => {
                return(
                  <TouchableOpacity key={index} activeOpacity={0.05} onPress={() => {const ascendingVar = twoLayerSetChosenCategory(catToCatMatching[catObject.cat]); filterPlayers(showHome ? home : away,catToCatMatching[catObject.cat],ascendingVar)}}>
                    <Text numberOfLines={1} style={{ textAlign: "center",paddingTop:5,height:25, fontSize: 10,width: catObject.textWidth, color: "white" }}>{catObject.cat}{ catToCatMatching[catObject.cat] == chosenCategory && (ascending == -1 ? <Text style={{fontSize:9,fontWeight:"700"}}>▼</Text> : <Text style={{fontSize:9,fontWeight:"700"}}>▲</Text>)}</Text>
                  </TouchableOpacity>
                );
                })}
            </View>
            {playersSeen.map((player, index) => {
              if (index >= 5 && index <= 12) {
                return (
                  <View key={index} style={{ display: "flex", height: 28, alignItems: "center", paddingHorizontal: 10, flexDirection: "row", backgroundColor: index % 2 ? "rgba(188, 183, 186, 0.5)" : "rgba(237, 236, 236, 0.5)", borderBottomLeftRadius: index == 12 ? 5 : 0, borderBottomRightRadius: index == 12 ? 5 : 0, overflow: "hidden" }}>
                    <Text numberOfLines={1} style={{ fontSize: 10, width: size1Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{namePlayer(player["firstName"], player["lastName"])}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{parseInt(player["min"].substring(0, player["min"].indexOf(":")))}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["points"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size2Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["fgm"] + "-" + player["fga"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size2Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["ftm"] + "-" + player["fta"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size2Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["tpm"] + "-" + player["tpa"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["plusMinus"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["totReb"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["assists"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["turnovers"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["steals"]}</Text>
                    <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 10, width: size3Column, color: "black", fontWeight: !(gameInfo["clock"] == "" && gameInfo["isGameActivated"] == false) && player["isOnCourt"] ? inGame : "400" }}>{player["blocks"]}</Text>
                  </View>
                );
              }
            })}
          </View>
        </View>}

        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: "center",
    // position: "relative",
    // overflow: "hidden",
  },
  tinyLogo: {
    width: 50,
    height: 50,
    overflow: 'visible',
    margin: "auto",
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,

  }
});
