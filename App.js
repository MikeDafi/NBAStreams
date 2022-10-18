import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from "react-native-webview";
import ScoreCard from "./components/ScoreCard";
import MainCard from "./components/MainCard"
import FavoriteTeamCard from "./components/FavoriteTeamCard"
import ProfileCard,{streams} from "./components/ProfileCard"
import { Entypo } from '@expo/vector-icons'; 
import DayScroller from "./components/DayScroller"
import { FontAwesome } from '@expo/vector-icons'; 
const unneededCategories = {
  "scoreboard": [
    "seasonStageId",
    "seasonYear",
    "leagueName",
    "arena",
    "statusNum",
    "extendedStatusNum",
    "startTimeEastern",
    "startDateEastern",
    "endTimeUTC",
    "homeStartDate",
    "homeStartTime",
    "dayComplete",
    "gameDuration",
    "isNeutralVenue",
    "isStartTimeTBD",
    "hasGameBookPDF",
    "tickets",
    "attendance",
    "nugget",
    "isRecapArticleAvail",
    "isPreviewArticleAvail",
    "isBuzzerBeater",
    "gameUrlCode",
    "visitorStartTime",
    "visitorStartDate",
  ],
  "broadcast": [
    "audio",
    "video",
  ],
  "broadcasters":[
    "canadian",
    "hTeam",
    "spanish_hTeam",
    "spanish_national",
    "spanish_vTeam",
    "vTeam",
  ],
  "boxScore": [
    "timesTied",
    "leadChanges",
    "vTeam",
    "hTeam"
  ],
  "activePlayers" : [
    "dnp",
    "position_full",
    "sortKey"
  ],
}

function deleteKeysFromObject(whatToDeleteKey,objectToDeleteFrom){
  var whatToDeleteArray = unneededCategories[whatToDeleteKey]
  for(var i = 0; i < whatToDeleteArray.length;i++){
    const keyToDelete = whatToDeleteArray[i]
    if (keyToDelete in objectToDeleteFrom){
      delete objectToDeleteFrom[keyToDelete]
    }
  }
  return objectToDeleteFrom
}

