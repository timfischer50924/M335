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
import EntriesPage from './EntriesPage';
import EntryDetailPage from './EntryDetailPage';
import './MainTabs.css';
import { BorderAllRounded } from '@mui/icons-material';
interface Props {
  onLogout(): void;
}

const MainTabs: React.FC<Props> = ({ onLogout }) => (
  <IonTabs >
    <IonRouterOutlet>
      <Route path="/tabs/tab1" component={MapPage} exact />
      <Route path="/tabs/tab2" component={EntriesPage} exact />
      <Route path="/tabs/tab4" component={EntryPage} exact />
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

    <IonTabBar slot="bottom" style={{
      background: '#F3EDF7', borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
    }}>
      <IonTabButton tab="tab1" href="/tabs/tab1" style={{ background: '#F3EDF7', color: '#6750A4', }}>
        <IonIcon icon={map} />
        <IonLabel>Karte</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab2" href="/tabs/tab2" style={{ background: '#F3EDF7', color: '#6750A4' }}>
        <IonIcon icon={list} />
        <IonLabel>Einträge</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab3" href="/tabs/tab3" style={{ background: '#F3EDF7', color: '#6750A4' }}>
        <IonIcon icon={logOut} />
        <IonLabel>Logout</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default MainTabs;
