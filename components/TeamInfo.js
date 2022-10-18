import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,Image } from 'react-native';
export const logos = {
    "ATL":require("../assets/logos/ATL.png"),
    "BKN":require("../assets/logos/BKN.png"),
    "BOS":require("../assets/logos/BOS.png"),
    "CHA":require("../assets/logos/CHA.png"),
    "CHI":require("../assets/logos/CHI.png"),
    "CLE":require("../assets/logos/CLE.png"),
    "DAL":require("../assets/logos/DAL.png"),
    "DEN":require("../assets/logos/DEN.png"),
    "DET":require("../assets/logos/DET.png"),
    "GSW":require("../assets/logos/GSW.png"),
    "HOU":require("../assets/logos/HOU.png"),
    "IND":require("../assets/logos/IND.png"),
    "LAC":require("../assets/logos/LAC.png"),
    "LAL":require("../assets/logos/LAL.png"),
    "MEM":require("../assets/logos/MEM.png"),
    "MIA":require("../assets/logos/MIA.png"),
    "MIL":require("../assets/logos/MIL.png"),
    "MIN":require("../assets/logos/MIN.png"),
    "NOP":require("../assets/logos/NOP.png"),
    "NYK":require("../assets/logos/NYK.png"),
    "OKC":require("../assets/logos/OKC.png"),
    "ORL":require("../assets/logos/ORL.png"),
    "PHI":require("../assets/logos/PHI.png"),
    "PHX":require("../assets/logos/PHX.png"),
    "POR":require("../assets/logos/POR.png"),
    "SAC":require("../assets/logos/SAC.png"),
    "SAS":require("../assets/logos/SAS.png"),
    "TOR":require("../assets/logos/TOR.png"),
    "UTA":require("../assets/logos/UTA.png"),
    "WAS":require("../assets/logos/WAS.png"),
}
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


export default function TeamInfo({team,home}) {
  const [visible,setVisible] = useState(false)
  useEffect(() => {
    setVisible(true)
  },[])
  return (
    <View style={[styles.container,{paddingRight:!home ? 20 : 0,paddingLeft:home ? 20 : 0}]}>
      {!home && <Text style={{marginTop:20,fontSize:30}}>{team["score"]}</Text>}
      <View style={{textAlign:"center"}}>
      {visible && <Image
        style={styles.tinyLogo}
        source={logos[team["triCode"]]}
      />}
      <Text style={{textAlign: "center",fontWeight:"900"}}>{team["triCode"]}</Text>
      <Text style={{textAlign: "center"}}>{team["win"] + "-" + team["loss"]}</Text>
        </View>
        {home && <Text style={{marginTop:20,fontSize:30}}>{team["score"]}</Text>}
        
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
    width: 60,
    height: 60,
    overflow: 'visible',
    margin: "auto",
    shadowColor: '#000',
    shadowOffset: {width: -2, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,

  }
});
