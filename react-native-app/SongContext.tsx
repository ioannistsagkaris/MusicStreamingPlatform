import axios from "axios";
import { Audio, InterruptionModeIOS } from "expo-av";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export interface Song {
    id: string;
    name: string;
    track: string;
    albums: {
      name: string;
      image: string;
    };
    artists: {
      name: string;
      image: string;
    };
}

interface SongsProps {
    contextSongsHome?: {songs: Song[]};
    contextSongsLibrary?: {songs: Song[]}
    soundState?: {sound: Audio.Sound | null};
    isPlaying?: {play: boolean};
    isLooping?: {loop: boolean};
    loadingState?: {isLoading: boolean};
    onCurrentSong?: {currentSong: Song | null};
    onGetSongs?: (setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => Promise<any>;
    onGetLikedSongs?: (setSongs: React.Dispatch<React.SetStateAction<Song[]>>, query: string) => Promise<any>;
    onGetSearchSongs?: (setSongs: React.Dispatch<React.SetStateAction<Song[]>>, query: string) => Promise<any>;
    onGetGenreSongs?: (setSongs: React.Dispatch<React.SetStateAction<Song[]>>, genre: string) => Promise<any>;
    onPlay?: (songPath: string) => Promise<any>;
    onStop?: () => Promise<any>;
    onPressSong?: (song: Song, screen: string) => Promise<any>;
    onTogglePlay?: () => Promise<any>;
    onPreviousButton?: () => Promise<any>;
    onNextButton?: () => Promise<any>;
    onToggleLoop?: () => Promise<any>;
    onToggleLike?: (token: string, idSong: string, index: number, songs: Song[]) => Promise<any>;
    onHandlePlayerToggleLike?: (token: string, idSong: string) => Promise<any>;
    positionMillis: number;
    durationMillis: number;
}

export const URL_SONG = "http://192.168.1.5:3000/song/getSongs";
export const URL_LIKEDSONG = "http://192.168.1.5:3000/auth/getLikedSongs";
export const URL_SEARCH = "http://192.168.1.5:3000/song/getSearchSongs";
export const URL_GENRE = "http://192.168.1.5:3000/song/getGenreSongs";

const SongContext = createContext<SongsProps>({
    positionMillis: 0,
    durationMillis: 0,
});
export const useSong = () => {
    return useContext(SongContext);
};



export const SongProvider = ({ children }: any) => {
    const { onAddLikedSong, onRemoveLikedSong } = useAuth();
    const [contextSongsHome, setContextSongsHome] = useState<{
        songs: Song[];
    }>({
        songs: [],
    });
    const [contextSongsLibrary, setContextSongsLibrary] = useState<{
        songs: Song[];
    }>({
        songs: [],
    });
    const [screen, setScreen] = useState<{
        screen: string;
    }>({
        screen: "Home",
    });
    const [soundState, setSoundState] = useState<{
        sound: Audio.Sound | null;
    }>({
        sound: null,
    });
    const [onCurrentSong, setOnCurrentSong] = useState<{
        currentSong: Song | null;
    }>({
        currentSong: null,
    });
    const [isPlaying, setIsPlaying] = useState<{
        play: boolean;
    }>({
        play: false,
    });
    const [isLooping, setIsLooping ] = useState<{
        loop: boolean;
    }>({
        loop: false,
    });
    const [loadingState, setLoadingState] = useState<{
        isLoading: boolean;
    }>({
        isLoading: false,
    });
    const [positionMillis, setPositionMillis] = useState(0);
    const [durationMillis, setDurationMillis] = useState(0);

    const getSongs = async (setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
        try {
            setLoadingState({
                isLoading: true,
            });

            const response = await axios.get<Song[]>(`${URL_SONG}`);

            setContextSongsHome({
                songs: response.data,
            });

            setSongs(response.data);

            setLoadingState({
                isLoading: false,
            });
        } catch (error) {
            setLoadingState({
                isLoading: false,
            });

            console.error("Error fetching songs:", error);
        }
    };

    const getLikedSongs = async (setSongs: React.Dispatch<React.SetStateAction<Song[]>>, query: string) => {
        try {
            setLoadingState({
                isLoading: true,
            });

            const response = await axios.get<Song[]>(`${URL_LIKEDSONG}?query=${encodeURIComponent(query)}`);

            setContextSongsLibrary({
                songs: response.data,
            });

            setSongs(response.data);

            setLoadingState({
                isLoading: false,
            });
        } catch (error) {
            setLoadingState({
                isLoading: false,
            });

            console.error("Error fetching songs:", error);
        }
    };

    const getSearchSongs = async (setSongs: React.Dispatch<React.SetStateAction<Song[]>>, query: string) => {
        try {
            setLoadingState({
                isLoading: true,
            });

            const response = await axios.get<Song[]>(`${URL_SEARCH}?query=${encodeURIComponent(query)}`);

            setSongs(response.data);

            setLoadingState({
                isLoading: false,
            });
        } catch (error) {
            setLoadingState({
                isLoading: false,
            });

            console.error("Error fetching songs:", error);
        }
    };

    const getGenreSongs = async (setSongs: React.Dispatch<React.SetStateAction<Song[]>>, genre: string) => {
        try {
            setLoadingState({
                isLoading: true,
            });

            const response = await axios.get<Song[]>(`${URL_GENRE}?query=${encodeURIComponent(genre)}`);

            setSongs(response.data);

            setLoadingState({
                isLoading: false,
            });
        } catch (error) {
            setLoadingState({
                isLoading: false,
            });

            console.error("Error fetching songs:", error);
        }
    };

    const stopSong = async () => {
        if (soundState?.sound) {
            await soundState?.sound.unloadAsync();

            setOnCurrentSong({
                currentSong: null,
            });

            setIsPlaying({
                play: false,
            });

            setPositionMillis(0);
            setDurationMillis(0);
        }
    };

    const playSong = async (songPath: string) => {
        if (soundState?.sound) {
            await soundState?.sound.unloadAsync();
        }
        try {
            await Audio.setAudioModeAsync({
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            });

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: `http://192.168.1.5:3000/media/${songPath}` },
                { shouldPlay: true, isLooping: isLooping?.loop, shouldCorrectPitch: true },
            );

            setSoundState({
                sound: newSound,
            });
        } catch (error) {
            console.error("Error playing song:", error);
        }
    };

    const handlePlaySong = async (song: Song, screen: string) => {
        if (onCurrentSong?.currentSong === null || onCurrentSong?.currentSong.name !== song.name || onCurrentSong?.currentSong.name === song.name) {
            setOnCurrentSong({
                currentSong: song,
            });
            
            await playSong(song.track);

            setIsPlaying({
                play: true,
            });

            setScreen({
                screen: screen,
            });
        } else {
            setIsPlaying({
                play: false,
            });
        }
    };

    const handleTogglePlay = async () => {
        if (onCurrentSong?.currentSong) {
            if (soundState?.sound) {
                if (isPlaying?.play) {
                    await soundState?.sound.pauseAsync();

                    setIsPlaying({
                        play: false,
                    });
                } else {
                    await soundState?.sound.playAsync();

                    setIsPlaying({
                        play: true,
                    });
                }
            }
        }
    };

    const handlePreviousSong = async () => {
        if (onCurrentSong?.currentSong) {
            if (screen.screen === "Home") {
                const currentIndex = contextSongsHome?.songs.findIndex(song => song.name === onCurrentSong?.currentSong?.name);
                const previousIndex = (currentIndex - 1 + contextSongsHome?.songs.length) % contextSongsHome?.songs.length;
                const previousSong = contextSongsHome?.songs[previousIndex];

                setOnCurrentSong({
                    currentSong: previousSong,
                });
    
                await playSong(previousSong.track);
                setIsPlaying({
                    play: true,
                });
            } else if (screen.screen === "Library") {
                const currentIndex = contextSongsLibrary?.songs.findIndex(song => song.name === onCurrentSong?.currentSong?.name);
                const previousIndex = (currentIndex - 1 + contextSongsLibrary?.songs.length) % contextSongsLibrary?.songs.length;
                const previousSong = contextSongsLibrary?.songs[previousIndex];

                setOnCurrentSong({
                    currentSong: previousSong,
                });
    
                await playSong(previousSong.track);
                setIsPlaying({
                    play: true,
                });
            }
        } else {
            setIsPlaying({
                play: false,
            });
        }
    };

    const handleNextSong = async () => {
        if (onCurrentSong?.currentSong) {
            if (screen.screen === "Home") {
                const currentIndex = contextSongsHome?.songs.findIndex(song => song.name === onCurrentSong?.currentSong?.name);
                const nextIndex = (currentIndex + 1) % contextSongsHome?.songs.length;
                const nextSong = contextSongsHome?.songs[nextIndex];

                setOnCurrentSong({
                    currentSong: nextSong,
                });

                await playSong(nextSong.track);
                setIsPlaying({
                    play: true,
                });
            } else if (screen.screen === "Library") {
                const currentIndex = contextSongsLibrary?.songs.findIndex(song => song.name === onCurrentSong?.currentSong?.name);
                const nextIndex = (currentIndex + 1) % contextSongsLibrary?.songs.length;
                const nextSong = contextSongsLibrary?.songs[nextIndex];

                setOnCurrentSong({
                    currentSong: nextSong,
                });

                await playSong(nextSong.track);
                setIsPlaying({
                    play: true,
                });
            }
        } else {
            setIsPlaying({
                play: false,
            });
        }
    };

    const handleToggleLoop = async () => {
        if (!isLooping?.loop) {
            setIsLooping({
                loop: true,
            }); 
        } else {
            setIsLooping({
                loop: false,
            });
        }
    };

    const handleToggleLike = async (token: string, idSong: string, index: number, songs: Song[]) => {
        if (contextSongsLibrary?.songs.includes(songs[index])) {
            try {
                await onRemoveLikedSong!(token, idSong);
    
                const response = await axios.get<Song[]>(`${URL_LIKEDSONG}?query=${encodeURIComponent(token)}`);
    
                setContextSongsLibrary({
                    songs: response.data,
                });
            } catch (error) {
                console.error("Error removing favorite song:", error);
            }
        } else {
            try {
                await onAddLikedSong!(token, idSong);
    
                const response = await axios.get<Song[]>(`${URL_LIKEDSONG}?query=${encodeURIComponent(token)}`);
    
                setContextSongsLibrary({
                    songs: response.data,
                });
            } catch (error) {
                console.error("Error adding favorite song:", error);
            }
        }
    };

    const handlePlayerToggleLike = async (token: string, idSong: string) => {
        try {
            await onAddLikedSong!(token, idSong);

            const response = await axios.get<Song[]>(`${URL_LIKEDSONG}?query=${encodeURIComponent(token)}`);

            setContextSongsLibrary({
                songs: response.data,
            });
        } catch (error) {
            console.error("Error adding favorite song from player:", error);
        }
    };

    useEffect(() => {
        if (soundState?.sound) {
            soundState?.sound.setIsLoopingAsync(isLooping?.loop);
            soundState?.sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.isLoaded && status.positionMillis && status.durationMillis) {
                    const position = status.positionMillis;
                    const duration = status.durationMillis;
                    setDurationMillis(duration);
                    setPositionMillis(position);
                    if ((position >= duration - 1000) && (!isLooping?.loop)) {
                        await handleNextSong();
                    }
                }
            });
        }
    }, [soundState?.sound, isLooping?.loop]);

    const value = {
        onGetSongs: getSongs,
        onGetLikedSongs: getLikedSongs,
        onGetSearchSongs: getSearchSongs,
        onGetGenreSongs: getGenreSongs,
        onPlay: playSong,
        onStop: stopSong,
        onPressSong: handlePlaySong,
        onTogglePlay: handleTogglePlay,
        onPreviousButton: handlePreviousSong,
        onNextButton: handleNextSong,
        onToggleLoop: handleToggleLoop,
        onToggleLike: handleToggleLike,
        onHandlePlayerToggleLike: handlePlayerToggleLike,
        contextSongsLibrary,
        soundState,
        loadingState,
        onCurrentSong,
        isPlaying,
        isLooping,
        positionMillis,
        durationMillis,
    };
    
    return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
};
