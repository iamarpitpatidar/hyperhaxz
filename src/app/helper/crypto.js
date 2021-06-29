import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'
import { cryptoSecret, jwtSecret } from '../../config'

const ALGORITHM = {
  BLOCK_CIPHER: 'aes-256-gcm',
  AUTH_TAG_BYTE_LEN: 16,
  IV_BYTE_LEN: 12,
  KEY_BYTE_LEN: 32,
  SALT_BYTE_LEN: 16
}
const key = scryptSync(cryptoSecret, jwtSecret, 32)
const getIV = () => randomBytes(ALGORITHM.IV_BYTE_LEN)

export const encrypt = message => {
  const IV = getIV()
  const cipher = createCipheriv(ALGORITHM.BLOCK_CIPHER, key, IV, { authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN })
  let encryptedMessage = cipher.update(message)
  encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()])

  return Buffer.concat([IV, encryptedMessage, cipher.getAuthTag()]).toString('hex')
}

export const decrypt = cipher => {
  const authTag = cipher.slice(-16)
  const IV = cipher.slice(0, 12)
  const encryptedMessage = cipher.slice(12, -16)

  const decipher = createDecipheriv(ALGORITHM.BLOCK_CIPHER, key, IV, { authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN })
  decipher.setAuthTag(authTag)
  const message = decipher.update(encryptedMessage)

  return Buffer.concat([message, decipher.final()]).toString('utf8')
}
