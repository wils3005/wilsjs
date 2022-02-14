import {
  home,
  star,
  starHalf,
  accessibility,
  newspaper,
  gameController,
} from "ionicons/icons";
import type { FC } from "react";

import { EventTypes, Events, Home, Policies, Roles, Users } from "./pages";

export type PageManifestItem = {
  component: FC;
  href: string;
  icon: string;
  tab: string;
  text: string;
};

export type PageManifest = PageManifestItem[];

export const pageManifest: PageManifest = [
  {
    component: Home,
    href: "/home",
    icon: home,
    tab: "home",
    text: "Home",
  },
  {
    component: EventTypes,
    href: "/event-types",
    icon: starHalf,
    tab: "event-types",
    text: "Event Types",
  },
  {
    component: Events,
    href: "/events",
    icon: star,
    tab: "events",
    text: "Events",
  },
  {
    component: Policies,
    href: "/policies",
    icon: newspaper,
    tab: "policies",
    text: "Policies",
  },
  {
    component: Roles,
    href: "/roles",
    icon: gameController,
    tab: "roles",
    text: "Roles",
  },
  {
    component: Users,
    href: "/users",
    icon: accessibility,
    tab: "users",
    text: "Users",
  },
];
