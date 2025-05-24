import { google } from "googleapis"

export interface GalleryAlbum {
  src: string
  caption: string
}
// todo: figure out how to not have to use a file
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
})

const drive = google.drive({ 
    version: "v3", 
    auth
})

export const getImages = async (folderId: string) => {
  const drive = google.drive({ 
    version: "v3", 
    auth,
  })

  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
    })

    const images = res.data.files

    // change sz param for speed
    return images?.map(image => ({src: `https://drive.google.com/thumbnail?id=${image.id}&sz=w500`}))
  } catch (error: any) {
    console.error("Error fetching images:", error.message)
    return null
  }
}

export const getFolders = async () => {
  try {
    const res = await drive.files.list({
      q: `mimeType = 'application/vnd.google-apps.folder' and not name = 'PhotosTest'`
    })

    const folders = res.data.files

    if (folders) {
      const foldersWithThumbnails = await Promise.all(
        folders.map(async (folder) => {
          const imageRes = await drive.files.list({
            q: `'${folder.id}' in parents and mimeType contains 'image/'`,
            pageSize: 1
          });

          const firstImage = imageRes.data.files?.[0];

          return {
            id: folder.id,
            caption: folder.name,
            src: `https://drive.google.com/uc?export=view&id=${firstImage?.id}` || null,
          };
        })
      )

      return foldersWithThumbnails
    }
  } catch (error: any) {
    console.error("Error fetching folders:", error.message)
    return null
  }
}
