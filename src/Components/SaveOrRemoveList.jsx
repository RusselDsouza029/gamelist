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

  const [storeGameId, setStoreGameId] = useState([]);

  let checkUID = user ? user.uid : 0;

  const strGameId = String(gameId);

  const [checkIdAvailableOrNot, setCheckIdAvailableOrNot] = useState(false);

  async function setGameIdIntoFirebase() {
    const gameUserIdCollection = collection(db, `${user ? user.uid : 0}`);
    await addDoc(gameUserIdCollection, { gameId: strGameId });
  }

  const q = query(
    collection(db, `${checkUID}`),
    where("gameId", "==", strGameId)
  );

  async function checkGameAvailableId() {
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setStoreGameId({ ...doc.data(), id: doc.id });
        if (doc.id) {
          setCheckIdAvailableOrNot(true);
        }
      });
    });
  }

  async function deleteGameInfoFirebase() {
    await deleteDoc(doc(db, user.uid, storeGameId.id));
    checkGameAvailableId();
    setCheckIdAvailableOrNot(false);
  }

  useEffect(() => {
    checkGameAvailableId();
    // eslint-disable-next-line
  }, [checkUID]);

  return (
    <>
      {checkIdAvailableOrNot ? (
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
      )}
    </>
  );
};

export default SaveOrRemoveList;
