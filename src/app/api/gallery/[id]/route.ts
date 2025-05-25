import { drive, GalleryImg } from "@/lib/gallery"
import { NextRequest, NextResponse } from "next/server"

async function getImages(folderId: string): Promise<GalleryImg[]> {
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
    })

    const images = res.data.files

    const imagesOutput: GalleryImg[] = images
      ?.filter(img => img.id)
      .map(image => ({
        src: `https://drive.google.com/thumbnail?id=${image.id}&sz=w500`
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