async function getScoreBoard(gameDay) {
  var todayScoreboard = null;
  var d = new Date()
  d.setDate(d.getDate());
  currentGameDay = getGameDay(d);
  try{
    
    todayScoreboard = await AsyncStorage.getItem(gameDay).then(async(result) =>{
      x = JSON.parse(result)
      if(x.length || ((x[0]["dayComplete"] != true && currentGameDay > gameDay)) ){
        x = await fetch(
          "http://data.nba.net/10s/prod/v1/" + gameDay + "/scoreboard.json"
        );
        x = await x.json();
        x = x["games"];
        for(var i = 0; i < x.length;i++){
          x[i] = deleteKeysFromObject("scoreboard",x[i])
          x[i]["watch"]["broadcast"] = deleteKeysFromObject("broadcast",x[i]["watch"]["broadcast"])
          x[i]["watch"]["broadcast"]["broadcasters"] = deleteKeysFromObject("broadcasters",x[i]["watch"]["broadcast"]["broadcasters"])

        }        
        for (var i = 0; i < x.length; i++) {
          var gameId = x[i]["gameId"];
          x[i]["boxScore"] = await getBoxScore(gameId, gameDay);
        }
        x[0]["dayComplete"] = true
        await AsyncStorage.setItem(gameDay, JSON.stringify(x));
      }
      return x;
    })
  }catch(e){
    if(currentGameDay != gameDay){
      var todayScoreboardLink = await fetch(
        "http://data.nba.net/10s/prod/v1/" + gameDay + "/scoreboard.json"
      );
      todayScoreboard = await todayScoreboardLink.json();
      todayScoreboard = todayScoreboard["games"];
      for(var i = 0; i < todayScoreboard.length;i++){
        todayScoreboard[i] = deleteKeysFromObject("scoreboard",todayScoreboard[i])
        todayScoreboard[i]["watch"]["broadcast"] = deleteKeysFromObject("broadcast",todayScoreboard[i]["watch"]["broadcast"])
        todayScoreboard[i]["watch"]["broadcast"]["broadcasters"] = deleteKeysFromObject("broadcasters",todayScoreboard[i]["watch"]["broadcast"]["broadcasters"])

      }
      if(currentGameDay > gameDay){
        for (var i = 0; i < todayScoreboard.length; i++) {
          var gameId = todayScoreboard[i]["gameId"];
          todayScoreboard[i]["boxScore"] = await getBoxScore(gameId, gameDay);
        }
      }
      if(currentGameDay > gameDay && todayScoreboard.length){
        todayScoreboard[0]["dayComplete"] = true
      }
      await AsyncStorage.setItem(gameDay, JSON.stringify(todayScoreboard));
    }

  }

  if(currentGameDay == gameDay){
    var todayScoreboardLink = await fetch(
      "http://data.nba.net/10s/prod/v1/" + gameDay + "/scoreboard.json"
    );
    todayScoreboard = await todayScoreboardLink.json();
    todayScoreboard = todayScoreboard["games"];
    for(var i = 0; i < todayScoreboard.length;i++){
      todayScoreboard[i] = deleteKeysFromObject("scoreboard",todayScoreboard[i])
      todayScoreboard[i]["watch"]["broadcast"] = deleteKeysFromObject("broadcast",todayScoreboard[i]["watch"]["broadcast"])
      todayScoreboard[i]["watch"]["broadcast"]["broadcasters"] = deleteKeysFromObject("broadcasters",todayScoreboard[i]["watch"]["broadcast"]["broadcasters"])
    }    
    todayScoreboard.sort(function(a,b){
      if(a["isGameActivated"]){return -1;}
      if(b["isGameActivated"]){return 1;}
      if(a["period"]["current"] <= 1 && b["period"]["current"] <= 1){
        return a["startTimeUTC"] - b["startTimeUTC"]
      }
      if(a["period"]["current"] <= 1){return -1;}
      if(b["period"]["current"] <= 1){return 1;}
      if(a["period"]["current"] == 4 && b["period"]["current"] == 4){
        return a["startTimeUTC"] - b["startTimeUTC"]
      }
      if(a["period"]["current"] == 4){return -1;}
      if(b["period"]["current"] == 4){return 1;}
      return 0; 
    })


    // Add Box scores
    for (var i = 0; i < todayScoreboard.length; i++) {
      var gameId = todayScoreboard[i]["gameId"];
      if(todayScoreboard[i]["isGameActivated"] || todayScoreboard[i]["period"]["current"] == 4 && !todayScoreboard[i]["gameScoreRecorded"] ){
        todayScoreboard[i]["boxScore"] = await getBoxScore(gameId, gameDay);
        todayScoreboard[i]["period"]["gameScoreRecorded"] = todayScoreboard[i]["period"]["current"] == 4 ? true : false
      }
      // todayScoreboard[i]["onurb88"] =
      //   "http://ace7.usite.pro/glas" + (d.getMonth() > 9 ? "" : "0") + (d.getMonth() + 1) + (d.getDate() > 9 ? "" : "0") + d.getDate() + "/" +
      //   (i < 9 ? "0" : "") +
      //   (i + 1) +
      //   ".html?sport=basketball";
    }
    await AsyncStorage.setItem(gameDay, JSON.stringify(todayScoreboard));
  }

  // setscoreboard(sortedScoreBoard)
  return todayScoreboard;
}

async function getBoxScore(gameId, gameDay) {
  var boxScoresLink = await fetch(
    "http://data.nba.net/10s/prod/v1/" +
      gameDay +
      "/" +
      gameId +
      "_boxscore.json"
  );
  boxScoresLink = await boxScoresLink.json();
  const boxScore = boxScoresLink["stats"];
  if(boxScore){
    var whatToDeleteArray = unneededCategories["boxScore"]
    for(var i = 0; i < whatToDeleteArray.length;i++){
      const keyToDelete = whatToDeleteArray[i]
      if (keyToDelete in boxScore){
        delete boxScore[keyToDelete]
      }
    }
  }

  return boxScore;
  // var todayScoreboardLink = gameLinks["links"]["todayScoreboard"]
}

function getGameDay(date) {
  const year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = date.getDate();
  day = day < 10 ? "0" + day : day;
  return year + "" + month + "" + day;
}
function getEmptyArray(length) {
  return new Array(length).fill(false);
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var currentGameDay = "";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}



