// src/pages/MapPage.tsx
import React, { useEffect, useRef } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/react'
import { add } from 'ionicons/icons'
import { Geolocation } from '@capacitor/geolocation'
import { dbService, entry } from '../services/DbService'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapPage.css'
import '@material/web/icon/icon.js'
import '@material/web/textfield/filled-text-field.js';
import '@material/web/fab/fab.js';
// statische Icon-Assets importieren
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useHistory } from 'react-router'

// Leaflet-Default-Icon konfigurieren
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
})

const MapPage: React.FC = () => {
    const history = useHistory()

  // Referenz aufs DOM-Element der Karte
  const mapEl = useRef<HTMLDivElement>(null)
  // Leaflet-Instanz
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    ; (async () => {
      // 1. Standort abfragen
      let lat = 0, lon = 0
      try {
        const position = await Geolocation.getCurrentPosition()
        lat = position.coords.latitude
        lon = position.coords.longitude
      } catch {
        // Fallback bei Fehler: Zentrum bleibt [0,0]
      }

      // 2. Karte initialisieren oder zentrieren
      if (mapEl.current && !mapRef.current) {
        mapRef.current = L.map(mapEl.current, {
          center: [lat, lon],
          zoom: 13
        })
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapRef.current)
      } else if (mapRef.current) {
        mapRef.current.setView([lat, lon], 13)
      }

      // 3. Marker für eigenen Standort hinzufügen
      mapRef.current?.addLayer(L.marker([lat, lon]))

      // 4. Einträge aus der DB laden und Marker setzen
      await dbService.init()
      const allEntries = await dbService.getAllEntries()
      for (const e of allEntries) {
        if (e.lat == null || e.lon == null) {
          continue
        }
        const marker = L.marker([e.lat, e.lon]).addTo(mapRef.current!)
        let popupHtml = `
          <strong>${e.title}</strong><br/>
          ${e.description}<br/>
          <small>${new Date(e.date!).toLocaleString()}</small>
        `
        if (e.image) {
          try {
            const fileUri = await Filesystem.getUri({
              directory: Directory.Data,
              path: e.image
            })
            const webPath = Capacitor.convertFileSrc(fileUri.uri)
            popupHtml += `<br/><img src="${webPath}" style="width:100px; margin-top:0.5em"/>`
          } catch {
            // Bild konnte nicht geladen werden
          }
        }
        marker.bindPopup(popupHtml)
      }
    })()

    return () => {
      // Karte beim Unmount entfernen
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Karte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-no-padding">
        <div ref={mapEl} className="map-container" />
        {/* <IonFab vertical="bottom" horizontal="center" slot="fixed" >
          <IonFabButton routerLink="/tabs/tab4" style={{ backgroundColor: '#6750A4' }} >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab> */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000
        }}>
          <md-filled-icon-button
            class="fab-button"
            mini
            label=""
            onClick={() => history.push('/tabs/tab4')}
          >
            <IonIcon icon={add} style={{ color: '#FFFFFF' }} />

          </md-filled-icon-button>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default MapPage
