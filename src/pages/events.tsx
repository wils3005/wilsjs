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

import "./events.css";
import { Sidebar } from "../components";
import { Alert as AlertDisplay } from "../components/alert";
import { AlertContext, Alert } from "../context/alert-context";
import { createRecord, getRecords, updateRecord, deleteRecord } from "../crud";
import { pageManifest } from "../page-manifest";
import type { EventResource } from "../schemas";

type UpdateModalBodyProps = {
  selectedEvent: {
    eventId: string;
    eventName: string;
  };
  onDismiss: () => void;
  onSubmit: (id: string, event: string) => void;
};

const UpdateModalBody: FC<UpdateModalBodyProps> = ({
  selectedEvent,
  onDismiss,
  onSubmit,
}) => {
  const [eventName, setEventName] = useState(
    selectedEvent.eventName.toString()
  );

  return (
    <div>
      <form className="updateForm">
        <IonItem>
          <IonLabel>ID: {selectedEvent.eventId}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Event Name: </IonLabel>
          <IonInput
            value={eventName}
            onIonChange={({ target }) =>
              setEventName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>
      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(selectedEvent.eventId, eventName)}
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
  onSubmit: (id: string, event: string) => void;
};

const CreateModalBody: FC<CreateModalBodyProps> = ({ onDismiss, onSubmit }) => {
  const [eventName, setEventName] = useState("");
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
          <IonLabel>Event Name: </IonLabel>
          <IonInput
            type="number"
            value={eventName}
            onIonChange={({ target }) =>
              setEventName((target as HTMLInputElement).value)
            }
          />
        </IonItem>
      </form>
      <IonButton
        className="submitButton"
        expand="block"
        onClick={() => onSubmit(id, eventName)}
      >
        Create
      </IonButton>
      <IonButton className="closeButton" expand="block" onClick={onDismiss}>
        Close
      </IonButton>
    </div>
  );
};

export const Events: FC = () => {
  const { dispatch } = useContext(AlertContext);
  const [sidebar, setSidebar] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResource>();

  const [page, setPage] = useState(1);
  const [eventIdFilter, setEventIdFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  const [eventArr, setEventArr] = useState<EventResource[]>([]);

  const searchEvents = async () => {
    setPage(1);

    setEventArr(
      await getRecords<EventResource>("/events", {
        eventId: eventIdFilter,
        eventName: eventFilter,
        pageNum: page,
      })
    );
  };

  const incrementPage = () => {
    setPage(page + 1);
  };

  const decrementPage = () => {
    setPage(page - 1);
  };

  const handleDismiss = () => {
    dismiss();
  };

  const handleCreateDismiss = () => {
    dismissCreate();
  };

  const handleUpdate = async (event: EventResource) => {
    await updateRecord<EventResource>("/events", event);
    handleDismiss();
  };

  const handleCreate = async (id: string, event: string) => {
    const response: Alert = await createRecord(id, event);
    if (dispatch) {
      dispatch({
        type: "ADD_ALERT",
        payload: response,
      });
    }
    handleCreateDismiss();
  };

  const [presentUpdate, dismiss] = useIonModal(UpdateModalBody, {
    selectedEvent,
    onDismiss: handleDismiss,
    onSubmit: handleUpdate,
  });

  const [presentCreate, dismissCreate] = useIonModal(CreateModalBody, {
    onDismiss: handleCreateDismiss,
    onSubmit: handleCreate,
  });

  const presentCreateModal = () => {
    presentCreate({ cssClass: "modal" });
  };

  const presentUpdateModal = (eventInstance: EventResource) => {
    setSelectedEvent(eventInstance);
    presentUpdate({ cssClass: "modal" });
  };

  const tableRows = eventArr.map((element, i) => {
    return (
      <tr className="resultRow" key={i}>
        <th
          onClick={() => {
            presentUpdateModal(element);
          }}
        >
          {element.id}
        </th>
        <th onClick={() => presentUpdateModal(element)}>{element.id}</th>
        <th>
          <IonButton
            className="deleteButton"
            onClick={() => deleteRecord("/events", element.id)}
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
          <IonTitle>Events</IonTitle>
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
            <IonTitle size="large">Events</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>
          <AlertDisplay />
          <table className="eventsTable">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Event Name</th>
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
              <IonLabel>Event ID:</IonLabel>
              <IonInput
                type="number"
                value={eventIdFilter}
                onIonChange={({ target }) =>
                  setEventIdFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
            <IonItem className="searchField">
              <IonLabel>Event Name:</IonLabel>
              <IonInput
                value={eventFilter}
                onIonChange={({ target }) =>
                  setEventFilter((target as HTMLInputElement).value)
                }
              />
            </IonItem>
          </form>
          <IonButton className="searchButton" onClick={searchEvents}>
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
