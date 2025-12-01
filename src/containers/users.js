import { useState ,useContext} from "react";
import axios from "axios";
import { ConstructionContext } from "../context/constructionContext";
import NewUser from "../components/users/newUser";
import bcrypt from "bcryptjs-react";

const Users = () => {
  const { user } = useContext(ConstructionContext);
  const [showNewUser, setShowNewUser] = useState("");

  const onSaveUser = async(name, userName, password) => {

    const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync("B4c0/\/", salt);
    const hash = bcrypt.hashSync(password, salt);
      console.log("password===",password)
    console.log("hash===",hash)

    const result = await axios.post(
        `${process.env.REACT_APP_SECURITY_URL_API}/create-user`,
        {
          userName,
          completeName: name,
          password:hash,
          user,
        }
      );

      setShowNewUser(false)
    // Load hash from your password DB.
      //  bcrypt.compareSync("B4c0/\/", hash); // true
       // bcrypt.compareSync("not_bacon", hash); // false
  };

  return (
    <div className="left">
      <br />
      <button
        className="primary"
        onClick={() => {
          setShowNewUser(true);
        }}
      >
        Agregar Usuario
      </button>
      {showNewUser && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <NewUser setShowNewUser={setShowNewUser} onSaveUser={onSaveUser} />
        </div>
      )}
    </div>
  );
};

export default Users;
