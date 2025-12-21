
import React, { useState, useEffect, useRef } from 'react'
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import jsQR from 'jsqr'

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // Use back camera on mobile
        })

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop())
          return
        }

        streamRef.current = stream
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setHasCamera(true)
          setError(null)
          // Start scanning after video starts playing
          videoRef.current.addEventListener('loadedmetadata', () => {
            if (mounted) scanQRCode()
          })
        }
      } catch (err) {
        console.error('Camera access error:', err)
        setHasCamera(false)
        setError('Unable to access camera. Please check permissions.')
        
        // Fallback to mock scan for demo
        setTimeout(() => {
          if (scanning && mounted) {
            onScan('VOUCHER-DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase())
          }
        }, 3000)
      }
    }

    const scanQRCode = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      if (!video || !canvas || !scanning || !mounted) return

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      const scan = () => {
        if (!mounted || !scanning) return

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          })

          if (code && code.data) {
            // Found QR code!
            setScanning(false)
            stopCamera()
            onScan(code.data)
            return
          }
        }

        // Continue scanning
        animationFrameRef.current = requestAnimationFrame(scan)
      }

      scan()
    }

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    if (scanning) {
      startCamera()
    }

    return () => {
      mounted = false
      stopCamera()
    }
  }, [scanning, onScan])

  const handleReset = () => {
    setScanning(false)
    setError(null)
    setTimeout(() => setScanning(true), 100)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close scanner"
        >
          <X className="h-8 w-8" />
        </button>

        <Card className="bg-transparent border-none shadow-none text-white text-center">
          <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 border-primary mb-4">
            {/* Video Stream */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Hidden canvas for QR detection */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanner Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/50 z-10" />
            
            {/* Scanning Line Animation */}
            {scanning && hasCamera && (
              <motion.div 
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute left-[10%] right-[10%] h-0.5 bg-primary z-20 shadow-[0_0_8px_rgba(37,99,235,0.8)]"
              />
            )}

            {/* Corner Markers */}
            <div className="absolute top-[10%] left-[10%] w-8 h-8 border-t-4 border-l-4 border-primary z-20" />
            <div className="absolute top-[10%] right-[10%] w-8 h-8 border-t-4 border-r-4 border-primary z-20" />
            <div className="absolute bottom-[10%] left-[10%] w-8 h-8 border-b-4 border-l-4 border-primary z-20" />
            <div className="absolute bottom-[10%] right-[10%] w-8 h-8 border-b-4 border-r-4 border-primary z-20" />

            {/* Placeholder when no camera */}
            {!hasCamera && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <Camera className="h-12 w-12 text-gray-700" />
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2">Scan Voucher QR Code</h3>
          <p className="text-gray-300 mb-2">
            {hasCamera 
              ? 'Align the QR code within the frame to scan automatically.'
              : 'Camera not available. Using demo mode.'}
          </p>
          
          {error && (
            <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            onClick={handleReset}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Scanner
          </Button>
        </Card>
      </div>
    </div>
  )
}
