export interface FragmentGradient {
  colors: string[]
  angle: number
}

export interface Fragment {
  text: string
  size?: number
  weight?: number
  color?: string
  gradient?: FragmentGradient
  style?: 'normal' | 'italic'
  offsetX?: number
  offsetY?: number
}

export interface Line {
  indent?: number
  alignment?: 'left' | 'center' | 'right'
  spacing?: number
  fragments: Fragment[]
}

export interface Stanza {
  spacingAfter?: number
  lines: Line[]
}

export interface SolidBackground {
  type: 'solid'
  color: string
  opacity?: number
}

export interface GradientBackground {
  type: 'gradient'
  colors: string[]
  angle?: number
  opacity?: number
}

export interface ImageBackground {
  type: 'image'
  url: string
  fit?: 'cover' | 'contain' | 'repeat'
  opacity?: number
}

export interface ShapeBackground {
  type: 'shape'
  shape: 'circle' | 'rect' | 'line'
  x: number
  y: number
  width?: number
  height?: number
  color: string
  opacity?: number
}

export interface TextureBackground {
  type: 'texture'
  texture: 'paper' | 'grain' | 'noise'
  opacity?: number
}

export type BackgroundLayer = SolidBackground | GradientBackground | ImageBackground | ShapeBackground | TextureBackground

export interface Canvas {
  width: number
  height?: number | 'auto'
  background?: string
}

export interface Poem {
  meta?: {
    title?: string
    author?: string
  }
  canvas?: Canvas
  stanzas: Stanza[]
  backgrounds?: BackgroundLayer[]
}

// Computed layout types
export interface ComputedFragment extends Fragment {
  x: number
  y: number
  width: number
  height: number
}

export interface ComputedLine {
  fragments: ComputedFragment[]
  y: number
  height: number
  alignment: 'left' | 'center' | 'right'
}

export interface ComputedStanza {
  lines: ComputedLine[]
  y: number
  height: number
}

export interface ComputedLayout {
  width: number
  height: number
  stanzas: ComputedStanza[]
  backgrounds: BackgroundLayer[]
  canvas: Required<Canvas>
}
