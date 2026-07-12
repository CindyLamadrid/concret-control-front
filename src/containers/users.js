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
  const [searchText, setSearchText] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const searchUsers = async () => {
    if (!searchText || searchText.trim().length < 2) {
      setUsersArray([]);
      return;
    }
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/search-users`,
        { headers, params: { search: searchText } }
      );
      setUsersArray(result.data || []);
    } catch (err) {
      console.error("Error searching users:", err);
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
    getRoles();
    getConstructions();
  }, []);

  const onSaveUser = async (name, userName, password, idCompany, idRole) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    try {
      await axios.post(
        `${process.env.REACT_APP_SECURITY_URL_API}/create-user`,
        { userName, completeName: name, password: hash, user, idCompany, idRole },
        { headers }
      );
      setShowNewUser(false);
      setMessage("");
      if (searchText.length >= 2) searchUsers();
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
      searchUsers();
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

  const onKeyDown = (e) => {
    if (e.key === "Enter") searchUsers();
  };

  return (
    <div className="left">
      <br />
      <div className="header-title">
        <span>LISTADO DE USUARIOS</span>
        <span className="subheader-title">&nbsp;&nbsp;&nbsp;{usersArray.length} usuario(s)</span>
      </div>
      <div className="row" style={{ marginBottom: "15px" }}>
        <div className="col-4">
          <input
            className="input w-100"
            type="text"
            placeholder="Nombre o usuario..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="col-6">
          <button className="primary" onClick={searchUsers}>
            <i className="fas fa-search" /> Buscar
          </button>
          &nbsp;&nbsp;
          <button className="secondary" onClick={() => setShowNewUser(true)}>
            <i className="fas fa-plus" /> Crear Nuevo Usuario
          </button>
        </div>
      </div>

      {message && <div className="mandatory">{message}</div>}

      {showNewUser && (
        <div className="modal show" style={{ display: "block", position: "initial" }}>
          <NewUser setShowNewUser={setShowNewUser} onSaveUser={onSaveUser} />
        </div>
      )}

      {/* Resultado */}
      {usersArray.length > 0 && (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Empresa</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersArray.map((u, idx) => (
                <tr key={idx}>
                  <td className={idx % 2 === 0 ? "dark" : ""}>{u.CompleteName || u.completeName}</td>
                  <td className={idx % 2 === 0 ? "dark" : ""}>{u.UserName || u.userName}</td>
                  <td className={idx % 2 === 0 ? "dark" : ""}>{u.CompanyName || u.companyName || "Sin empresa"}</td>
                  <td className={idx % 2 === 0 ? "dark" : ""}>
                    <select
                      className="select"
                      value={u.IdRole || u.idRole || ""}
                      onChange={(e) => onChangeRole(u.IdUser || u.idUser, e.target.value)}
                    >
                      {rolesArray.map((r) => (
                        <option key={r.IdRole || r.idRole} value={r.IdRole || r.idRole}>
                          {r.Name || r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={idx % 2 === 0 ? "dark center" : "center"}>
                    <button className="secondary" onClick={() => onSelectUser(u)}>
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
