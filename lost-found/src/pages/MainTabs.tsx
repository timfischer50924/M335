// src/pages/MainTabs.tsx
import React from 'react';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { map, list, logOut } from 'ionicons/icons';

import MapPage from './MapPage';
import EntryPage from './EntryPage';
import Logout from './LogoutPage';

interface Props {
  onLogout(): void;
}

const MainTabs: React.FC<Props> = ({ onLogout }) => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/tabs/tab1" component={MapPage} exact />
      <Route path="/tabs/tab2" component={EntryPage} exact />
      <Route
        path="/tabs/tab3"
        exact
        render={() => {
          onLogout();
          return <Redirect to="/login" />;
        }}
      />
      <Redirect to="/tabs/tab1" />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="tab1" href="/tabs/tab1">
        <IonIcon icon={map} />
        <IonLabel>Karte</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab2" href="/tabs/tab2">
        <IonIcon icon={list} />
        <IonLabel>Einträge</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab3" href="/tabs/tab3">
        <IonIcon icon={logOut} />
        <IonLabel>Logout</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default MainTabs;
