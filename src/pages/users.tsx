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
import { FC, useCallback, useEffect, useState, useContext } from "react";

import "./users.css";
import { Sidebar } from "../components";
import { Alert as AlertDisplay } from "../components/alert";
import { AlertContext, Alert } from "../context/alert-context";
import { getRecords, createRecord, updateRecord, deleteRecord } from "../crud";
import { pageManifest } from "../page-manifest";
import type { UserResource } from "../schemas";

type UpdateModalBodyProps = {
  selectedUser: UserResource;
  onDismiss: () => void;
  onSubmit: (opts: Partial<UserResource>) => void;
};

const UpdateModalBody: FC<UpdateModalBodyProps> = ({
  selectedUser,
  onDismiss,
  onSubmit,
}) => {
  const [name, setName] = useState(selectedUser.name);
  const [password, setPassword] = useState(selectedUser.password);

  return (
    <div>
      <form className="updateForm">
        <IonItem>
          <IonLabel>ID: {selectedUser.id}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Name: </IonLabel>
          <IonInput
            value={name}
            onIonChange={({ target }) =>
              setName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel>Password: </IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={({ target }) =>
              setPassword((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>
      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit({ id: selectedUser.id, name, password })}
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
  onSubmit: (
    id: string,
    name: string,
    email: string,
    username: string,
    password: string
  ) => void;
};

const CreateModalBody: FC<CreateModalBodyProps> = ({ onDismiss, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
          <IonLabel>Name: </IonLabel>
          <IonInput
            value={name}
            onIonChange={({ target }) =>
              setName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel>Email: </IonLabel>
          <IonInput
            value={email}
            onIonChange={({ target }) =>
              setEmail((target as HTMLInputElement).value)
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel>Username: </IonLabel>
          <IonInput
            value={username}
            onIonChange={({ target }) =>
              setUsername((target as HTMLInputElement).value)
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel>Password: </IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={({ target }) =>
              setPassword((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>
      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(id, name, email, username, password)}
      >
        Create
      </IonButton>
      <IonButton className="closeButton" expand="block" onClick={onDismiss}>
        Close
      </IonButton>
    </div>
  );
};

export const Users: FC = () => {
  const { dispatch } = useContext(AlertContext);
  const [sidebar, setSidebar] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResource>();

  const [page, setPage] = useState(1);
  const [userIdFilter, setUserIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const [userArr, setUserArr] = useState<UserResource[]>([]);

  const searchUsers = useCallback(async () => {
    setPage(1);

    setUserArr(
      await getRecords("/users", {
        userId: userIdFilter,
        email: emailFilter,
        name: nameFilter,
        username: usernameFilter,
        pageNum: page,
      })
    );
  }, [emailFilter, nameFilter, page, userIdFilter, usernameFilter]);

  const incrementPage = () => setPage(page + 1);
  const decrementPage = () => setPage(page - 1);
  const handleCreateDismiss = () => dismissCreate();

  const handleUpdate = async (user: UserResource) => {
    const response: Alert = await updateRecord("/users", user);
    dispatch?.({
      type: "ADD_ALERT",
      payload: response,
    });
    dismiss();
  };

  const handleCreate = async (user: UserResource) => {
    const response: Alert = await createRecord("/users", user);
    dispatch?.({
      type: "ADD_ALERT",
      payload: response,
    });
    handleCreateDismiss();
  };

  const [presentUpdate, dismiss] = useIonModal(UpdateModalBody, {
    selectedUser,
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

  const presentUpdateModal = (userInstance: UserResource) => {
    setSelectedUser(userInstance);
    presentUpdate({ cssClass: "modal" });
  };

  const removeFeedback = async (id: string) => {
    const response: Alert = await deleteRecord("/users", id);
    dispatch?.({
      type: "ADD_ALERT",
      payload: response,
    });
  };

  const tableRows = userArr.map((element, i) => {
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
          {element.created_at}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.updated_at}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.deleted_at}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.metadata}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.name}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.password}
        </th>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.organization_id}
        </th>
        <th>
          <IonButton
            className="deleteButton"
            onClick={() => removeFeedback(element.id)}
            color="danger"
          >
            Delete
          </IonButton>
        </th>
      </tr>
    );
  });

  useEffect(() => {
    void searchUsers();
  }, [searchUsers]);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Users</IonTitle>
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
            <IonTitle size="large">Users</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>
          <AlertDisplay />
          <div className="tableHolder">
            <table className="feedbackTable">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Deleted</th>
                  <th>Metadata</th>
                  <th>Name</th>
                  <th>Password</th>
                  <th>Organization ID</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>
          <IonButton className="pageButton" onClick={decrementPage}>
            Prev.
          </IonButton>
          <p>Page: {page}</p>
          <IonButton className="pageButton" onClick={incrementPage}>
            Next
          </IonButton>
          <form className="filterForm">
            <IonItem className="searchField">
              <IonLabel>Appointment ID:</IonLabel>
              <IonInput
                value={userIdFilter}
                onIonChange={({ target }) =>
                  setUserIdFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
            <IonItem className="searchField">
              <IonLabel>Name:</IonLabel>
              <IonInput
                value={nameFilter}
                onIonChange={({ target }) =>
                  setNameFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
            <IonItem className="searchField">
              <IonLabel>Username:</IonLabel>
              <IonInput
                value={usernameFilter}
                onIonChange={({ target }) =>
                  setUsernameFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
            <IonItem className="searchField">
              <IonLabel>Email:</IonLabel>
              <IonInput
                value={emailFilter}
                onIonChange={({ target }) =>
                  setEmailFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
          </form>
          <IonButton className="searchButton" onClick={searchUsers}>
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
