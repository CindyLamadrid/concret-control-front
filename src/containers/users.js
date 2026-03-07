import { useState ,useContext} from "react";
import axios from "../config/axiosConfig";
import { ConstructionContext } from "../context/constructionContext";
import NewUser from "../components/users/newUser";
import bcrypt from "bcryptjs-react";

const Users = () => {
  const { user } = useContext(ConstructionContext);
  const [showNewUser, setShowNewUser] = useState("");

  const onSaveUser = async(name, userName, password) => {

    const salt = bcrypt.genSaltSync(10);
   
    const hash = bcrypt.hashSync(password, salt);

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
