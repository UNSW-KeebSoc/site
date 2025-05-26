import { NextResponse } from 'next/server'
import { drive, GalleryFolder, getThumbnailUrl } from "@/lib/gallery"

async function getFolders(): Promise<GalleryFolder[]> {
  try {
    const res = await drive.files.list({
      q: `mimeType = 'application/vnd.google-apps.folder' and not name = 'PhotosTest'`
    })

    const folders = res.data.files ?? []

    const foldersOutput = await Promise.all(
      folders.map(async (folder) => {
        const imageRes = await drive.files.list({
          q: `'${folder.id}' in parents and mimeType contains 'image/'`,
          pageSize: 1
        });

        const firstImage = imageRes.data.files?.[0];

        const id = folder.id ?? ''
        const caption = folder.name ?? ''
        const src = firstImage?.id
            ? `${getThumbnailUrl(firstImage.id)}`
            : ''

        return {
          id,
          caption,
          src
        };
      })
    )

    return foldersOutput
  } catch (error) {
    return []
  }
}

export async function GET() {
    try {
        const folders = await getFolders()
        return NextResponse.json(folders)
    } catch (error) {
        return NextResponse.json(
            { message: `Error fetching image folders` },
            { status: 500 }
        )
    }
}
