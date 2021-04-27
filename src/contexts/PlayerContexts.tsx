import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setepisodeList] = useState([]);
    const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setepisodeList([episode])
        setcurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setepisodeList(list);
        setcurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }


    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState() {
        setepisodeList([]);
        setcurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;

    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setcurrentEpisodeIndex(nextRandomEpisodeIndex);
        }
        else if (hasNext) {
            setcurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {

        if (hasPrevious) {
            setcurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            playList,
            playNext,
            playPrevious,
            isPlaying,
            isLooping,
            isShuffling,
            togglePlay,
            setPlayingState,
            hasNext,
            hasPrevious,
            toggleLoop,
            toggleShuffle,
            clearPlayerState
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}
