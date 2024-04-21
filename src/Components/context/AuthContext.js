import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/FirebaseConfig";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { BsGrid3X2Gap, BsViewList } from "react-icons/bs";
import { Box } from "@mui/material";

const userAuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    let apiKey = process.env.REACT_APP_GAMELIST_API_KEY
    let API_URL = `https://api.rawg.io/api/games?key=${apiKey}`
    const [user, setUser] = useState({});
    function logOut() {
        return signOut(auth);
    }
    function googleSignIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn();
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const [divGamesItems, setDivGamesItems] = useState("div-item-games");

    const [divGameImg, setDivGameImg] = useState("div-game-img")

    const [colorBtnGrid1, setColorBtnGrid1] = useState("#5f5f5f");

    const [colorBtnGrid2, setColorBtnGrid2] = useState("white");

    const [changeGrid, setChangeGrid] = useState("auto");

    const [changeGridWidth, setChangeGridWidth] = useState("300px");

    const [changeImagePosterHeight, setChangeImagePosterHeight] = useState("180px !important");

    const [changeWidth, setChangeWidth] = useState("auto");

    const HandleDisplayGrid = () => {

        let tabMedia = window.matchMedia("(max-width: 800px)")
        const handleChangeGridSmallToLargeScreen = () => {
            setDivGamesItems("div-item-games");
            setDivGameImg("div-game-img");
            setColorBtnGrid1("#5f5f5f");
            setColorBtnGrid2("white");
            // if (tabMedia.matches) {
            setChangeGrid("auto");
            setChangeGridWidth("300px")
            setChangeWidth("auto");
            setChangeImagePosterHeight("180px !important");
            // }
            // else{
            //     setChangeGrid(6);
            //     setChangeGridWidth("300px")
            // }
        }

        const handleChangeGridLargeToSmallScreen = () => {
            if (tabMedia.matches) {
                setDivGamesItems("div-item-games");
                setDivGameImg("div-game-img");
                setChangeGrid("auto");
                setChangeGridWidth("300px")
                setChangeWidth("auto")
                setChangeImagePosterHeight("auto !important");
            } else {
                setDivGamesItems("div-item-games btn-click-change-grid-div-games-items");
                setDivGameImg("div-game-img btn-click-change-grid-div-games-img");
                setColorBtnGrid1("white");
                setColorBtnGrid2("#5f5f5f");
                setChangeGrid(12);
                setChangeGridWidth("50%")
                setChangeWidth("100%")
            }
        }

        useEffect(() => {
            if (tabMedia.matches) {
                setChangeGrid("auto");
                setChangeGridWidth("300px")
            }
            // eslint-disable-next-line
        }, [])

        return (
            <>
                <div className="div-display-grid">
                    <span className="span-grid-text">Display Option: </span>
                    <Box className="div-grid-parent">
                        <Box
                            style={{
                                color: colorBtnGrid1,
                            }}
                            className="div-grid-1"
                            onClick={handleChangeGridSmallToLargeScreen}
                        >
                            <BsGrid3X2Gap />
                        </Box>
                        <Box
                            style={{
                                color: colorBtnGrid2,
                            }}
                            className="div-grid-2"
                            onClick={handleChangeGridLargeToSmallScreen}
                        >
                            <BsViewList />
                        </Box>
                    </Box>
                </div>
            </>
        )
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            setUser(currentuser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <userAuthContext.Provider
            value={{
                user,
                apiKey,
                API_URL,
                divGameImg,
                divGamesItems,
                logOut,
                handleGoogleSignIn,
                HandleDisplayGrid,
                changeGrid,
                changeGridWidth,
                changeWidth,
                changeImagePosterHeight,
            }}
        >
            {children}
        </userAuthContext.Provider>
    );
}

export function AuthUseContext() {
    return useContext(userAuthContext);
}