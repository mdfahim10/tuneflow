
import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef(null);
    const seekBg = useRef(null);
    const seekBar = useRef(null);

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);

    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = (id) => {

        if (!songsData[id]) {
            console.error("Invalid song ID:", id);
            return;
        }

        setTrack(songsData[id]);
    };

    useEffect(() => {

        if (!audioRef.current) return;

        const audio = audioRef.current;

        const updateTime = () => {

            if (!audio.duration || !seekBar.current) return;

            seekBar.current.style.width =
                (Math.floor(
                    (audio.currentTime / audio.duration) * 100
                )) + "%";

            setTime({
                currentTime: {
                    second: Math.floor(audio.currentTime % 60),
                    minute: Math.floor(audio.currentTime / 60)
                },

                totalTime: {
                    second: Math.floor(audio.duration % 60),
                    minute: Math.floor(audio.duration / 60)
                }
            });
        };

        audio.addEventListener("timeupdate", updateTime);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
        };

    }, [track]);

    useEffect(() => {

        if (!audioRef.current || !track) return;

        audioRef.current
            .play()
            .then(() => {
                setPlayStatus(true);
            })
            .catch((error) => {
                console.log("Playback prevented:", error);
            });

    }, [track]);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,

        track,
        setTrack,

        playStatus,
        setPlayStatus,

        time,
        setTime,

        play,
        pause,
        playWithId
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
