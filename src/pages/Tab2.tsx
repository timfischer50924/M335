// src/pages/Tab2.tsx
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonImg,
  IonFab, IonFabButton, IonIcon, IonActionSheet
} from '@ionic/react'
import { camera, trash, close } from 'ionicons/icons'
import { useState } from 'react'
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery'

const Tab2: React.FC = () => {
  const { photos, takePhoto, deletePhoto } = usePhotoGallery()
  const [sheetPhoto, setSheetPhoto] = useState<UserPhoto | null>(null)
  const [showSheet, setShowSheet] = useState(false)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonTitle>Photo Gallery</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {photos.map(photo => (
              <IonCol size="6" key={photo.filepath}>
                <IonImg
                  src={photo.webviewPath}
                  onClick={() => { setSheetPhoto(photo); setShowSheet(true) }}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
        <IonActionSheet
          isOpen={showSheet}
          buttons={[
            {
              text: 'Delete',
              role: 'destructive',
              icon: trash,
              handler: () => {
                deletePhoto(sheetPhoto!)
              }
            },
            { text: 'Cancel', icon: close, role: 'cancel' }
          ]}
          onDidDismiss={() => setShowSheet(false)}
        />
      </IonContent>
    </IonPage>
  )
}

export default Tab2
