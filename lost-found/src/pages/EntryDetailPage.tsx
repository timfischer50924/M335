// src/pages/EntryDetailPage.tsx
import React, { useEffect, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonImg,
  IonButton,
  IonIcon,
  IonBadge
} from '@ionic/react'
import { useParams, useHistory } from 'react-router'
import { arrowForward } from 'ionicons/icons'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import { dbService, entry as Entry } from '../services/DbService'

const EntryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [photoWebPath, setPhotoWebPath] = useState<string>()

  useEffect(() => {
    ;(async () => {
      await dbService.init()
      const all = await dbService.getAllEntries()
      const found = all.find(e => e.id === Number(id)) ?? null
      setEntry(found)
      if (found?.image) {
        const uri = await Filesystem.getUri({
          directory: Directory.Data,
          path: found.image
        })
        setPhotoWebPath(Capacitor.convertFileSrc(uri.uri))
      }
    })()
  }, [id])

  if (!entry) {
    return (
      <IonPage style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
        <IonHeader style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/tab2" />
            </IonButtons>
            <IonTitle>Eintrag nicht gefunden</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonPage>
    )
  }

  const openInMaps = () => {
    const { lat, lon } = entry
    window.open(`geo:${lat},${lon}?q=${lat},${lon}`, '_system')
  }

  return (
    <IonPage style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
      <IonHeader style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
        <IonToolbar style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab2" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
        <IonCard style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
          <IonCardHeader style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
            <IonCardTitle>{entry.title || '<kein Titel>'}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
           
            <IonItem lines="none" style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
              <IonLabel>
                <h3>Beschreibung</h3>
                <p>{entry.description || '-'}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="none" style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
              <IonLabel>
                <h3>Datum</h3>
                <p>{new Date(entry.date!).toLocaleString()}</p>
              </IonLabel>
            </IonItem>
            <IonItem lines="none" style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
              <IonLabel>
                <h3>Status</h3>
                <IonBadge color={entry.found ? 'success' : 'danger'}>
                  {entry.found ? 'Gefunden' : 'Verloren'}
                </IonBadge>
              </IonLabel>
            </IonItem>
            {photoWebPath && (
              <IonImg
                src={photoWebPath}
                style={{ width: '100%', marginTop: '1em' }}
              />
            )}
             <IonButton
              expand="block"
              onClick={openInMaps}
              style={{ marginTop: '1em', '--background': '#6750A4' } as React.CSSProperties}
            >
              In Karte öffnen <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              onClick={() => history.push(`/edit/${entry.id}`)}
              style={{
                marginBottom: '1em',
                '--border-color': '#6750A4',
                '--color': '#6750A4'
              } as React.CSSProperties}
            >
              Bearbeiten
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default EntryDetailPage
