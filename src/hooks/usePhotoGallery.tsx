// src/hooks/usePhotoGallery.ts
import { useState, useEffect } from 'react'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'
import { isPlatform } from '@ionic/react'
import { Capacitor } from '@capacitor/core'

export interface UserPhoto {
  filepath: string
  webviewPath: string
}

const PHOTO_STORAGE = 'photos'

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([])

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string

    const fetchedBlob = await fetch(photo.webPath!)
    const blob = await fetchedBlob.blob()
    base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1])
      }
      reader.readAsDataURL(blob)
    })

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    })

    const savedUri = isPlatform('hybrid')
      ? (await Filesystem.getUri({ directory: Directory.Data, path: fileName })).uri
      : undefined

    return {
      filepath: savedUri ?? fileName,
      webviewPath: isPlatform('hybrid')
        ? Capacitor.convertFileSrc(savedUri!)
        : photo.webPath!,
    }
  }

  useEffect(() => {
    const loadPhotos = async () => {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE })
      const saved = value ? (JSON.parse(value) as UserPhoto[]) : []

      if (!isPlatform('hybrid')) {
        for (let p of saved) {
          const file = await Filesystem.readFile({
            path: p.filepath,
            directory: Directory.Data,
          })
          p.webviewPath = `data:image/jpeg;base64,${file.data}`
        }
      }

      setPhotos(saved)
    }
    loadPhotos()
  }, [])

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    })
    const fileName = `${new Date().getTime()}.jpeg`
    const savedPhoto = await savePicture(photo, fileName)
    const updated = [savedPhoto, ...photos]
    setPhotos(updated)
    await Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(updated) })
  }

  const deletePhoto = async (target: UserPhoto) => {
    const filtered = photos.filter(p => p.filepath !== target.filepath)
    setPhotos(filtered)
    await Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(filtered) })
    await Filesystem.deleteFile({ path: target.filepath, directory: Directory.Data })
  }

  return { photos, takePhoto, deletePhoto }
}