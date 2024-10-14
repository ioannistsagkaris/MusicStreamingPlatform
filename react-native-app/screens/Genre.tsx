import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, StatusBar, useColorScheme, Image, ScrollView, TouchableOpacity } from "react-native";
import { View, Text } from "../components/Theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useLayoutEffect, useState } from "react";
import { Song, useSong } from "../SongContext";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddMessage from "./AddMessage";


export default function Genre({route}: any) {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const colorScheme = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "black" : "white";
    const statusBarStyle = colorScheme === "dark" ? "light-content" : "dark-content";
    const backButtonColor = colorScheme === "dark" ? "#202123" : "#f5f5f5";
    const styles = getStyles(colorScheme);
    const [songs, setSongs] = useState<Song[]>([]);
    const [showMessage, setShowMessage] = useState(false);
    const { onGetGenreSongs, onPressSong, onToggleLike, loadingState } = useSong();
    const {genre} = route.params;

    useLayoutEffect(() => {
      navigation.setOptions({
          title: genre,
          headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <View
                  style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  backgroundColor: backButtonColor,
                  }}
              >
                  <Ionicons name="arrow-back" size={24} color="#19bfb7" />
                  <Text style={{ fontSize: 20, color: "#19bfb7" }}> Back</Text>
              </View>
              </TouchableOpacity>
          ),
          });
    }, [navigation, colorScheme]);

    useEffect(() => {
      onGetGenreSongs!(setSongs, genre);
    }, []);

    const handleToggleLike = async (index: number, songs: Song[]) => {
      try {
        const token = (await AsyncStorage.getItem("accessToken")) || "";
        const idSong = songs[index].id;
  
        await onToggleLike!(token, idSong, index, songs);

        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      } catch (error) {
        console.error("Error handling like:", error);
      };
    };

    return (
      <>
        <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
        <View style={styles.container}>
          <Spinner visible={loadingState?.isLoading} />
          <ScrollView>
              {songs.map((song, index) => (
              <TouchableOpacity
                  key={index}
                  style={styles.songContainer}
                  onPress={() => onPressSong!(song, "Home")}
              >
                  <View style={styles.songInnerContainer}>
                  <Image
                      source={{ uri: `http://192.168.1.25:3000/media/${song.albums.image}` }}
                      style={styles.albumImage}
                      defaultSource={require("../assets/Songs/default.png")}
                      resizeMode="cover"
                  />
                  <View style={styles.songInfo}>
                      <Text style={styles.songTitle}>{song.name}</Text>
                      <Text style={styles.artist}>{song.artists.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleToggleLike(index, songs)}>
                    <Ionicons name="add" size={30} color="#19bfb7" />
                  </TouchableOpacity>
                  </View>
              </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
        {showMessage && <AddMessage />}
      </>
    );
}

const getStyles = (colorScheme: string | null | undefined) => {
  return StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
      },
      heading: {
        fontSize: 25,
        fontWeight: "bold",
        marginLeft: 5,
      },
      songContainer: {
        marginBottom: 5,
        marginEnd: 10,
        borderBottomWidth: 1,
        borderBottomColor: colorScheme === "light" ? "#f5f5f5" : "#202123",
      },
      songInnerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 5,
      },
      songTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
      },
      albumImage: {
        width: 60,
        height: 60,
        resizeMode: "cover",
        marginRight: 10,
        borderRadius: 20,
      },
      songInfo: {
        flex: 1,
        marginTop: 7,
      },
      artist: {
        fontSize: 14,
        fontWeight: "200",
      },
  });
};