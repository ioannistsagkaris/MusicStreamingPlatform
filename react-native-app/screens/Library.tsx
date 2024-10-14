import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, Image } from "react-native";
import { Text, View } from "../components/Theme";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import MusicPlayer from "./MusicPlayer";
import { Song, useSong } from "../SongContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import RemoveMessage from "./RemoveMessage";

export default function Library() {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [songs, setSongs] = useState<Song[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const { onPressSong, onGetLikedSongs, onToggleLike, contextSongsLibrary, loadingState } = useSong();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Account")}>
          <FontAwesome
            name="user-circle-o"
            size={25}
            color="#19bfb7"
            style={{ marginRight: 27 }}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    const getSongs = async () => {
      const token = (await AsyncStorage.getItem("accessToken") || "");
      await onGetLikedSongs!(setSongs, token);
    };
    getSongs();
  }, []);

  useEffect(() => {
    const getNewSongs = async () => {
      if (contextSongsLibrary?.songs)
        setSongs(contextSongsLibrary?.songs);
    };
    getNewSongs();
  }, [contextSongsLibrary?.songs]);

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
      <View style={styles.container}>
        <Spinner visible={loadingState?.isLoading} />
        <Text style={styles.heading}>Favorites</Text>
        <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          {songs.map((song, index) => (
            <TouchableOpacity
              key={index}
              style={styles.songContainer}
              onPress={() => onPressSong!(song, "Library")}
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
                  <Ionicons name="remove" size={30} color="#e5534b" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <MusicPlayer />
      {showMessage && <RemoveMessage />}
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
      marginBottom: 10,
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
      borderRadius: 15,
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
