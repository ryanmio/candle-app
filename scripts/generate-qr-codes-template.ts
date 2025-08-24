// Load environment variables from .env.local first
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Other imports
import { getAllGiftItems } from './supabase'
import QRCode from 'qrcode'
import fs from 'fs/promises'
import path from 'path'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourgiftsite.com'

async function generateQRCodes() {
  // Create qr-codes directory if it doesn't exist
  const qrDir = path.join(process.cwd(), 'qr-codes')
  await fs.mkdir(qrDir, { recursive: true })

  // Get all gift items
  const giftItems = await getAllGiftItems()
  console.log(`Found ${giftItems.length} gift items`)

  // Generate QR code for each gift item
  for (const item of giftItems) {
    const itemUrl = `${SITE_URL}/gift-item/${item.id}`
    console.log(`Creating QR code for URL: ${itemUrl}`)
    
    // Generate QR code PNG
    const fileName = `${item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${item.id}.png`
    const filePath = path.join(qrDir, fileName)
    
    await QRCode.toFile(filePath, itemUrl, {
      type: 'png',
      width: 1000,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })

    console.log(`Generated QR code for ${item.name}: ${fileName}`)
  }

  console.log('\nAll QR codes have been generated in the qr-codes directory!')
}

// Run the script
generateQRCodes().catch(console.error) 