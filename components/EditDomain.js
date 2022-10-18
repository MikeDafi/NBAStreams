import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";




export default function EditDomain({ currentDomain,streamDomainEditing,setDomain,userData }) {
  const [domain,setNewDomain] = useState(currentDomain)


  return (
    <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
        <Text style={{fontSize:30,}}>Change Domain</Text>
        <Text>Stream: "{streamDomainEditing}"</Text>
        <Text>Exclude https://, end with /</Text>
        {/* <Text>{userData.domains["Azulito"]}</Text> */}
        <Text>e.g. google.com/</Text>
        <TextInput value={domain} onChangeText={setNewDomain} style={styles.input}/>
        <View style={{flexDirection:"row"}}>
        <TouchableOpacity onPress={() => setDomain(streamDomainEditing,currentDomain)} style={[styles.button,{backgroundColor:"rgba(246, 89, 89, 0.8)",borderColor:"red"}]}><Text style={styles.buttonText}>Go Back</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setDomain(streamDomainEditing,domain)} style={[styles.button,{backgroundColor:"rgba(135, 243, 127, 0.8)",borderColor:"rgba(54, 204, 44, 0.8)"}]}><Text style={styles.buttonText}>Confirm</Text></TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    buttonText:{
        fontSize:20,
    },
    button:{
        width:"40%",
        height:60,
        marginHorizontal:10,
        borderRadius:20,
        borderWidth:5,
        justifyContent:"center",
        alignItems:"center"
        
    },
    input: {
        alignItems:"center",
        width:"90%",
        borderRadius:5,
        height: 60,
        margin: 12,
        borderWidth: 3,
        borderColor:"gray",
        padding: 10,
        textAlign:"center",
        fontSize:20
      },
    });
