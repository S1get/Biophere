import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, ZoomIn, ZoomOut } from 'lucide-react'
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh] p-0 bg-black/95 border-0">
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Кнопки управления */}
          <div className="absolute top-6 right-6 z-50 flex gap-3">
            <Button
              size="lg"
              variant="secondary"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 w-12 p-0"
            >
              <ZoomOut className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 w-12 p-0"
            >
              <ZoomIn className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleDownload}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 w-12 p-0"
            >
              <Download className="h-6 w-6" />
            </Button>

          </div>

          {/* Информация о специалисте */}
          <div className="absolute top-6 left-6 z-50 bg-black/60 text-white px-4 py-3 rounded-lg">
            <p className="text-lg font-medium">{specialistName}</p>
          </div>

          {/* Масштаб */}
          <div className="absolute bottom-6 left-6 z-50 bg-black/60 text-white px-4 py-3 rounded-lg">
            <p className="text-lg font-medium">{Math.round(scale * 100)}%</p>
          </div>

          {/* Изображение */}
          <div
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
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
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}