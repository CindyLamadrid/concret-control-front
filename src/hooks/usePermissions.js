import { useContext } from "react";
import { ConstructionContext } from "../context/constructionContext";

/**
 * Hook personalizado para verificar permisos del usuario.
 * Uso: const { canEdit, hasPermission } = usePermissions("budget");
 */
const usePermissions = (module) => {
  const { role, permissions, userConstructions, stageSelected, constructionSelected } =
    useContext(ConstructionContext);

  const isAdmin = role && role.isAdmin;

  const hasPermission = (mod) => {
    if (isAdmin) return true;
    if (!permissions || !Array.isArray(permissions)) return false;
    return permissions.some((p) => (p.Module || p.module) === mod);
  };

  const canEdit = (() => {
    if (isAdmin) return true;
    if (!permissions || !Array.isArray(permissions)) return false;

    // Verificar permiso "full" del módulo
    const hasFull = permissions.some(
      (p) => (p.Module || p.module) === module && (p.Action || p.action) === "full"
    );
    if (!hasFull) return false;

    // Verificar AccessType en la obra/etapa actual
    if (!userConstructions || userConstructions.length === 0) return false;

    const currentConstruction = constructionSelected && constructionSelected.idConstruction;
    const currentStage = stageSelected && stageSelected.idStage;

    if (!currentConstruction) return hasFull; // sin obra seleccionada, depende solo del permiso del módulo

    const assignment = userConstructions.find(
      (uc) =>
        (uc.IdConstruction || uc.idConstruction) === currentConstruction &&
        ((uc.IdStage || uc.idStage) === currentStage || (uc.IdStage || uc.idStage) === null)
    );

    if (!assignment) return false;
    return (assignment.AccessType || assignment.accessType) === "full";
  })();

  return { canEdit, hasPermission, isAdmin };
};

export default usePermissions;
