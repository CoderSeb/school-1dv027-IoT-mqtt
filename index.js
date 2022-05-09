import { InfluxDB, Point } from '@influxdata/influxdb-client'
import dotenv from 'dotenv'
import mqtt from 'mqtt'

dotenv.config()

const main = () => {
  const token = process.env.INFLUXDB_TOKEN
const url = 'https://eu-central-1-1.aws.cloud2.influxdata.com'

const influxClient = new InfluxDB({url, token})

const host = '18.195.54.50'
const port = 1883
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectionUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectionUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 1000,
})

const topic = 'terraTemps'

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})
client.on('message', (topic, payload) => {
  const sensor = payload.toString().split('--')[0]
  const value = payload.toString().split('--')[1]
  console.log(`Message received: ${sensor} - ${value}`)
  let org = process.env.INFLUX_ORG
  let bucket = `terra_temps`

  let writeClient = influxClient.getWriteApi(org, bucket, 'ns')

  let point = new Point('mem').floatField(sensor, value)
  writeClient.writePoint(point)
})
}

try {
  main()
} catch (err) {
  console.error(err.message)
}

