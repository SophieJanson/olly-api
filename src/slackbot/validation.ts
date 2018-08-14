import * as crypto from 'crypto'
import * as moment from 'moment'

const secret = process.env.SIGNING_SECRET || "Enter secret string"
moment().format()
const currentTime = moment()
export const validateSlackMessage = (rawBody: string, signature: string, requestTimestamp: string): boolean => {
  if(currentTime.diff(requestTimestamp, 'seconds') > 300) return false //return false if request is older than 5 minutes
  let signatureBaseString = 'v0:' + requestTimestamp + ':' + rawBody
  return compare(hash(signatureBaseString), signature)
}

const hash = (signatureBaseString) => {
  return "v0=" + crypto.createHmac('sha256', secret).update(signatureBaseString).digest("hex")
}

const compare = (hash, signature) => {
  return hash === signature
}