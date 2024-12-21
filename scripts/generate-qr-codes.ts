// Load environment variables from .env.local first
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Other imports
import { getAllCandles } from './supabase'
import QRCode from 'qrcode'
import fs from 'fs/promises'
import path from 'path'
import { createCanvas, loadImage } from 'canvas'

const SITE_URL = 'https://thiscandleisforyou.com'
const LABEL_SIZE = 1200 // Size of the circular label
const QR_SIZE = 800    // Size of the QR code within the label

async function createCircularLabel(qrCodePath: string, candleName: string): Promise<Buffer> {
  // Create a canvas for our label
  const canvas = createCanvas(LABEL_SIZE, LABEL_SIZE)
  const ctx = canvas.getContext('2d')

  // Create white circular background
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.arc(LABEL_SIZE / 2, LABEL_SIZE / 2, LABEL_SIZE / 2, 0, Math.PI * 2)
  ctx.fill()

  // Add a subtle border
  ctx.strokeStyle = '#CCCCCC'
  ctx.lineWidth = 2
  ctx.stroke()

  // Load and draw the QR code
  const qrImage = await loadImage(qrCodePath)
  const qrX = (LABEL_SIZE - QR_SIZE) / 2
  const qrY = (LABEL_SIZE - QR_SIZE) / 2 - 40 // Shift up slightly to make room for text
  ctx.drawImage(qrImage, qrX, qrY, QR_SIZE, QR_SIZE)

  // Add the candle name
  ctx.fillStyle = '#333333'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 48px Arial'
  ctx.fillText(candleName, LABEL_SIZE / 2, LABEL_SIZE - 100)

  // Add "scan me" text
  ctx.font = '32px Arial'
  ctx.fillStyle = '#666666'
  ctx.fillText('scan to experience', LABEL_SIZE / 2, LABEL_SIZE - 50)

  // Convert canvas to buffer
  return canvas.toBuffer('image/png')
}

async function generateQRCodes() {
  // Create qr-codes directory if it doesn't exist
  const qrDir = path.join(process.cwd(), 'qr-codes')
  await fs.mkdir(qrDir, { recursive: true })

  // Create temp directory for intermediate files
  const tempDir = path.join(process.cwd(), 'temp-qr')
  await fs.mkdir(tempDir, { recursive: true })

  // Get all candles
  const candles = await getAllCandles()
  console.log(`Found ${candles.length} candles`)

  // Generate QR code for each candle
  for (const candle of candles) {
    const candleUrl = `${SITE_URL}/candle/${candle.id}`
    console.log(`Creating QR code for URL: ${candleUrl}`)
    
    // First generate the QR code
    const tempQRPath = path.join(tempDir, `temp_${candle.id}.png`)
    await QRCode.toFile(tempQRPath, candleUrl, {
      type: 'png',
      width: QR_SIZE,
      margin: 0, // No margin as we'll handle this in the label design
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })

    // Create the final label with the QR code
    const labelBuffer = await createCircularLabel(tempQRPath, candle.name)
    
    // Save the final label
    const fileName = `${candle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${candle.id}.png`
    const filePath = path.join(qrDir, fileName)
    await fs.writeFile(filePath, labelBuffer)

    console.log(`Generated label for ${candle.name}: ${fileName}`)
  }

  // Clean up temp directory
  await fs.rm(tempDir, { recursive: true, force: true })

  console.log('\nAll QR code labels have been generated in the qr-codes directory!')
}

// Run the script
generateQRCodes().catch(console.error) 