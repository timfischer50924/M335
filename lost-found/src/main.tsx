// src/main.tsx
import '@capacitor-community/sqlite'
import { defineCustomElements as defineSqlite } from 'jeep-sqlite/loader'
defineSqlite(window)
import React from 'react'
import { createRoot } from 'react-dom/client'
import { setupIonicReact } from '@ionic/react'
import App from './App'


/* 1) Core CSS */
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/textfield/filled-text-field.js'

/* 2) Utility CSS */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
import 'leaflet/dist/leaflet.css'

import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/all';
import '@material/web/icon/icon.js';
import '@material/web/icon/icon.js';

import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
document.adoptedStyleSheets = [
  ...document.adoptedStyleSheets,
  typescaleStyles.styleSheet!
];
setupIonicReact()

const container = document.getElementById('root')!
createRoot(container).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)
