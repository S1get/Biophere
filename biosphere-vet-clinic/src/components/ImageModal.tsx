import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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

  // Touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-black/90 border-0 shadow-none max-w-none w-screen h-screen flex flex-col items-center justify-center sm:rounded-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Просмотр фото специалиста: {specialistName}</DialogTitle>
          <DialogDescription>Увеличенное изображение специалиста с возможностью масштабирования и скачивания</DialogDescription>
        </DialogHeader>
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <Button size="icon" variant="secondary" onClick={handleDownload} className="rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md">
            <Download className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="secondary" onClick={onClose} className="rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div 
          className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt={imageAlt}
            className="max-w-[95vw] max-h-[85vh] object-contain transition-transform duration-200 select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
            onClick={() => scale === 1 ? handleZoomIn() : setScale(1)}
            draggable={false}
          />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/50 backdrop-blur-xl rounded-full border border-white/10">
          <Button size="icon" variant="ghost" onClick={handleZoomOut} disabled={scale <= 0.5} className="text-white hover:bg-white/20">
            <ZoomOut className="h-5 w-5" />
          </Button>
          <span className="text-white font-medium min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button size="icon" variant="ghost" onClick={handleZoomIn} disabled={scale >= 5} className="text-white hover:bg-white/20">
            <ZoomIn className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute top-6 left-6 text-white/80 font-medium hidden sm:block">
          {specialistName}
        </div>
      </DialogContent>
    </Dialog>
  )
}
