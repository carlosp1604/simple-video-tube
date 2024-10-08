export type Resolutions = 'sd' | 'hd' | 'fhd' | '4k'

export const getResolution = (quality: number): string => {
  if (quality < 720) {
    return 'sd'
  }

  if (quality === 720 ||
    (quality > 720 && quality < 1080)) {
    return 'hd'
  }

  if (quality === 1080 ||
    (quality > 1080 && quality < 2160)) {
    return 'fhd'
  }

  return '4k'
}
