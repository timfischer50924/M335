// src/pages/LoginPage.tsx

declare namespace JSX {
  interface IntrinsicElements {
    'md-filled-text-field': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      label?: string;
      type?: string;
      value?: string;
      onInput?: (e: React.FormEvent<HTMLElement>) => void;
    };
    'md-outlined-text-field': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      label?: string;
      type?: string;
      value?: string;
      onInput?: (e: React.FormEvent<HTMLElement>) => void;
    };
  }
}

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LoginPage.css';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/react';
import '@material/web/icon/icon.js'
import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { checkbox, checkmark, person } from 'ionicons/icons';
import { MdIcon } from '@material/web/icon/icon.js';

document.adoptedStyleSheets = [
  ...document.adoptedStyleSheets,
  typescaleStyles.styleSheet!
];

interface Props { onLogin(): void; }

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    onLogin();
    history.replace('/tabs/tab1');
  };

  return (
    <IonPage>
      <IonContent className="login-container">
        <div className="avatar-wrapper">
          <IonIcon icon={person}  style={{ color: '#6750A4' }} />
        </div>
        <md-filled-text-field
          label="Email"
          type="email"
          value={email}
          onInput={e => setEmail((e.target as HTMLInputElement).value)}
        />
        <md-filled-text-field
          label="Passwort"
          type="password"
          value={password}
          onInput={e => setPassword((e.target as HTMLInputElement).value)}
        />
        <md-filled-icon-button
          class="fab-button"
          mini
          label=""
          onClick={handleLogin}
        >
          <IonIcon icon={checkmark} style={{ color: '#FFFFFF' }} />

        </md-filled-icon-button>
      </IonContent>
    </IonPage>
  )
}

export default LoginPage