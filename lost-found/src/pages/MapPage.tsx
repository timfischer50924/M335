// src/pages/MapPage.tsx
import React, { useEffect, useRef } from 'react'
import {
  IonPage,
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
import { useHistory } from 'react-router'

// Leaflet default icon
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const MapPage: React.FC = () => {
  const history = useHistory()
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    ;(async () => {
      let lat = 0, lon = 0
      try {
        const pos = await Geolocation.getCurrentPosition()
        lat = pos.coords.latitude
        lon = pos.coords.longitude
      } catch {}

      if (mapEl.current && !mapRef.current) {
        mapRef.current = L.map(mapEl.current, { center: [lat, lon], zoom: 13 })
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          { attribution: '&copy; CartoDB' }
        ).addTo(mapRef.current)
      } else {
        mapRef.current?.setView([lat, lon], 13)
      }

      L.marker([lat, lon]).addTo(mapRef.current!)

      await dbService.init()
      const all = await dbService.getAllEntries()
      all.forEach(async (e: entry) => {
        if (e.lat == null || e.lon == null) return
        const m = L.marker([e.lat, e.lon]).addTo(mapRef.current!)
        let popup = `<strong>${e.title}</strong><br/>${e.description}<br/><small>${new Date(e.date!).toLocaleString()}</small>`
        if (e.image) {
          try {
            const uri = await Filesystem.getUri({ directory: Directory.Data, path: e.image })
            const src = Capacitor.convertFileSrc(uri.uri)
            popup += `<br/><img src="${src}" style="width:100px;margin-top:0.5em"/>`
          } catch {}
        }
        popup += `<br/><button id="detail-${e.id}" class="leaflet-detail">Details</button>`
        m.bindPopup(popup)
        m.on('popupopen', () => {
          const btn = document.getElementById(`detail-${e.id}`)
          btn?.addEventListener('click', () => history.push(`/entry/${e.id}`))
        })
      })
    })()

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <IonPage>
      <IonContent fullscreen className="ion-no-padding">
        <div ref={mapEl} className="map-container" />
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => history.push('/tabs/tab4')} style={{
            '--background': '#6750A4', '--color': '#F3EDF7'
          }}>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default MapPage
