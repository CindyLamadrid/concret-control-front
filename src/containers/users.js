import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ConstructionContext } from "../context/constructionContext";
import NewUser from "../components/users/newUser";
import UserRoleAssignment from "../components/users/userRoleAssignment";
import bcrypt from "bcryptjs-react";

const Users = () => {
  const { user, role } = useContext(ConstructionContext);
  const [showNewUser, setShowNewUser] = useState(false);
  const [usersArray, setUsersArray] = useState([]);
  const [rolesArray, setRolesArray] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [constructions, setConstructions] = useState([]);
  const [userAssignments, setUserAssignments] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const getUsers = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/users`,
        { headers }
      );
      setUsersArray(result.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const getRoles = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/roles`,
        { headers }
      );
      setRolesArray(result.data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const getConstructions = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/constructions`,
        { headers }
      );
      setConstructions(result.data || []);
    } catch (err) {
      console.error("Error fetching constructions:", err);
    }
  };

  const getUserAssignments = async (idUser) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/user-constructions`,
        { headers, params: { idUser } }
      );
      setUserAssignments(result.data || []);
    } catch (err) {
      console.error("Error fetching user assignments:", err);
    }
  };

  useEffect(() => {
    getUsers();
    getRoles();
    getConstructions();
  }, []);

  const onSaveUser = async (name, userName, password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    try {
      await axios.post(
        `${process.env.REACT_APP_SECURITY_URL_API}/create-user`,
        { userName, completeName: name, password: hash, user },
        { headers }
      );
      setShowNewUser(false);
      setMessage("");
      await getUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      setMessage("Error al crear usuario");
    }
  };

  const onChangeRole = async (idUser, idRole) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SECURITY_URL_API}/update-user-role`,
        { idUser, idRole: parseInt(idRole), user },
        { headers }
      );
      await getUsers();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const onSelectUser = (usr) => {
    setSelectedUser(usr);
    getUserAssignments(usr.IdUser || usr.idUser);
  };

  const onAssignConstruction = async (idConstruction, idStage, accessType) => {
    const idUser = selectedUser.IdUser || selectedUser.idUser;
    try {
      await axios.post(
        `${process.env.REACT_APP_SECURITY_URL_API}/assign-construction`,
        { idUser, idConstruction, idStage: idStage || null, accessType },
        { headers }
      );
      await getUserAssignments(idUser);
    } catch (err) {
      console.error("Error assigning construction:", err);
    }
  };

  const onRemoveAssignment = async (idUserConstruction) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SECURITY_URL_API}/remove-construction`,
        { idUserConstruction },
        { headers }
      );
      const idUser = selectedUser.IdUser || selectedUser.idUser;
      await getUserAssignments(idUser);
    } catch (err) {
      console.error("Error removing assignment:", err);
    }
  };

  return (
    <div className="left">
      <br />
      <button className="primary" onClick={() => setShowNewUser(true)}>
        Agregar Usuario
      </button>

      {message && <div className="mandatory">{message}</div>}

      {showNewUser && (
        <div className="modal show" style={{ display: "block", position: "initial" }}>
          <NewUser setShowNewUser={setShowNewUser} onSaveUser={onSaveUser} />
        </div>
      )}

      {/* Lista de usuarios */}
      {usersArray.length > 0 && (
        <div>
          <div className="header-title">
            <span>USUARIOS</span>
            <span className="subheader-title">
              &nbsp;&nbsp;&nbsp;{usersArray.length} usuario(s)
            </span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersArray.map((u, idx) => (
                <tr key={idx}>
                  <td>{u.CompleteName || u.completeName}</td>
                  <td>{u.UserName || u.userName}</td>
                  <td>
                    <select
                      className="select"
                      value={u.IdRole || u.idRole || ""}
                      onChange={(e) => onChangeRole(u.IdUser || u.idUser, e.target.value)}
                    >
                      <option value="">Sin rol</option>
                      {rolesArray.map((r) => (
                        <option key={r.IdRole || r.idRole} value={r.IdRole || r.idRole}>
                          {r.Name || r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="secondary"
                      onClick={() => onSelectUser(u)}
                    >
                      <i className="fas fa-building" /> Asignar Obras
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Panel de asignación de obras */}
      {selectedUser && (
        <UserRoleAssignment
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          constructions={constructions}
          userAssignments={userAssignments}
          onAssignConstruction={onAssignConstruction}
          onRemoveAssignment={onRemoveAssignment}
        />
      )}
    </div>
  );
};

export default Users;
