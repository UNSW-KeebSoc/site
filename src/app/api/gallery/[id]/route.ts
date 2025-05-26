import { drive, GalleryImg, getThumbnailUrl, getViewUrl } from "@/lib/gallery"
import { NextRequest, NextResponse } from "next/server"

async function getImages(folderId: string): Promise<GalleryImg[]> {
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
    })

    const images = res.data.files

    const imagesOutput: GalleryImg[] = images
      ?.map(image => ({
        src: `${getThumbnailUrl(image.id ?? '')}`,
        viewUrl: `${getViewUrl(image.id ?? '')}`
      })) ?? []

    return imagesOutput
  } catch (error) {
    return []
  }
}

export async function GET(req: NextRequest, { params }: { params: {id: string}}) {
    const { id } = params 

    try {
        const folders = await getImages(id)
        return NextResponse.json(folders)
    } catch (error) {
        return NextResponse.json(
            { message: `Error fetching images from folder ${id}` },
            { status: 500 }
        )
    }
}