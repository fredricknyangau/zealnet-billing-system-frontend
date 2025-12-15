import React, { useRef, useEffect, useState } from 'react'
import { Camera, X } from 'lucide-react'
import jsQR from 'jsqr'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (data: string) => void
}

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen) {
      startScanning()
    } else {
      stopScanning()
    }
    return () => {
      stopScanning()
    }
  }, [isOpen])

  const startScanning = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setScanning(true)
        scanQRCode()
      }
    } catch (err) {
      setError('Camera access denied or not available')
      console.error('Camera error:', err)
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scanQRCode)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    // Decode QR code using jsQR
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        stopScanning()
        onScan(code.data)
        onClose()
        return
      }
      requestAnimationFrame(scanQRCode)
    } catch (err) {
      console.error('QR scan error:', err)
      requestAnimationFrame(scanQRCode)
    }
  }

  const handleManualInput = () => {
    const code = prompt('Enter voucher code manually:')
    if (code) {
      onScan(code)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Scan QR Code" size="lg">
      <div className="space-y-4">
        {error ? (
          <div className="text-center py-8">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={handleManualInput} variant="outline">
              Enter Code Manually
            </Button>
          </div>
        ) : (
          <>
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              <canvas ref={canvasRef} className="hidden" />
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-4 border-primary-500 rounded-lg w-64 h-64" />
              </div>
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<X className="h-4 w-4" />}
                />
              </div>
            </div>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Point your camera at a QR code
            </p>
            <Button variant="outline" fullWidth onClick={handleManualInput}>
              Enter Code Manually
            </Button>
          </>
        )}
      </div>
    </Modal>
  )
}

