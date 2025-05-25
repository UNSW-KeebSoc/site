import { google } from "googleapis"

export interface GalleryFolder {
  src: string
  caption: string
  id: string
}

export interface GalleryImg {
  src: string
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
