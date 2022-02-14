import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import { FC, useState } from "react";

import { Sidebar } from "../components";
import { pageManifest } from "../page-manifest";

export const Home: FC = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton
              onClick={() => setSidebar(!sidebar)}
              autoHide={false}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-text-center" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div>
          {sidebar ? <Sidebar pageManifest={pageManifest} /> : null}
          <p>Welcome to wilsjs!</p>
        </div>
      </IonContent>
    </IonPage>
  );
};
