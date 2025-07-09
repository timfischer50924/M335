// src/pages/EntriesPage.tsx
import React, { useEffect, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg
} from '@ionic/react'
import { dbService, entry as Entry } from '../services/DbService'
import { useHistory } from 'react-router'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import './EntriesPage.css'

const EntriesPage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [imagePaths, setImagePaths] = useState<{ [key: number]: string }>({})
  const [isLandscape, setIsLandscape] = useState<boolean>(
    window.matchMedia('(orientation: landscape)').matches
  )
  const history = useHistory()

  const loadEntries = async () => {
    await dbService.init()
    const all = await dbService.getAllEntries()
    setEntries(all)

    const resolvedPaths: { [key: number]: string } = {}
    for (const entry of all) {
      if (entry.image) {
        try {
          const uri = await Filesystem.getUri({
            directory: Directory.Data,
            path: entry.image
          })
          resolvedPaths[entry.id!] = Capacitor.convertFileSrc(uri.uri)
        } catch (err) {
          console.warn(`Bild konnte nicht geladen werden für ID ${entry.id}:`, err)
        }
      }
    }
    setImagePaths(resolvedPaths)
  }

  useEffect(() => {
    loadEntries()
  }, [])

  useEffect(() => {
    const mql = window.matchMedia('(orientation: landscape)')
    const handler = (e: MediaQueryListEvent) => setIsLandscape(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const handleRefresh = async (e: CustomEvent) => {
    await loadEntries()
    e.detail.complete()
  }

  const openDetail = (id: number) => {
    history.push(`/entry/${id}`)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar  style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
          <IonButtons slot="end">
            <IonButton onClick={loadEntries}>Refresh</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent  style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonList style={{ '--background': '#FEF7FF' } as React.CSSProperties}>

          {entries.map(e => (
            <IonItem key={e.id} button onClick={() => openDetail(e.id!)} style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
              <IonLabel className="ion-text-wrap" style={{background: '#FEF7FF'}}>
                <IonGrid style={{background: '#FEF7FF'}}>
                  <IonRow className="ion-align-items-center entry-row" style={{background: '#FEF7FF'}}>
                    {isLandscape && imagePaths[e.id!] && (
                      <IonCol size="auto" style={{background: '#FEF7FF'}}>
                        <IonImg
                          src={imagePaths[e.id!]}
                          alt="Bild"
                          className="entry-image"
                        />
                      </IonCol>
                    )}
                    <IonCol style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
                      <h2>{e.title || '<kein Titel>'}</h2>
                      <p>{new Date(e.date!).toLocaleString()}</p>
                      {isLandscape && <p>{e.description || '-'}</p>}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default EntriesPage
