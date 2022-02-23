import {
  home,
  star,
  starHalf,
  accessibility,
  newspaper,
  gameController,
} from 'ionicons/icons';

import { EventTypes, Events, Home, Policies, Roles, Users } from './pages';
import { PageManifest } from './types';

export const pageManifest: PageManifest = [
  {
    component: Home,
    href: '/home',
    icon: home,
    tab: 'home',
    text: 'Home',
  },
  {
    component: EventTypes,
    href: '/event-types',
    icon: starHalf,
    tab: 'event-types',
    text: 'Event Types',
  },
  {
    component: Events,
    href: '/events',
    icon: star,
    tab: 'events',
    text: 'Events',
  },
  {
    component: Policies,
    href: '/policies',
    icon: newspaper,
    tab: 'policies',
    text: 'Policies',
  },
  {
    component: Roles,
    href: '/roles',
    icon: gameController,
    tab: 'roles',
    text: 'Roles',
  },
  {
    component: Users,
    href: '/users',
    icon: accessibility,
    tab: 'users',
    text: 'Users',
  },
];
