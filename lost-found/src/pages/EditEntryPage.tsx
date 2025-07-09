// src/pages/EditEntryPage.tsx
import React, { useEffect, useState } from 'react'
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonItem, IonLabel, IonInput, IonToggle, IonButton
} from '@ionic/react'
import { useParams, useHistory } from 'react-router'
import { dbService, entry as Entry } from '../services/DbService'

const EditEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const [e, setE] = useState<Entry>({
    id: Number(id), title: '', description: '', date: new Date().toISOString(),
    found: false
  })

  useEffect(() => {
    (async () => {
      await dbService.init()
      const fetched = await dbService.getEntry(Number(id))
      if (fetched) setE(fetched)
    })()
  }, [id])

  const save = async () => {
    await dbService.updateEntry(e)
    history.replace(`/entry/${id}`)
  }

  return (
    <IonPage style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
      <IonHeader style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
        <IonToolbar style={{ '--background': '#FEF7FF' } as React.CSSProperties} >
          <IonButtons slot="start"><IonBackButton defaultHref={`/entry/${id}`} /></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
        <IonItem style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
          <IonLabel position="stacked">Titel</IonLabel>
          <IonInput
            value={e.title}
            onIonChange={ev => setE({ ...e, title: ev.detail.value! })}
          />
        </IonItem>
        <IonItem style={{ '--background': '#FEF7FF' } as React.CSSProperties}>
          <IonLabel position="stacked">Beschreibung</IonLabel>
          <IonInput
            value={e.description}
            onIonChange={ev => setE({ ...e, description: ev.detail.value! })}
          />
        </IonItem >
        <IonItem style={{ '--background': '#FEF7FF' } as React.CSSProperties} >
          <IonLabel position="stacked">Datum</IonLabel>
          <IonInput
            type="datetime-local"
            value={new Date(e.date!).toISOString().slice(0,16)}
            onIonChange={ev => setE({ ...e, date: new Date(ev.detail.value!).toISOString() })}
          />
        </IonItem>
        <IonItem lines="none" style={{ '--background': '#FEF7FF' } as React.CSSProperties} >
          <IonLabel>Gefunden</IonLabel>
          <IonToggle
            checked={e.found}
            onIonChange={ev => setE({ ...e, found: ev.detail.checked })}
          />
        </IonItem>
        <IonButton expand="block" onClick={save} style={{ marginTop: '1em', '--background': '#6750A4' }}>
          Speichern
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default EditEntryPage
