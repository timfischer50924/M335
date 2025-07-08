// src/pages/EntryFormPage.tsx
import React, { useEffect, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonToggle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  IonImg,
  useIonToast
} from '@ionic/react'
import { save, camera } from 'ionicons/icons'
import { Geolocation } from '@capacitor/geolocation'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import { dbService, entry as Entry } from '../services/DbService'
import '@material/web/icon/icon.js'
import '@material/web/textfield/filled-text-field.js';
import '@material/web/switch/switch.js';
import '@material/web/textfield/outlined-text-field.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js'
import './EntryPage.css'


const convertBlobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const dataUrl = reader.result as string
      resolve(dataUrl.split(',')[1])
    }
    reader.readAsDataURL(blob)
  })

const EntryFormPage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString())
  const [found, setFound] = useState(true)
  const [photoFileName, setPhotoFileName] = useState<string>()
  const [photoWebPath, setPhotoWebPath] = useState<string>()
  const [presentToast] = useIonToast()

  useEffect(() => {
    ; (async () => {
      await dbService.init()
      await Geolocation.requestPermissions()
    })()
  }, [])

  const takePhoto = async () => {
    // Bild aufnehmen
    const captured: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90
    })
    // Blob holen und in Base64 umwandeln
    const response = await fetch(captured.webPath!)
    const blob = await response.blob()
    const base64Data = await convertBlobToBase64(blob)

    // Datei im App-Sandox-Verzeichnis speichern
    const fileName = `${new Date().getTime()}.jpeg`
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })

    // Erzeuge Web-URI für Anzeige
    const fileUri = await Filesystem.getUri({
      directory: Directory.Data,
      path: fileName
    })
    const webviewPath = Capacitor.convertFileSrc(fileUri.uri)

    setPhotoFileName(fileName)
    setPhotoWebPath(webviewPath)
  }

  const saveEntry = async () => {
    // GPS-Position holen
    const pos = await Geolocation.getCurrentPosition()
    // neuen Eintrag zusammenbauen
    const newEntry: Entry = {
      title,
      description,
      date,
      found,
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      image: photoFileName  // nur der Dateiname
    }
    await dbService.addEntry(newEntry)

    presentToast({ message: 'Eintrag gespeichert', color: 'success', duration: 1500 })
    // Form zurücksetzen
    setTitle('')
    setDescription('')
    setDate(new Date().toISOString())
    setFound(true)
    setPhotoFileName(undefined)
    setPhotoWebPath(undefined)
  }

  return (
    <IonPage className="main">
      <IonHeader
      className="main">
        <IonToolbar>
          <IonTitle>Neuer Eintrag</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding main">
        <IonItem
        className="main">
          <md-outlined-text-field
            label="Titel"
            value={title}
            style={{ width: '100%' , margin: '20px' }}
            onInput={(e: any) => setTitle(e.target.value)}
          />
        </IonItem>
        <IonItem
        className="main">
          <md-outlined-text-field
            label="Beschreibung"
            value={description}
            style={{ width: '100%', margin: '20px' }}
            onInput={(e: any) => setDescription(e.target.value)}
          />
        </IonItem>
        <IonItem
        className="main">
          <IonLabel position="floating">Datum</IonLabel>
          <IonDatetime
          className="main"

            presentation="date-time"
            value={date}
            onIonChange={e => setDate((e as any).detail.value!)}
          />
        </IonItem>
        <IonItem
        className="main">
          <IonLabel>Gefunden?</IonLabel>
          <md-switch
            aria-label="Wi-Fi"

            checked={found} onIonChange={e => setFound(e.detail.checked)} />
        </IonItem>

        <IonItem lines="none"
          className="main"
          >
          <IonButton slot="start" onClick={takePhoto}>
            <IonIcon slot="icon-only" icon={camera} />
          </IonButton>
          {photoWebPath && (
            <IonImg
              src={photoWebPath}
              style={{ width: '80px', height: '80px', marginLeft: '1em' }}
            />
          )}
        </IonItem>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={saveEntry}>
            <IonIcon icon={save} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default EntryFormPage
