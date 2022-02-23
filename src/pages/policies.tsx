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

import "./policies.css";
import { Sidebar } from "../components";
import { Alert as AlertDisplay } from "../components/alert";
import { AlertContext, Alert } from "../context/alert-context";
import { createRecord, getRecords, updateRecord, deleteRecord } from "../crud";
import { pageManifest } from "../page-manifest";
import type { PolicyResource } from "../schemas";

const UpdateModalBody: FC<{
  selectedPolicy: PolicyResource;
  onDismiss: () => void;
  onSubmit: (id: string, policy: string) => void;
}> = ({ selectedPolicy, onDismiss, onSubmit }) => {
  const [policyName, setPolicyName] = useState(selectedPolicy.name);

  return (
    <div>
      <form className="updateForm">
        <IonItem>
          <IonLabel>ID: {selectedPolicy.id}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Policy Name: </IonLabel>
          <IonInput
            value={policyName}
            onIonChange={({ target }) =>
              setPolicyName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>
      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(selectedPolicy.id, policyName)}
      >
        Update Values
      </IonButton>
      <IonButton className="closeButton" expand="block" onClick={onDismiss}>
        Close
      </IonButton>
    </div>
  );
};

const CreateModalBody: FC<{
  onDismiss: () => void;
  onSubmit: (id: string, policy: string) => void;
}> = ({ onDismiss, onSubmit }) => {
  const [policyName, setPolicyName] = useState("");
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
          <IonLabel>Policy Name: </IonLabel>
          <IonInput
            type="number"
            value={policyName}
            onIonChange={({ target }) =>
              setPolicyName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>
      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(id, policyName)}
      >
        Create
      </IonButton>
      <IonButton className="closeButton" expand="block" onClick={onDismiss}>
        Close
      </IonButton>
    </div>
  );
};

export const Policies: FC = () => {
  const { dispatch } = useContext(AlertContext);
  const [sidebar, setSidebar] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyResource>();

  const [page, setPage] = useState(1);
  const [policyIdFilter, setPolicyIdFilter] = useState("");
  const [policyFilter, setPolicyFilter] = useState("");

  const [policyArr, setPolicyArr] = useState<PolicyResource[]>([]);

  const searchPolicies = async () => {
    setPage(1);

    setPolicyArr(
      await getRecords("/policies", {
        policyId: policyIdFilter,
        policyName: policyFilter,
        pageNum: page,
      })
    );
  };

  const incrementPage = () => setPage(page + 1);
  const decrementPage = () => setPage(page - 1);
  const handleCreateDismiss = () => dismissCreate();

  const handleUpdate = async (policy: PolicyResource) => {
    const response: Alert = await updateRecord("/policies", policy);
    dispatch?.({
      type: "ADD_ALERT",
      payload: response,
    });
    dismiss();
  };

  const handleCreate = async (policy: PolicyResource) => {
    const response: Alert = await createRecord("/policies", policy);
    dispatch?.({
      type: "ADD_ALERT",
      payload: response,
    });
    handleCreateDismiss();
  };

  const [presentUpdate, dismiss] = useIonModal(UpdateModalBody, {
    selectedPolicy,
    onDismiss: () => dismiss(),
    onSubmit: handleUpdate,
  });

  const [presentCreate, dismissCreate] = useIonModal(CreateModalBody, {
    onDismiss: handleCreateDismiss,
    onSubmit: handleCreate,
  });

  const presentCreateModal = () => presentCreate({ cssClass: "modal" });

  const presentUpdateModal = (policyInstance: PolicyResource) => {
    setSelectedPolicy(policyInstance);
    presentUpdate({ cssClass: "modal" });
  };

  const tableRows = policyArr.map((element, i) => {
    return (
      <tr className="resultRow" key={i}>
        <th onClick={() => presentUpdateModal(element)}>{element.id}</th>
        <th onClick={() => presentUpdateModal(element)}>{element.id}</th>
        <th>
          <IonButton
            className="deleteButton"
            onClick={() => deleteRecord("/policies", element.id)}
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
          <IonTitle>Policies</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-text-center" fullscreen>
        {sidebar ? <Sidebar pageManifest={pageManifest} /> : null}
        <IonButtons slot="end">
          <IonMenuButton
            onClick={() => setSidebar(!sidebar)}
            autoHide={false}
          />
        </IonButtons>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Policies</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>
          <AlertDisplay />
          <table className="policiesTable">
            <thead>
              <tr>
                <th>Policy ID</th>
                <th>Policy Name</th>
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
              <IonLabel>Policy ID:</IonLabel>
              <IonInput
                type="number"
                value={policyIdFilter}
                onIonChange={({ target }) =>
                  setPolicyIdFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
            <IonItem className="searchField">
              <IonLabel>Policy Name:</IonLabel>
              <IonInput
                value={policyFilter}
                onIonChange={({ target }) =>
                  setPolicyFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
          </form>
          <IonButton className="searchButton" onClick={searchPolicies}>
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