export default function App() {
  const webViewRef = useRef(null);
  const [enablewebView, setenablewebView] = useState(false);
  const [scoreboard, setscoreboard] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [uri, seturi] = useState("");
  const [teamUrlNames, setTeamURLNames] = useState({});
  const [dateOffset, setDateOffset] = useState(0);
  const [stringDate,setStringDate] = useState("")
  const [countdown, setCountdown] = useState(20);
  const [mainCardOn,setMainCardOn] = useState(false)
  const [indexSelected, setIndexSelected] = useState(-1);
  const [userData,setUserData] = useState({})
  const [profileView,setProfileView] = useState(false)
  const [loading,setLoading] = useState(false)
  async function getteamURLNames() {
    var teams = await fetch("https://data.nba.net/10s/prod/v2/2021/teams.json");
    teams = await teams.json();
    teams = teams["league"]["standard"];
    const teamAcrToName = {};
    for (var i = 0; i < teams.length; i++) {
      if (teams[i]["isNBAFranchise"]) {
        // ATL = [hawks,Atlanta-Hawks]
        teamAcrToName[teams[i]["tricode"]] = [
          teams[i]["urlName"],
          teams[i]["fullName"].replaceAll(" ", "-"),
        ];
      }
    }
    setTeamURLNames(teamAcrToName)
  }

  async function initializeUserData(){
    var userData = {"favoriteTriCode" : "GSW","favoriteStream" : 3,"domains" : {}}
    for(var i = 0; i < streams.length; i++){
      userData.domains[streams[i].streamName] = streams[i].default
    }
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    return userData;
  }

  async function getUserData(scoreboard){
    var userData = {}
    try{
      userData = await AsyncStorage.getItem("userData").then(async(result) =>{
        var userData = JSON.parse(result)
        if(!userData || !userData.favoriteStream || !userData.favoriteTriCode || !userData.domains){
          userData = initializeUserData();
        }
        
        return JSON.parse(result)
      })
    }catch(e){
      userData = initializeUserData();
    }
    userData["gameIndex"] = undefined
    for(var i = 0; i < scoreboard.length;i++){
      const game = scoreboard[i]
      if(game["hTeam"]["triCode"] == userData.favoriteTriCode || game["vTeam"]["triCode"] == userData.favoriteTriCode){
        userData["gameIndex"] = i
      }
    }
    
    setUserData(userData)
  }
  // async function setStateUserData(team,stream=1,domains){
  //   var userData = {"favoriteTriCode" : team,"favoriteStream" : stream, "domains":domains}
  //   for(var i = 0; i < scoreboard.length;i++){
  //     const game = scoreboard[i]
  //     if(game["hTeam"]["triCode"] == userData.favoriteTriCode || game["vTeam"]["triCode"] == userData.favoriteTriCode){
  //       userData["gameIndex"] = i
  //     }
  //   }
  //   await AsyncStorage.setItem(gameDay, JSON.stringify(userData));
  //   setUserData(userData)
  // }

  const ref = useRef()
  useEffect(async () => {

    // document.write('Today is: ' + d.toLocaleString());
    var d = new Date()
    d.setDate(d.getDate());
    setStringDate("...")
    currentGameDay = getGameDay(d);
    const x = await getScoreBoard(currentGameDay);
    await setscoreboard(x);
    await getteamURLNames()
    getUserData(x)
    // const y = await getBaldStreams(scoreboard,teamUrlNames)
    // await setscoreboard(y)

    setStringDate((d.getMonth() + 1) + "/" + d.getDate())
  }, []);

  useEffect( () => {

    getUserData(scoreboard)
  }, [profileView]);


  
  useInterval(async () => {
    var d1 = new Date()
    d1.setDate(d1.getDate() - dateOffset);
    currentGameDay = getGameDay(d1);
    if(dateOffset == 0){
      var newScoreBoard = await getScoreBoard(currentGameDay);
      d1 = new Date()
      d1.setDate(d1.getDate() - dateOffset);
      currentGameDay = getGameDay(d1);
      for (var i = 0; i < newScoreBoard.length; i++) {
        var gameId = newScoreBoard[i]["gameId"];
        newScoreBoard[i]["boxScore"] = await getBoxScore(gameId, currentGameDay);
      }
      if(dateOffset == 0){
        await setscoreboard(newScoreBoard);
        getUserData(newScoreBoard)
      }
    }
  }, 20000);

  function goBackOrForward(updatedDate){
    setUserData({"gameIndex":undefined})
    var d = new Date()
    setDateOffset(updatedDate)
    d.setDate(d.getDate() - updatedDate);
    setStringDate("...")
    currentGameDay = getGameDay(d);
    setStringDate((d.getMonth() + 1) + "/" + d.getDate())
    
  }
  useEffect(async() =>{
    setLoading(true)
    const dateOffsetTemp = dateOffset
    // setTimeout(async() => {
      var dateOffsetCurrent
      setDateOffset(p => {
        dateOffsetCurrent = p
        return p
      })
      // if(dateOffsetTemp == dateOffsetCurrent){
        var d = new Date()
        d.setDate(d.getDate() - dateOffset);
        setStringDate("...")
        currentGameDay = getGameDay(d);
        const x = await getScoreBoard(currentGameDay);
        await setscoreboard(x);
        await getteamURLNames()
        await getUserData(x)
        setCountdown(20)
        setLoading(false)
      // }
    // }, 300);
  },[dateOffset])

  useEffect(() => {
    const intervalId = setInterval(() => {
        const c = countdown
        setCountdown(c == 0 ? 20 : c - 1)
    }, 1000);
    return () => clearInterval(intervalId);
}, [countdown])

  const goback = () => {
    webViewRef.current.goBack();
  };

  const onRefresh = React.useCallback(async () => {
    setLoading(true)
    var d1 = new Date()
    d1.setDate(d1.getDate() - dateOffset);
    var currentGameDay = getGameDay(d1);
    const start = new Date().getTime() / 1000;
    setRefreshing(true);
    const x = await getScoreBoard(currentGameDay);
    await setscoreboard(x);
    getUserData(x)
    const end = new Date().getTime() / 1000;
    setTimeout(() => {
      setRefreshing(false);
    }, Math.max(500 - (end - start), 0));
    setCountdown(20)
    setLoading(false)
  }, []);

  const run = `
  location.href = 'https://givemenbastreams.com/nba/hawks-live-stream?sport=basketball'';
  true;
`;


  const scrollHandler = (key) => {
    //   ref.current?.scrollTo({
    //     y: scoreboard[key]["yVal"],
    //     animated:true
    //   });
  };

  return (
    // <View style={styles.container}>
    //   <ScrollView
    //       contentContainerStyle={styles.scrollView}
    //       refreshControl={
    //         <RefreshControl
    //           refreshing={refreshing}
    //           onRefresh={onRefresh}
    //         />
    //       }>
    //   {scoreboard.map(function(game,index){
    //     // if(index == 0){
    //     // }
    //     return(
    //       <ScoreCard gameInfo={game}key={index}/>
    //     );
    //   })}
    //   </ScrollView>
    // </View>
    <View style={{ width: "100%", height: "100%", paddingTop: 40 }}>
      {enablewebView && (
        <View style={{ width: "1%", height: "1%" }}>
          <WebView
            style={styles.container}
            source={{
              url: uri,
            }}
            ref={webViewRef}
            allowsLinkPreview={true}
            // renderError={(errorName) => <Error name={errorName} />}    //
            originWhitelist={["about:blank"]}
            javaScriptEnabled={true}
            // originWhitelist={['https://*', 'git://*']}
            allowsBackForwardNavigationGestures={true}
            useWebKit={true}
            startInLoadingState={false}
            javaScriptEnabled
            domStorageEnabled
            onNavigationStateChange={(event) => {

              // setTimeout(() => {setenablewebView(false)}, 3000);
              // if (event.url == "about:blank") {
              // //   // stopLoading()

              //   webViewRef.current.injectJavaScript(run);
              //   // Linking.openURL(event.url);
              // webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();webViewRef.current.goBack();
              // }
            }}
          />
        </View>
      )}
      <View style={{justifyContent:"space-between",display:"flex",flexDirection:"row"}}>
        <Text style={{ color: "black", fontWeight: "800", fontSize: 30 }}>
          <Text style={{ color: "black" }}> Dafi's{" "}</Text>
          N<Text style={{ color: "blue" }}>B</Text>
          <Text style={{ color: "red" }}>A</Text>
        </Text>
        <View style={{display:"flex",flexDirection:"row",alignItems:"center",paddingRight:15}}>
        <View style={{display:"flex",flexDirection:"column",paddingRight:5,justifyContent:"center",alignItems:'center'}}>
        <Text style={{fontSize:10}}>Updating In</Text>
        <Text style={{fontWeight:"800",fontSize:30}}>{countdown}</Text>
        </View>
          <TouchableOpacity onPress={() => setProfileView(true)}>
            <FontAwesome name="user-circle" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <DayScroller dateOffset={dateOffset} goBackOrForward={goBackOrForward} loading={loading} />
      {userData["gameIndex"] != undefined  && scoreboard[userData["gameIndex"]] != undefined && scoreboard[userData["gameIndex"]]["hTeam"] != undefined &&
      <FavoriteTeamCard 
        userData={userData} 
        gameInfo={scoreboard[userData["gameIndex"]]}
        onLinkPress={() => {
          setenablewebView(true);
          if(userData["favoriteStream"] == 1){
          seturi('https://'+ userData.domains[streams[0]].streamName + teamUrlNames[scoreboard[userData["gameIndex"]]["hTeam"]["triCode"]][0] + '-live-stream?sport=basketball');
          }else if(userData["favoriteStream"] == 2){
            seturi("http://"+ userData.domains[streams[1]].streamName + (scoreboard[userData["gameIndex"]]["playoffs"] ? "nba-espn-tnt" : teamUrlNames[scoreboard[userData["gameIndex"]]["hTeam"]["triCode"]][1].toLowerCase()) + "/?sport=basketball")
          }else if(userData["favoriteStream"] == 3){
            seturi("http://"+ userData.domains[streams[2]].streamName + teamUrlNames[scoreboard[userData["gameIndex"]]["hTeam"]["triCode"]][1].toLowerCase() + "-vs-" + teamUrlNames[scoreboard[userData["gameIndex"]]["vTeam"]["triCode"]][1].toLowerCase() + '/?sport=basketball')
          }else if(userData["favoriteStream"] == 4){
            seturi("http://"+ userData.domains[streams[3]].streamName  + (scoreboard[userData["gameIndex"]]["playoffs"] ? "" : teamUrlNames[scoreboard[userData["gameIndex"]]["hTeam"]["triCode"]][1]) + '/?sport=basketball')
          }
          setTimeout(async() => {
            setenablewebView(false)
          }, 1000);
        }}
      />}
      {scoreboard.length > 0 ?
      <ScrollView
        style={{ height: 100 }}
        ref={ref}
        contentContainerStyle={{
          backgroundColor: "white",
          alignItems: "center",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={(dateOffset) => onRefresh(dateOffset)} />
        }
      >
        {scoreboard.map(function (game, index) {
          return (
            <ScoreCard
              date={dateOffset}
              key={index}
              index={index}
              userData={userData}
              teamUrlNames={teamUrlNames}
              scrollHandler={scrollHandler}
              onLinkPress={(uri) => {
                setenablewebView(true);
                seturi(uri);
                setTimeout(async() => {
                  setenablewebView(false)
                }, 1000);
              }}
              setMainCardOn={setMainCardOn}
              setIndexSelected={setIndexSelected}
              gameInfo={game}
            />
          );
        })}
      </ScrollView> :
        <View style={{justifyContent:"center",alignItems:"center",height:"80%"}}>
          <Text style={{fontSize:20}}>There are no games today</Text>
          <Entypo name="emoji-happy" size={50} color="black" />
        </View>
      }
      {mainCardOn && indexSelected >= 0 && 
                  <MainCard
                  key={0}
                  userData={userData}
                  teamUrlNames={teamUrlNames}
                  scoreboard={scoreboard}
                  gameInfo={scoreboard[indexSelected]}
                  onLinkPress={(uri) => {
                    setenablewebView(true);
                    seturi(uri);
                    setTimeout(async() => {
                      setenablewebView(false)
                    }, 1000);
                  }}
                  setMainCardOn={setMainCardOn}
                  setIndexSelected={setIndexSelected}
                />}

      {profileView &&
      <ProfileCard
        setProfileView={setProfileView}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 30 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  navbar: {
    height: 40,
    width: "100%",
    flexDirection: "row-reverse",
    paddingTop: 6,
    backgroundColor: "#fefefe",
    borderTopColor: "grey",
    borderTopWidth: 1,
  },
  back: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  forward: {
    width: 50,
    height: 50,
  },
});
