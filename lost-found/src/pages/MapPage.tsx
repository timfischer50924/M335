// src/pages/MapPage.tsx
import React, { useEffect, useRef } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import { add } from 'ionicons/icons';

const MapPage: React.FC = () => {
  // initialValue null, Typ L.Map|null
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    (async () => {
      const pos = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = pos.coords;

      if (mapRef.current) {
        mapRef.current.setView([latitude, longitude], 13);
      } else {
        const map = L.map('map', {
          center: [latitude, longitude],
          zoom: 13
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        mapRef.current = map;
      }

      // Marker setzen
      mapRef.current!.addLayer(
        L.marker([latitude, longitude])
      );
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Karte</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div id="map" className="map-container" />
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton routerLink="/tabs/tab2">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default MapPage;
