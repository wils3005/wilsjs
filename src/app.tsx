import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { FC, useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";

import "./app.css";
import { pageManifest } from "./page-manifest";
import icon from "./theme/img/icon.png";

export const App: FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    // Currently a preset timeout
    // Will change to trigger while assets load
  }, []);

  const routes = pageManifest.map(({ component, href }, i) => {
    return <Route exact key={i} path={href} component={component} />;
  });

  const tabButtons = pageManifest.map(({ href, icon, tab, text }, i) => {
    return (
      <IonTabButton key={i} tab={tab} href={href}>
        <IonIcon icon={icon} />
        <IonLabel>{text}</IonLabel>
      </IonTabButton>
    );
  });

  return (
    <IonApp>
      <IonReactRouter>
        {loading ? (
          <img src={icon} alt="Icon" className="splashIcon" />
        ) : (
          <IonTabs>
            <IonRouterOutlet>
              {routes}
              <Route render={() => <Redirect to="/home" />} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">{tabButtons}</IonTabBar>
          </IonTabs>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

setupIonicReact();
