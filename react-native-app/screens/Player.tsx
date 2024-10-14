import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../components/Theme"; 
import { Ionicons, Octicons, Feather } from '@expo/vector-icons';
import { useSong } from '../SongContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPlayerMessage from './AddPlayerMessage';

export default function Player() {
  const { onHandlePlayerToggleLike, onCurrentSong, onTogglePlay, onPreviousButton, onNextButton, isPlaying, onToggleLoop, isLooping, durationMillis, positionMillis } = useSong();
  const progress = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;
  const [timeHandler, setTimeHandler] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const cooldownTime = 1;

  const handleToggleLoop = async () => {
    await onToggleLoop!();
  };

  const handlePreviousButton = async () => {
    if (!timeHandler) {
        setTimeHandler(true);
        await onPreviousButton!();
        setTimeout(() => {
            setTimeHandler(false);
        }, cooldownTime);
    }
  };

  const handleNextButton = async () => {
    if (!timeHandler) {
        setTimeHandler(true);
        await onNextButton!();
        setTimeout(() => {
            setTimeHandler(false);
        }, cooldownTime);
    }
  };

  const handleToggleButton = async () => {
    await onTogglePlay!();
  };

  const handleToggleLike = async () => {
    try {
      const token = (await AsyncStorage.getItem("accessToken")) || "";
      const idSong = onCurrentSong?.currentSong?.id;
      
      if (idSong !== undefined) {
        await onHandlePlayerToggleLike!(token, idSong);

        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    };
  };

  return (
    <>
      <LinearGradient colors={["#19bfb7", "black"]} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.removeIconContainer}>
            <Octicons name="dash" size={60} color="#3b3b3b" />
          </View>
          <View style={styles.imageContainer}>
            {onCurrentSong?.currentSong ?
              <Image
                source={{ uri: `http://192.168.1.25:3000/media/${onCurrentSong?.currentSong.albums.image}` }}
                style={styles.albumImage}
                defaultSource={require("../assets/Songs/default.png")}
                resizeMode="cover"
              /> :
              <Image
                source={require("../assets/Songs/default.png")}
                style={styles.albumImage}
                resizeMode="cover"
              />
            }
          </View>
          <View style={styles.songInfoContainer}>
            {onCurrentSong?.currentSong ?
              <>
                <Text style={styles.songTitle}>{onCurrentSong?.currentSong.name}</Text>
                <Text style={styles.songArtist}>{onCurrentSong?.currentSong.artists.name}</Text> 
              </> :
              <Text style={styles.songTitle}>Not playing</Text>
            }
          </View>
          <View style={styles.controls}>
            <View style={styles.options}>
              <TouchableOpacity onPress={handleToggleLike} style={{marginHorizontal: 115}}>
                <Ionicons name="add" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 115}} onPress={handleToggleLoop} activeOpacity={0.6}>
                <Feather name={"repeat"} size={27} color={isLooping?.loop? 'white' : '#757575'}  />
              </TouchableOpacity>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timers}>
              <Text style={{marginHorizontal: 110, color: 'white'}}> {formatTime(positionMillis)} </Text> 
              <Text style={{marginHorizontal: 110, color: 'white'}}> {formatTime(durationMillis)} </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={handlePreviousButton} style={styles.controlButton}>
                <Ionicons name="play-back" size={50} color={"white"}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleToggleButton} style={styles.controlButton}>
                <Ionicons name={isPlaying?.play ? "pause" : "play"} size={50} color={"white"}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextButton} style={styles.controlButton}>
                <Ionicons name="play-forward" size={50} color={"white"}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
      {showMessage && <AddPlayerMessage />}
    </>
  );
};
  
const formatTime = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  removeIconContainer: {
    marginTop: Dimensions.get("window").width - 355,
  },
  imageContainer: {
    alignItems: 'center',
  },
  albumImage: {
    width: Dimensions.get("window").width - 80,
    height: Dimensions.get("window").width - 80,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  songInfoContainer: {
    marginTop: 20, 
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  songArtist: {
    fontSize: 20,
    fontWeight: "200",
    color: 'white',
    textAlign: 'center',
  },
  controls:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30
  },
  options:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  timers:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    width: Dimensions.get("window").width - 80,
    height: 4,
    backgroundColor: '#555555',
    borderRadius: 2,
    marginBottom: 15,
  },
  progress: {
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  controlButton: {
    margin: 30,
  },
});
