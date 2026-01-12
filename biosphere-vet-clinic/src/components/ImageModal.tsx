import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, ZoomIn, ZoomOut, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
  specialistName: string
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt, specialistName }: ImageModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageSrc
    link.download = `${specialistName.replace(/\s+/g, '_')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  if (isMobile) {
    return null
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent data-overlay="none" className="p-0 bg-transparent border-0 shadow-none max-w-none">
        <div className="relative w-screen h-screen flex items-center justify-center">
          <div
            className="relative w-[75vmin] h-[75vmin] max-w-[90vw] max-h-[80vh] rounded-full overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-0 m-auto object-cover transition-transform duration-200 select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />

            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <Button size="icon" variant="secondary" onClick={handleZoomOut} disabled={scale <= 0.5} className="rounded-full bg-white/80 text-black hover:bg-white">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={handleZoomIn} disabled={scale >= 3} className="rounded-full bg-white/80 text-black hover:bg-white">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={handleDownload} className="rounded-full bg-white/80 text-black hover:bg-white">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={onClose} className="rounded-full bg-white/80 text-black hover:bg-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/40 text-white px-3 py-1 rounded-full text-sm">
              {Math.round(scale * 100)}%
            </div>
            <div className="absolute top-3 left-3 bg-black/40 text-white px-3 py-1 rounded-full text-sm">
              {specialistName}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
