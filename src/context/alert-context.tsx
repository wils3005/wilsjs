import React, { createContext, useReducer } from "react";

export type Alert = {
  id: string;
  type: "success" | "info" | "warning" | "danger";
  title: string;
  detail: string;
};

export type Dispatch = (action: Action) => void;
type Action = {
  type: "ADD_ALERT" | "DELETE_ALERT";
  payload: string | Alert;
};

export const AlertContext = createContext<{
  state: Alert[];
  dispatch: Dispatch | null;
}>({
  state: [],
  dispatch: null,
});

export const AlertContextProvider = (props: {
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  const notifications: Alert[] = [];
  const [state, dispatch] = useReducer((state: Alert[], action: Action) => {
    switch (action.type) {
      case "ADD_ALERT":
        return [...state, action.payload as Alert];
      case "DELETE_ALERT":
        return state.filter((alert) => alert.id !== action.payload);
      default:
        return state;
    }
  }, notifications);

  return (
    <AlertContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AlertContext.Provider>
  );
};
