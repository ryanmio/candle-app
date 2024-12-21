// Load environment variables from .env.local first
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Other imports
import { getAllCandles } from './supabase'
import QRCode from 'qrcode'
import fs from 'fs/promises'
import path from 'path'

const SITE_URL = 'https://thiscandleisforyou.com'

async function generateQRCodes() {
  // Create qr-codes directory if it doesn't exist
  const qrDir = path.join(process.cwd(), 'qr-codes')
  await fs.mkdir(qrDir, { recursive: true })

  // Get all candles
  const candles = await getAllCandles()
  console.log(`Found ${candles.length} candles`)

  // Generate QR code for each candle
  for (const candle of candles) {
    const candleUrl = `${SITE_URL}/candle/${candle.id}`
    console.log(`Creating QR code for URL: ${candleUrl}`)
    
    // Generate QR code PNG
    const fileName = `${candle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${candle.id}.png`
    const filePath = path.join(qrDir, fileName)
    
    await QRCode.toFile(filePath, candleUrl, {
      type: 'png',
      width: 1000,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })

    console.log(`Generated QR code for ${candle.name}: ${fileName}`)
  }

  console.log('\nAll QR codes have been generated in the qr-codes directory!')
}

// Run the script
generateQRCodes().catch(console.error) 