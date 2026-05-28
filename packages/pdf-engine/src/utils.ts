import { getDocument } from 'pdfjs-dist'

export interface PageDimensions {
  width: number
  height: number
}

export async function getPdfPageCount(url: string): Promise<number> {
  const pdf = await getDocument(url).promise
  return pdf.numPages
}

export async function getPdfPageDimensions(
  url: string,
  pageNumber: number,
): Promise<PageDimensions> {
  const pdf = await getDocument(url).promise
  const page = await pdf.getPage(pageNumber)
  const viewport = page.getViewport({ scale: 1 })
  return { width: viewport.width, height: viewport.height }
}
