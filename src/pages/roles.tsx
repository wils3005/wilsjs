import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  useIonModal,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import { FC, useState, useContext } from "react";

import "./roles.css";
import { Sidebar } from "../components";
import { Alert as AlertDisplay } from "../components/alert";
import { AlertContext, Alert } from "../context/alert-context";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../crud";
import { pageManifest } from "../page-manifest";
import type { RoleResource } from "../schemas";

type UpdateModalBodyProps = {
  selectedRole: RoleResource;
  onDismiss: () => void;
  onSubmit: (id: string, role: string) => void;
};

const UpdateModalBody: FC<UpdateModalBodyProps> = ({
  selectedRole,
  onDismiss,
  onSubmit,
}) => {
  const [roleName, setRoleName] = useState(selectedRole.name);

  return (
    <div>
      <form className="updateForm">
        <IonItem>
          <IonLabel>ID: {selectedRole.id}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Role Name: </IonLabel>
          <IonInput
            value={roleName}
            onIonChange={({ target }) =>
              setRoleName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>
      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(selectedRole.id, roleName)}
      >
        Update Values
      </IonButton>
      <IonButton className="closeButton" expand="block" onClick={onDismiss}>
        Close
      </IonButton>
    </div>
  );
};

type CreateModalBodyProps = {
  onDismiss: () => void;
  onSubmit: (id: string, role: string) => void;
};

const CreateModalBody: FC<CreateModalBodyProps> = ({ onDismiss, onSubmit }) => {
  const [roleName, setRoleName] = useState("");
  const [id, setId] = useState("");

  return (
    <div>
      <form className="updateForm">
        <IonItem>
          <IonLabel>ID: {}</IonLabel>
          <IonInput
            type="number"
            value={id}
            onIonChange={({ target }) =>
              setId((target as HTMLInputElement).value)
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel>Role Name: </IonLabel>
          <IonInput
            type="number"
            value={roleName}
            onIonChange={({ target }) =>
              setRoleName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>
      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(id, roleName)}
      >
        Create
      </IonButton>
      <IonButton className="closeButton" expand="block" onClick={onDismiss}>
        Close
      </IonButton>
    </div>
  );
};

export const Roles: FC = () => {
  const { dispatch } = useContext(AlertContext);
  const [sidebar, setSidebar] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleResource>();

  const [page, setPage] = useState(1);
  const [roleIdFilter, setRoleIdFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [roleArr, setRoleArr] = useState<RoleResource[]>([]);

  const searchRoles = async () => {
    setPage(1);

    setRoleArr(
      await getRecords("/roles", {
        roleId: roleIdFilter,
        roleName: roleFilter,
        pageNum: page,
      })
    );
  };

  const incrementPage = () => setPage(page + 1);
  const decrementPage = () => setPage(page - 1);
  const handleCreateDismiss = () => dismissCreate();

  const handleUpdate = async (role: RoleResource) => {
    const response: Alert = await updateRecord("/roles", role);
    dispatch?.({
      type: "ADD_ALERT",
      payload: response,
    });
    dismiss();
  };

  const handleCreate = async (role: RoleResource) => {
    const response: Alert = await createRecord("/roles", role);
    dispatch?.({
      type: "ADD_ALERT",
      payload: response,
    });
    handleCreateDismiss();
  };

  const [presentUpdate, dismiss] = useIonModal(UpdateModalBody, {
    selectedRole,
    onDismiss: () => dismiss(),
    onSubmit: handleUpdate,
  });

  const [presentCreate, dismissCreate] = useIonModal(CreateModalBody, {
    onDismiss: handleCreateDismiss,
    onSubmit: handleCreate,
  });

  const presentCreateModal = () => {
    presentCreate({ cssClass: "modal" });
  };

  const presentUpdateModal = (roleInstance: RoleResource) => {
    setSelectedRole(roleInstance);
    presentUpdate({ cssClass: "modal" });
  };

  const tableRows = roleArr.map((element, i) => {
    return (
      <tr className="resultRow" key={i}>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.id}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.id}
        </th>
        <th>
          <IonButton
            className="deleteButton"
            onClick={() => deleteRecord("/roles", element.id)}
            color="danger"
          >
            Delete
          </IonButton>
        </th>
      </tr>
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Roles</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton
              onClick={() => setSidebar(!sidebar)}
              autoHide={false}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-text-center" fullscreen>
        {sidebar ? <Sidebar pageManifest={pageManifest} /> : null}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Roles</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>
          <AlertDisplay />
          <table className="rolesTable">
            <thead>
              <tr>
                <th>Role ID</th>
                <th>Role Name</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
          <IonButton className="pageButton" onClick={decrementPage}>
            Prev.
          </IonButton>
          <p>Page: {page}</p>
          <IonButton className="pageButton" onClick={incrementPage}>
            Next
          </IonButton>
          <form className="filterForm">
            <IonItem className="searchField">
              <IonLabel>Role ID:</IonLabel>
              <IonInput
                type="number"
                value={roleIdFilter}
                onIonChange={({ target }) =>
                  setRoleIdFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
            <IonItem className="searchField">
              <IonLabel>Role Name:</IonLabel>
              <IonInput
                value={roleFilter}
                onIonChange={({ target }) =>
                  setRoleFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
          </form>
          <IonButton className="searchButton" onClick={searchRoles}>
            Search
          </IonButton>
          <IonButton className="searchButton" onClick={presentCreateModal}>
            Create
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
