import React from 'react'
import { StyleSheet, Text, View,Image,TouchableHighlight } from 'react-native';
import {logos} from "./TeamInfo"
// const logosURL = {
//   "ATL":"http://assets.stickpng.com/thumbs/58419be4a6515b1e0ad75a58.png",
//   "BKN":"http://assets.stickpng.com/thumbs/58419c7ba6515b1e0ad75a62.png",
//   "BOS":"http://assets.stickpng.com/thumbs/58419c6aa6515b1e0ad75a61.png",
//   "CHA":"http://assets.stickpng.com/thumbs/58419bd7a6515b1e0ad75a57.png",
//   "CHI":"http://assets.stickpng.com/thumbs/58419cf6a6515b1e0ad75a6b.png",
//   "CLE":"http://assets.stickpng.com/thumbs/58419c8da6515b1e0ad75a63.png",
//   "DAL":"http://assets.stickpng.com/thumbs/58419cd6a6515b1e0ad75a68.png",
//   "DEN":"http://assets.stickpng.com/thumbs/58419b70a6515b1e0ad75a50.png",
//   "DET":"http://assets.stickpng.com/thumbs/58419c4ca6515b1e0ad75a5f.png",
//   "GSW":"http://assets.stickpng.com/thumbs/58419ce2a6515b1e0ad75a69.png",
//   "HOU":"http://assets.stickpng.com/thumbs/58419ceda6515b1e0ad75a6a.png",
//   "IND":"http://assets.stickpng.com/thumbs/58419b8da6515b1e0ad75a52.png",
//   "LAC":"http://assets.stickpng.com/thumbs/58419c59a6515b1e0ad75a60.png",
//   "LAL":"http://assets.stickpng.com/thumbs/62066c9fd7b91b0004122608.png",
//   "MEM":"http://assets.stickpng.com/thumbs/58419c00a6515b1e0ad75a5a.png",
//   "MIA":"http://assets.stickpng.com/thumbs/58419cafa6515b1e0ad75a65.png",
//   "MIL":"http://assets.stickpng.com/thumbs/58419ba7a6515b1e0ad75a54.png",
//   "MIN":"http://assets.stickpng.com/thumbs/58419bc5a6515b1e0ad75a56.png",
//   "NOP":"http://assets.stickpng.com/thumbs/58419b9ba6515b1e0ad75a53.png",
//   "NYK":"http://assets.stickpng.com/thumbs/58419cc8a6515b1e0ad75a67.png",
//   "OKC":"http://assets.stickpng.com/thumbs/58419c20a6515b1e0ad75a5c.png",
//   "ORL":"http://assets.stickpng.com/thumbs/58419b7da6515b1e0ad75a51.png",
//   "PHI":"http://assets.stickpng.com/thumbs/58419ca3a6515b1e0ad75a64.png",
//   "PHX":"http://assets.stickpng.com/thumbs/58419d52a6515b1e0ad75a6d.png",
//   "POR":"http://assets.stickpng.com/thumbs/58419c2fa6515b1e0ad75a5d.png",
//   "SAC":"http://assets.stickpng.com/thumbs/58419c3da6515b1e0ad75a5e.png",
//   "SAS":"http://assets.stickpng.com/thumbs/58419cbca6515b1e0ad75a66.png",
//   "TOR":"http://assets.stickpng.com/thumbs/58419bf3a6515b1e0ad75a59.png",
//   "UTA":"http://assets.stickpng.com/thumbs/58419bb6a6515b1e0ad75a55.png",
//   "WAS":"http://assets.stickpng.com/thumbs/58419c12a6515b1e0ad75a5b.png",
// }



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

  if (gameInfo["clock"] == "" && (gameInfo["isGameActivated"] == false || quarterMapping[gameInfo["period"]["current"]] == "4th")) {
    return "FINAL";
  }
  return (
    quarterMapping[gameInfo["period"]["current"]] + ", " + gameInfo["clock"]
  );
}
export default function FavoriteTeamCard({stream,streamName,teamName,gameInfo,onLinkPress}) {
  return (
      <TouchableHighlight onPress={() => onLinkPress()}>
            <View style={[styles.container]}>

        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
          <Image
          style={styles.tinyLogo}
          source={logos[gameInfo["hTeam"]["triCode"]]}
        />
        <Text style={styles.scoreText}>{gameInfo["hTeam"]["score"]}</Text>
        <Image
          style={styles.tinyLogo}
          source={logos[gameInfo["vTeam"]["triCode"]]}
        />
          <Text style={styles.scoreText}>{gameInfo["vTeam"]["score"]}</Text>
        </View>
          <View style={{flexDirection:"column",alignItems:"center"}}>
            <Text style={{fontSize:10,fontWeight:"500"}}>{timeOfGame(gameInfo)}</Text>
            <Text style={{textDecorationLine:"underline"}}>Click to Watch</Text>
          </View>
          </View>

      </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
    overflow: 'visible',
    margin: "auto",
    shadowColor: '#000',
    shadowOffset: {width: -2, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,

  },
  container: {
    height:50,
    display:"flex",
    flexDirection:"row",
    width:"100%",
    alignItems: 'center',
    borderColor:"black",
    borderWidth:3,
    justifyContent:"space-around"
    // position: "relative",
    // overflow: "hidden",
  },
  tinyLogo: {
    width: 80,
    height: 80,
    overflow: 'visible',
    margin: "auto",
    shadowColor: '#000',
    shadowOffset: {width: -2, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,

  },
  scoreText:{
    fontSize:25,
    fontWeight:"800",
  }
});
