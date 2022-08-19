import "./App.css";
import { db } from "./firebase-config";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [updateUi, setUpdateUi] = useState(true);

  const createUser = async () => {
    await addDoc(usersCollectionRef, {
      name: newName,
      age: parseInt(newAge),
    });
    setNewName("");
    setNewAge("");
    setUpdateUi(!updateUi);
  };

  const updateUser = async (id, age) => {
    const newFields = { age: parseInt(age) + 1 };
    await updateDoc(doc(db, "users", id), newFields);
    setUpdateUi(!updateUi);
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setUpdateUi(!updateUi);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      // console.log(data.docs[0].data(), data.docs[0].id, data);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, [updateUi]);

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Name..."
        value={newName}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
      />
      <input
        type="number"
        placeholder="Age..."
        value={newAge}
        onChange={(e) => {
          setNewAge(e.target.value);
        }}
      />
      <button onClick={createUser}>Create User</button>
      {users.map((user) => (
        <div key={user.id}>
          {/* id: {user.id} <br /> */}
          <div>name: {user.name} </div>
          <div>
            age: {user.age}
            <button
              onClick={() => {
                updateUser(user.id, user.age);
              }}
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              deleteUser(user.id);
            }}
          >
            Delete User
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
