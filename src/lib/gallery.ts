import { google } from "googleapis"

// set the width of images obtained from the api
const IMAGE_SIZE = "1000"

export interface GalleryFolder {
  src: string
  caption: string
  id: string
}

export interface GalleryImg {
  src: string
  viewUrl: string
}

const client_email = process.env.GOOGLE_CLIENT_EMAIL
const private_key = process.env.GOOGLE_PRIVATE_KEY

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email,
    private_key
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
})

export const drive = google.drive({ 
    version: "v3", 
    auth
})

export function getThumbnailUrl(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${IMAGE_SIZE}`
}

export function getViewUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/view`
}
