import React,{useState,useEffect} from 'react'
import { ActivityIndicator,StyleSheet, Text, View,ImageBackground,Image,TouchableOpacity } from 'react-native';

const weekSymbol = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const fontWeights = ["100","300","300","900","300","300","100"]
// var d = new Date()

export default function DayScroller({dateOffset,goBackOrForward,loading}) {
  const [localLoading,setLocalLoading] = useState(false)
  const [dateObject,setDateObject] = useState(new Date())
  useEffect(() =>{
    var d = new Date()
    d.setDate(d.getDate() - dateOffset);
    setDateObject(d)
  },[dateOffset])
  useEffect(() =>{
     setLocalLoading(loading)
  },[loading])
  return (
    <View style={[styles.container,{justifyContent:"center",height:80,paddingBottom:10}]}>
      <View style={[styles.container,{flexDirection:"row",    justifyContent: 'space-around'}]}>
      {[-3,-2,-1,0,1,2,3].map((val,index)=>{
        const d = new Date()
        d.setDate(d.getDate() - dateOffset + val)
        var day = dateObject.getDay() + val
        day = day < 0 ? day + 7 : (day > 6 ? day - 7 : day)
        return(
          <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => goBackOrForward(dateOffset - val)}>
          <View style={{justifyContent:"center",alignItems:"center",width:50}}>
          <Text style={{fontSize:20,color:(localLoading && val == 0) ? "gray":"black",fontWeight:fontWeights[index]}}>{weekSymbol[day]}</Text>
          <Text style={{fontSize:20,color:(localLoading && val == 0) ? "gray":"black",fontWeight:fontWeights[index]}}>{d.getDate()} </Text>
          <View style={{position:"absolute"}}>
          {localLoading && val == 0 && < ActivityIndicator color="black" size="large" style={{height:80}} />}
          </View>
          </View>
          </TouchableOpacity>
        );
      })}
      </View>
      <Text>{monthNames[dateObject.getMonth()]}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection:"column",
    width:"100%",
    alignItems: 'center',

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
