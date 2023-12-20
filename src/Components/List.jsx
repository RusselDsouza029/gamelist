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
    if (user) {
      const gameListCollection = collection(db, user.uid);
      const data = await getDocs(gameListCollection);
      setFireData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [user?.uid]);

  return (
    <Box>
      {user ? (
        <>
          {fireData.length > 0 ? (
            fireData.map((data) => (
              <Box key={data.id} className="div-list-container">
                <ListBoxContainer gameId={data.gameId} id={data.id} getData={getData} />
              </Box>
            ))
          ) : (
            <Box className="div-list-no-games-added">
              <Box>
                No games added in list
                <br />
                To add games in the list click on <PlaylistAddIcon /> icon
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box className="div-list-no-games-added">
          <Box>Sign in with Google to view the list or add games to the list</Box>
        </Box>
      )}
    </Box>
  );
};

export default List;
