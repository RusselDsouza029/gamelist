import React, { useEffect, useState } from "react";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { IconButton, Tooltip } from "@mui/material";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase/FirebaseConfig";
import { AuthUseContext } from "./context/AuthContext";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";

const SaveOrRemoveList = ({ gameId }) => {
  const { user } = AuthUseContext();

  // const [storeGameId, setStoreGameId] = useState([]);

  // let checkUID = user ? user.uid : 0;

  const strGameId = String(gameId);

  const checkUID = user ? user.uid : "0"; // Default to "0" if user is not available

  const gameUserIdCollection = collection(db, checkUID);

  const q = query(gameUserIdCollection, where("gameId", "==", strGameId));

  const [storeGameId, setStoreGameId] = useState({});

  // Function to add the game ID into Firebase
  const setGameIdIntoFirebase = async () => {
    await addDoc(gameUserIdCollection, { gameId: strGameId });
  };

  // Function to check if the game ID is available in Firebase
  const checkGameAvailableId = () => {
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setStoreGameId({ ...doc.data(), id: doc.id });
        // setCheckIdAvailableOrNot(true);
      });
    });
  };

  // Function to delete the game ID from Firebase
  const deleteGameInfoFirebase = async () => {
    await deleteDoc(doc(db, checkUID, storeGameId.id));
    // setCheckIdAvailableOrNot(false);
  };

  useEffect(() => {
    checkGameAvailableId();
    // eslint-disable-next-line
  }, [checkUID]);

  return (
    <>
      {/* {checkIdAvailableOrNot ? (
        <Tooltip title="Remove From List" arrow placeholder="bottom">
          <IconButton sx={{ color: "white" }} onClick={deleteGameInfoFirebase}>
            <PlaylistRemoveIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add In my List" arrow placeholder="bottom">
          <IconButton sx={{ color: "white" }} onClick={setGameIdIntoFirebase}>
            <PlaylistAddIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </>
  );
};

export default SaveOrRemoveList;
