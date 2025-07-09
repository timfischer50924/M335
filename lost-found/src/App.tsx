// src/App.tsx
import React, { useState } from 'react'
import { IonApp, setupIonicReact, IonRouterOutlet } from '@ionic/react'          // <-- IonRouterOutlet hierher
import { IonReactRouter } from '@ionic/react-router'
import { Route, Redirect, Switch } from 'react-router-dom'                              // <-- nur Route/Redirect
import '../index.css';
import LoginPage from './pages/LoginPage'
import MainTabs from '../src/pages/MainTabs'
import EntryDetailPage from './pages/EntryDetailPage'
import EditEntryPage   from './pages/EditEntryPage'
setupIonicReact()

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <IonApp>
      <IonReactRouter>
        <Switch>                                                        
          <Route path="/login" exact>
            <LoginPage onLogin={() => setAuthenticated(true)} />
          </Route>
          <Route path="/entry/:id" exact component={EntryDetailPage} />
          <Route path="/edit/:id"  component={EditEntryPage}   exact />

          <Route path="/tabs">
            { authenticated
              ? <MainTabs onLogout={() => setAuthenticated(false)} />
              : <Redirect to="/login" />
            }
          </Route>
          <Route exact path="/">
            <Redirect to={ authenticated ? '/tabs/tab1' : '/login' } />
          </Route>
        </Switch>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
