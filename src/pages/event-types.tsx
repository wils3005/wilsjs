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
import type { EventTypeResource } from "../schemas";
import "./event-types.css";

type UpdateModalBodyProps = {
  selectedEventType: {
    eventTypeId: string;
    eventTypeName: string;
  };
  onDismiss: () => void;
  onSubmit: (id: string, eventType: string) => void;
};

const UpdateModalBody: FC<UpdateModalBodyProps> = ({
  selectedEventType,
  onDismiss,
  onSubmit,
}) => {
  const [eventTypeName, setEventTypeName] = useState(
    selectedEventType.eventTypeName.toString()
  );

  return (
    <div>
      <form className="updateForm">
        <IonItem>
          <IonLabel>ID: {selectedEventType.eventTypeId}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Event Type Name: </IonLabel>
          <IonInput
            value={eventTypeName}
            onIonChange={({ target }) =>
              setEventTypeName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>

      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(selectedEventType.eventTypeId, eventTypeName)}
      >
        Update Values
      </IonButton>

      <IonButton
        className="closeButton"
        expand="block"
        onClick={() => onDismiss()}
      >
        Close
      </IonButton>
    </div>
  );
};

type CreateModalBodyProps = {
  onDismiss: () => void;
  onSubmit: (id: string, eventType: string) => void;
};

const CreateModalBody: FC<CreateModalBodyProps> = ({ onDismiss, onSubmit }) => {
  const [eventTypeName, setEventTypeName] = useState("");
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
          <IonLabel>Event Type Name: </IonLabel>
          <IonInput
            type="number"
            value={eventTypeName}
            onIonChange={({ target }) =>
              setEventTypeName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>

      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(id, eventTypeName)}
      >
        Create
      </IonButton>

      <IonButton
        className="closeButton"
        expand="block"
        onClick={() => onDismiss()}
      >
        Close
      </IonButton>
    </div>
  );
};

export const EventTypes: FC = () => {
  const { dispatch } = useContext(AlertContext);
  const [sidebar, setSidebar] = useState(false);
  const [selectedEventType, setSelectedEventType] =
    useState<EventTypeResource>();

  const [page, setPage] = useState(1);
  const [eventTypeIdFilter, setEventTypeIdFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");

  const [eventTypeArr, setEventTypeArr] = useState<EventTypeResource[]>([]);

  const searchFeedback = async () => {
    setPage(1);
    setEventTypeArr(await getRecords<EventTypeResource>("/event-types"));
  };

  const incrementPage = () => setPage(page + 1);
  const decrementPage = () => setPage(page - 1);
  const handleCreateDismiss = () => dismissCreate();

  const handleUpdate = async (eventType: EventTypeResource) => {
    await updateRecord<EventTypeResource>("/event-types", eventType);

    if (dispatch) {
      dispatch({
        type: "ADD_ALERT",
        payload: response,
      });
    }
    dismiss();
  };

  const handleCreate = async (eventType: EventTypeResource) => {
    const response: Alert = await createRecord<EventTypeResource>(
      "/event-types",
      eventType
    );
    if (dispatch) {
      dispatch({
        type: "ADD_ALERT",
        payload: response,
      });
    }
    handleCreateDismiss();
  };

  const [presentUpdate, dismiss] = useIonModal(UpdateModalBody, {
    selectedEventType,
    onDismiss: () => dismiss(),
    onSubmit: handleUpdate,
  });

  const [presentCreate, dismissCreate] = useIonModal(CreateModalBody, {
    onDismiss: handleCreateDismiss,
    onSubmit: handleCreate,
  });

  const presentCreateModal = () => presentCreate({ cssClass: "modal" });

  const presentUpdateModal = (eventTypeInstance: EventTypeResource) => {
    setSelectedEventType(eventTypeInstance);
    presentUpdate({ cssClass: "modal" });
  };

  const tableRows = eventTypeArr.map((element, i) => {
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
          {element.name}
        </th>
        <th>
          <IonButton
            className="deleteButton"
            onClick={() => deleteRecord("/event-types", element.id)}
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
          <IonTitle>Event Types</IonTitle>
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
            <IonTitle size="large">Event Types</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div>
          <AlertDisplay />
          <table className="eventTypesTable">
            <thead>
              <tr>
                <th>Event Type ID</th>
                <th>Event Type Name</th>
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
              <IonLabel>EventType ID:</IonLabel>
              <IonInput
                type="number"
                value={eventTypeIdFilter}
                onIonChange={({ target }) =>
                  setEventTypeIdFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
            <IonItem className="searchField">
              <IonLabel>EventType Name:</IonLabel>
              <IonInput
                value={eventTypeFilter}
                onIonChange={({ target }) =>
                  setEventTypeFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
          </form>
          <IonButton className="searchButton" onClick={searchFeedback}>
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
