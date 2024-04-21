import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { AuthUseContext } from "./context/AuthContext";
import { db } from "./firebase/FirebaseConfig";
import { Box } from "@mui/material";
import ListBoxContainer from "./ListBoxContainer";
import "./styles/List.css";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

const List = () => {
  const { user } = AuthUseContext();

  const [fireData, setFireData] = useState([]);

  async function getData() {
    setFireData([]);
    const gameListCollection = collection(db, `${user ? user.uid : 0}`);
    const data = await getDocs(gameListCollection);
    setFireData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [user ? user.uid : null]);
  return (
    <Box>
      {user ? (
        <>
          {fireData[0] ? (
            <>
              {fireData.map((data, index) => (
                <Box key={index} className="div-list-container">
                  <ListBoxContainer
                    gameId={data.gameId}
                    id={data.id}
                    getData={getData}
                  />
                </Box>
              ))}
            </>
          ) : (
            <Box className="div-list-no-games-added">
              <Box>
                No games added in list
                <br />
                To add games in list click on <PlaylistAddIcon /> icon
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box className="div-list-no-games-added">
          <Box>Signin with Google to view list or to add games in list</Box>
        </Box>
      )}
    </Box>
  );
};

export default List;
