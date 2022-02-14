import { IonItem } from "@ionic/react";
import { FC, useState, useEffect } from "react";

import "./sidebar.css";
import type { PageManifest } from "../page-manifest";

export const Sidebar: FC<{ pageManifest: PageManifest }> = ({
  pageManifest,
}) => {
  const [active, setActive] = useState(false);
  useEffect(() => setActive(true), []);

  const listItems = pageManifest.map(({ href, text }, i) => {
    return (
      <li className="nav-item" key={i}>
        <IonItem className="navButton" routerLink={href}>
          {text}
        </IonItem>
      </li>
    );
  });

  return (
    <div className={active ? "nav-menu active" : "nav-menu"}>
      <ul className="nav-menu-items">{listItems}</ul>
    </div>
  );
};
