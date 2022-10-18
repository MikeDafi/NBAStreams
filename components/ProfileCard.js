import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions,ActivityIndicator } from "react-native";
import {logos} from "./TeamInfo"
import { AntDesign } from '@expo/vector-icons'; 
import EditDomain from "./EditDomain";

// import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

export const streams = [
  {
    stream: 1,
    streamName: "Give Me NBAStreams",
    caption: "Never Offline",
    default: "givemenbastreams.com/nba/"
  },
  {
    stream: 2,
    streamName: "Hockey",
    caption : "No Ads",
    default : "hockeyweb.live/daily/footy/"
  },
  {
    stream: 3,
    streamName: "Azulito",
    caption : "No Ads",
    default : "aas.works/",
  },
  {
    stream: 4,
    streamName: "Cycling Streams",
    caption : "Basic",
    default : "motornews.live/novo/bite/nba/"
  },
]

// const logosURL = [
//   {
//     name: "buffer",
//   },
//   {
//     name: "ATL",
//     link: "http://assets.stickpng.com/thumbs/58419be4a6515b1e0ad75a58.png"
//   },
//   {
//     name: "BKN",
//     link: "http://assets.stickpng.com/thumbs/58419c7ba6515b1e0ad75a62.png"
//   },
//   {
//     name: "BOS",
//     link: "http://assets.stickpng.com/thumbs/58419c6aa6515b1e0ad75a61.png"
//   },
//   {
//     name: "CHA",
//     link: "http://assets.stickpng.com/thumbs/58419bd7a6515b1e0ad75a57.png"
//   },
//   {
//     name: "CHI",
//     link: "http://assets.stickpng.com/thumbs/58419cf6a6515b1e0ad75a6b.png"
//   },
//   {
//     name: "CLE",
//     link: "http://assets.stickpng.com/thumbs/58419c8da6515b1e0ad75a63.png"
//   },
//   {
//     name: "DAL",
//     link: "http://assets.stickpng.com/thumbs/58419cd6a6515b1e0ad75a68.png"
//   },
//   {
//     name: "DEN",
//     link: "http://assets.stickpng.com/thumbs/58419b70a6515b1e0ad75a50.png"
//   },
//   {
//     name: "DET",
//     link: "http://assets.stickpng.com/thumbs/58419c4ca6515b1e0ad75a5f.png"
//   },
//   {
//     name: "GSW",
//     link: "http://assets.stickpng.com/thumbs/58419ce2a6515b1e0ad75a69.png"
//   },
//   {
//     name: "HOU",
//     link: "http://assets.stickpng.com/thumbs/58419ceda6515b1e0ad75a6a.png"
//   },
//   {
//     name: "IND",
//     link: "http://assets.stickpng.com/thumbs/58419b8da6515b1e0ad75a52.png"
//   },
//   {
//     name: "LAC",
//     link: "http://assets.stickpng.com/thumbs/58419c59a6515b1e0ad75a60.png"
//   },
//   {
//     name: "LAL",
//     link: "http://assets.stickpng.com/thumbs/62066c9fd7b91b0004122608.png"
//   },
//   {
//     name: "MEM",
//     link: "http://assets.stickpng.com/thumbs/58419c00a6515b1e0ad75a5a.png"
//   },
//   {
//     name: "MIA",
//     link: "http://assets.stickpng.com/thumbs/58419cafa6515b1e0ad75a65.png"
//   },
//   {
//     name: "MIL",
//     link: "http://assets.stickpng.com/thumbs/58419ba7a6515b1e0ad75a54.png"
//   },
//   {
//     name: "MIN",
//     link: "http://assets.stickpng.com/thumbs/58419bc5a6515b1e0ad75a56.png"
//   },
//   {
//     name: "NOP",
//     link: "http://assets.stickpng.com/thumbs/58419b9ba6515b1e0ad75a53.png"
//   },
//   {
//     name: "NYK",
//     link: "http://assets.stickpng.com/thumbs/58419cc8a6515b1e0ad75a67.png"
//   },
//   {
//     name: "OKC",
//     link: "http://assets.stickpng.com/thumbs/58419c20a6515b1e0ad75a5c.png"
//   },
//   {
//     name: "ORL",
//     link: "http://assets.stickpng.com/thumbs/58419b7da6515b1e0ad75a51.png"
//   },
//   {
//     name: "PHI",
//     link: "http://assets.stickpng.com/thumbs/58419ca3a6515b1e0ad75a64.png"
//   },
//   {
//     name: "PHX",
//     link: "http://assets.stickpng.com/thumbs/58419d52a6515b1e0ad75a6d.png"
//   },
//   {
//     name: "POR",
//     link: "http://assets.stickpng.com/thumbs/58419c2fa6515b1e0ad75a5d.png"
//   },
//   {
//     name: "SAC",
//     link: "http://assets.stickpng.com/thumbs/58419c3da6515b1e0ad75a5e.png"
//   },
//   {
//     name: "SAS",
//     link: "http://assets.stickpng.com/thumbs/58419cbca6515b1e0ad75a66.png"
//   },
//   {
//     name: "TOR",
//     link: "http://assets.stickpng.com/thumbs/58419bf3a6515b1e0ad75a59.png"
//   },
//   {
//     name: "UTA",
//     link: "http://assets.stickpng.com/thumbs/58419bb6a6515b1e0ad75a55.png"
//   },
//   {
//     name: "WAS",
//     link: "http://assets.stickpng.com/thumbs/58419c12a6515b1e0ad75a5b.png"
//   },
//   {
//     name: "buffer",
//   },
// ]



