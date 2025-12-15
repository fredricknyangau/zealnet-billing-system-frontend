
import React, { useState, useEffect } from 'react'
import { X, Camera, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(true)
  
  // Mock scanning effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate successful scan after 3 seconds
      if (scanning) {
        onScan('VOUCHER-1234-5678')
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [scanning, onScan])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white p-2"
        >
          <X className="h-8 w-8" />
        </button>

        <Card className="bg-transparent border-none shadow-none text-white text-center">
            <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 border-primary mb-4">
                {/* Scanner Overlay */}
                <div className="absolute inset-0 border-[40px] border-black/50 z-10 w-full h-full"></div>
                
                {/* Scanning Line Animation */}
                <motion.div 
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-[10%] right-[10%] h-0.5 bg-primary z-20 shadow-[0_0_8px_rgba(37,99,235,0.8)]"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-700 opacity-20" />
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2">Scan Voucher QR Code</h3>
            <p className="text-gray-300 mb-6">Align the QR code within the frame to scan automatically.</p>
            
            <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => setScanning(true)}
            >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Scanner
            </Button>
        </Card>
      </div>
    </div>
  )
}
