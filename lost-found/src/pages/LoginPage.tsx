// src/pages/LoginPage.tsx
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/react'

interface Props { onLogin(): void }

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const handleLogin = () => {
    onLogin()
    history.replace('/tabs/tab1')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Passwort</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          />
        </IonItem>
        <IonButton
          expand="block"
          className="ion-margin-top"
          disabled={!email || !password}
          onClick={handleLogin}
        >
          Anmelden
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default LoginPage