export default function ProfileCard({ setProfileView }) {
  const animatedHeight = useRef(new Animated.Value(100)).current;
  const animatedWidth = useRef(new Animated.Value(100)).current;
  const [userData, setUserData] = useState({})
  const [streamDomainEditing,setStreamDomainEditing] = useState("")
  const [overlayLoading, setOverlayLoading] = useState(false)
  const scrollRef = useRef()

  useEffect(() => {
    // expanded?setText(props.text): setText(props.text.substring(0, 40));
    getUserData()
    Animated.spring(animatedHeight, {
      friction: 100,
      toValue: 500,
      useNativeDriver: false,
    }).start();
    Animated.spring(animatedWidth, {
      friction: 100,
      toValue: Dimensions.get('window').width - 75,
      useNativeDriver: false,
    }).start();


  }, []);

  useEffect(() => {
    scrolltoLogo();
  }, [userData]);

  function scrolltoLogo(){
    var offset = -110
    const keys = Object.keys(logos)
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == userData["favoriteTriCode"]) {

        break
      }
      offset += 100
    }
    scrollRef.current?.scrollTo({
      x: offset,
      animated: true,
    });
  }


  async function initializeUserData(){
    var userData = {"favoriteTriCode" : "GSW","favoriteStream" : 3,"domains" : {}}
    for(var i = 0; i < streams.length; i++){
      userData.domains[streams[i].streamName] = streams[i].default
    }
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    return userData;
  }

  async function getUserData() {
    var userData = {}
    try {
      userData = await AsyncStorage.getItem("userData").then(async (result) => {
        var userData = JSON.parse(result)
        if (!userData || !userData.favoriteTriCode || !userData.favoriteStream || !userData.domains || userData.domains == undefined) {
          userData = initializeUserData();
          return userData
        }

        return JSON.parse(result)
      })
    } catch (e) {
      userData = initializeUserData();
    }
    setUserData(userData)
  }

  async function setStateUserData(team, stream,domains) {
    setOverlayLoading(true)
    var userData1 = { "favoriteTriCode": team, "favoriteStream": stream, domains : domains }
    await setUserData(userData1)
    await AsyncStorage.setItem("userData", JSON.stringify(userData1));
    setOverlayLoading(false)
  }



  function setDomain(stream,domain){
    var domains = userData.domains;
    domains[stream] = domain;
    setStateUserData(userData.favoriteTriCode,userData.favoriteStream,userData.domains)   
    setStreamDomainEditing("");
  }


  return (
    <TouchableOpacity
      onPress={() => {
        setProfileView(false)
      }}
      style={{ height: Dimensions.get('window').height, position: "absolute", top: 0, left: 0, width: "100%", justifyContent: "center", alignItems: "center" }}

    >
      <Animated.View
        style={[styles.container, { height: animatedHeight, width: animatedWidth }]}
      >
        {streamDomainEditing.length != ""  ? 
        <TouchableWithoutFeedback>
          <EditDomain  userData={userData} currentDomain={userData.domains[streamDomainEditing]} streamDomainEditing={streamDomainEditing} setDomain={setDomain}/>
        </TouchableWithoutFeedback> :
        <TouchableWithoutFeedback>
          <View>
            <TouchableOpacity
              onPress={() => {
                setProfileView(false)
              }}
              onStartShouldSetResponder={() => true}
              style={{width:50,height:60,overflow:"hidden"}}
            >
              <View>
            <AntDesign name="arrowleft" size={50} color="black" />
            </View>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", fontSize: 30, marginBottom: 10,marginTop:-30 }}>Favorite Team</Text>

            <ScrollView
              horizontal={true}
              ref={scrollRef}
            >
              {Object.entries(logos).map(([name,image], index) => {
                if (index == 0 || index == logos.length - 1) {
                  return (
                    <View key={index} style={{ width: 100, height: 150 }} />
                  )
                } else {
                  return (
                    <TouchableOpacity onPress={() => { setStateUserData(name, userData.favoriteStream,userData.domains); }} onStartShouldSetResponder={() => true} key={index}>
                      <View key={index} style={{ borderWidth: name == userData.favoriteTriCode ? 3 : 0, borderRadius: 5, borderColor: "black", width: 100, height: 150, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                        <Image
                          style={styles.tinyLogo}
                          source={image}
                        />
                        <Text style={{ fontSize: 20 }}>{name}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                }
              })}
            </ScrollView>
            <Text style={{ textAlign: "center", fontSize: 30, marginTop: 30,marginBottom:20 }}>Favorite Stream</Text>
            <View style={{flexDirection:"row"}}>
              {streams.map((item,index) => {
              if(index < 2){
                return(
              <TouchableOpacity onPress={() => { setStateUserData(userData.favoriteTriCode, item.stream); }} onStartShouldSetResponder={() => true} key={index}>
                  <View style={{justifyContent:"center",width:(Dimensions.get("window").width - 75)/2,height:90,justifyContent:"center",borderWidth:userData.favoriteStream == item.stream ? 3 : 0, borderRadius: 5, borderColor: "black",}}>
                    <Text adjustsFontSizeToFit numberOfLines={item.streamName.indexOf(' ') >= 0 ? 2 : 1 } style={{fontSize:30,textAlign:"center",color:userData.favoriteStream == item.stream ? "black" : "gray"}}>{item.streamName}</Text>
                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                      <Text adjustsFontSizeToFit numberOfLines={1} style={{textAlign:"center",fontWeight:"200"}}>*{item.caption}*</Text>
                      <TouchableOpacity onPress={() =>  {setStreamDomainEditing(item.streamName); console.log(streamDomainEditing);}}>
                        <AntDesign name="edit" size={17} color="black" />
                        </TouchableOpacity>
                    </View>
                  </View>
              </TouchableOpacity>
              )}})}
            </View>
            <View style={{flexDirection:"row",marginTop:7}}>
              {streams.map((item,index) => {
              if(index >= 2){
                return(
              <TouchableOpacity onPress={() => { setStateUserData(userData.favoriteTriCode, item.stream,userData.domains); }} onStartShouldSetResponder={() => true} key={index}>
                  <View style={{justifyContent:"center",width:(Dimensions.get("window").width - 75)/2,height:90,justifyContent:"center",borderWidth:userData.favoriteStream == item.stream ? 3 : 0, borderRadius: 5, borderColor: "black",}}>
                    <Text adjustsFontSizeToFit numberOfLines={item.streamName.indexOf(' ') >= 0 ? 2 : 1 } style={{fontSize:30,textAlign:"center",color:userData.favoriteStream == item.stream ? "black" : "gray"}}>{item.streamName}</Text>
                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                      <Text adjustsFontSizeToFit numberOfLines={1} style={{textAlign:"center",fontWeight:"200"}}>*{item.caption}*</Text>
                      <TouchableOpacity onPress={() =>  {setStreamDomainEditing(item.streamName); console.log(streamDomainEditing)}}>
                        <AntDesign name="edit" size={17} color="black" />
                        </TouchableOpacity>
                    </View>
                  </View>
              </TouchableOpacity>
              )}})}
            </View>
          </View>
        </TouchableWithoutFeedback>}
      </Animated.View>
      {overlayLoading &&
      <View style={{height:500,width: Dimensions.get('window').width - 75,backgroundColor:"rgba(255,255,255,0.5)",justifyContent:"center",alignItems:"center",position:"absolute"}}>
        <ActivityIndicator color="black" size="large" style={{height:80}} />
      </View>}
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
    width: 100,
    height: 100,
    overflow: "visible",
  },
});