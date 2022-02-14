import { IonIcon } from "@ionic/react";
import {
  checkmark,
  informationCircle,
  alert,
  warning,
  nuclear,
  close,
} from "ionicons/icons";
import { FC, useContext } from "react";
import "./alert.css";

import { AlertContext } from "../context/alert-context";

export const Alert: FC = () => {
  const { state, dispatch } = useContext(AlertContext);

  console.log(dispatch);

  const generateIcon = (type: string) => {
    switch (type) {
      case "success":
        return <IonIcon icon={checkmark} />;
      case "info":
        return <IonIcon icon={informationCircle} />;
      case "warning":
        return <IonIcon icon={alert} />;
      case "danger":
        return <IonIcon icon={warning} />;
      default:
        return <IonIcon icon={nuclear} />;
    }
  };

  const generateBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "#5cb85c";
      case "info":
        return "#5bc0de";
      case "warning":
        return "#f0ad4e";
      case "danger":
        return "#d9534f";
      default:
        return "#999";
    }
  };
  return (
    <div className="alert-container">
      {state.map((alert) => {
        return (
          <div
            key={alert.id}
            style={{ backgroundColor: generateBackgroundColor(alert.type) }}
            className="alert toast"
          >
            <div>
              <IonIcon
                icon={close}
                className="close-button"
                onClick={() =>
                  dispatch
                    ? dispatch({
                        type: "DELETE_ALERT",
                        payload: alert.id,
                      })
                    : null
                }
              />
            </div>
            <div className="alert-image">{generateIcon(alert.type)}</div>
            <div>
              <p className="alert-title">{alert.title}</p>
              <p className="alert-text">{alert.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
