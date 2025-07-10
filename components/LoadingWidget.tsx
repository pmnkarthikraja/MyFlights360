import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet } from "react-native";

const LoadingWidget = () =>{
    return  <LottieView
    source={require('../assets/Animation/Animation -loading1.json')}
    autoPlay
    loop
    style={styles.loadingAnimation}
  />
}

const styles = StyleSheet.create({
    loadingAnimation: {
      width: 80,
      height: 80,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignSelf: 'center'
    },
  });

export default LoadingWidget