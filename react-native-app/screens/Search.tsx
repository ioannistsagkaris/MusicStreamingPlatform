import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { View, Text } from "../components/Theme";
import { useLayoutEffect, useRef, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Song, useSong } from "../SongContext";
import MusicPlayer from "./MusicPlayer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddMessage from "./AddMessage";

export default function Search() {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [showMessage, setShowMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const widthAnimation = useRef(
    new Animated.Value(Dimensions.get("window").width),
  ).current;
  const [songs, setSongs] = useState<Song[]>([]);
  const { onGetSearchSongs, onPressSong, onToggleLike } = useSong();

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

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(widthAnimation, {
      toValue: Dimensions.get("window").width - 70,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleOutofFocus = () => {
    setIsFocused(false);
    Animated.timing(widthAnimation, {
      toValue: Dimensions.get("window").width,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleCancel = () => {
    setIsFocused(false);
    setSearchQuery("");
    setSongs([]);
    handleOutofFocus();
    inputRef.current?.blur();
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim() !== "") {
      await onGetSearchSongs!(setSongs, text);
    } else {
      setSongs([]);
    }
  };

  const handleGenre = (genre: string) => {
    navigation.navigate("Genre", {genre: genre});
  };

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
        <Animated.View
          style={[styles.secondContainer, { width: widthAnimation }]}
        >
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="gray" style={styles.icon} />
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Artists, Albums, Songs"
              placeholderTextColor="gray"
              onChangeText={handleSearch}
              onFocus={handleFocus}
              value={searchQuery}
            />
          </View>
          {isFocused && (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton} activeOpacity={0.3}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
        {isFocused ?
          <View style={styles.container}>
            <ScrollView contentContainerStyle={{paddingBottom: 60}}>
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
          :
          <View style={styles.browseContainer}>
            <Text style={styles.header}>Browse</Text>
            <View style={styles.buttonFlex}>
              <TouchableOpacity onPress={() => handleGenre("Ost")} style={styles.button1}>
                <Text style={styles.buttonText}>Ost</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleGenre("Rock")} style={styles.button2}>
                <Text style={styles.buttonText}>Rock</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonFlex}>
              <TouchableOpacity onPress={() => handleGenre("Metal")} style={styles.button3}>
                <Text style={styles.buttonText}>Metal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleGenre("Jazz")} style={styles.button4}>
                <Text style={styles.buttonText}>Jazz</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonFlex}>
              <TouchableOpacity onPress={() => handleGenre("Classic")} style={styles.button5}>
                <Text style={styles.buttonText}>Classic</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleGenre("Blues")} style={styles.button6}>
                <Text style={styles.buttonText}>Blues</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonFlex}>
              <TouchableOpacity onPress={() => handleGenre("Pop")} style={styles.button7}>
                <Text style={styles.buttonText}>Pop</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleGenre("Country")} style={styles.button8}>
                <Text style={styles.buttonText}>Country</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonFlex}>
              <TouchableOpacity onPress={() => handleGenre("Rap")} style={styles.button9}>
                <Text style={styles.buttonText}>Hip-Hop / Rap</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
      <MusicPlayer />
      {showMessage && <AddMessage />}
    </>
  );
}

const getStyles = (colorScheme: string | null | undefined) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    secondContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginVertical: 5,
      height: 45,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      paddingHorizontal: 10,
      backgroundColor: colorScheme === "light" ? "#e4e6eb" : "#404040",
      width: "100%",
      height: "100%",
    },
    input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: colorScheme === "light" ? "black" : "white",
    },
    icon: {
      marginRight: 10,
    },
    cancelButton: {
      marginLeft: 10,
    },
    cancelText: {
      fontSize: 18,
      color: "#19bfb7",
    },
    browseContainer: {
      marginBottom: 20,
    },
    header: {
      fontSize: 30,
      fontWeight: "bold",
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      color: colorScheme === "light" ? "black" : "white",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
    buttonFlex: {
      flexDirection: "row",
      marginBottom: 7,
    },
    button1: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#e2ae03",
      width: Dimensions.get("window").width / 2 - 10,
      height: 70,
      marginHorizontal: 5,
    },
    button2: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#ea522c",
      width: Dimensions.get("window").width / 2 - 10,
      height: 70,
      marginHorizontal: 5,
    },
    button3: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#ec333c",
      alignSelf: "stretch",
      width: Dimensions.get("window").width / 2 - 10,
      height: 70,
      marginHorizontal: 5,
    },
    button4: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#059635",
      alignSelf: "stretch",
      width: Dimensions.get("window").width / 2 - 10,
      height: 70,
      marginHorizontal: 5,
    },
    button5: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#85429f",
      alignSelf: "stretch",
      width: Dimensions.get("window").width / 2 - 10,
      height: 70,
      marginHorizontal: 5,
    },
    button6: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#2a0f8c",
      alignSelf: "stretch",
      width: Dimensions.get("window").width / 2 - 10,
      height: 70,
      marginHorizontal: 5,
    },
    button7: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#f44d80",
      alignSelf: "stretch",
      width: Dimensions.get("window").width / 2 - 10,
      height: 70,
      marginHorizontal: 5,
    },
    button8: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#702906",
      alignSelf: "stretch",
      width: Dimensions.get("window").width / 2 - 10,
      height: 70,
      marginHorizontal: 5,
    },
    button9: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: "#5782ee",
      alignSelf: "stretch",
      width: Dimensions.get("window").width - 10,
      height: 70,
      marginHorizontal: 5,
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
