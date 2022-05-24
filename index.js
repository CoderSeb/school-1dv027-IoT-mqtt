import { InfluxDB, Point } from '@influxdata/influxdb-client'
import dotenv from 'dotenv'
import mqtt from 'mqtt'

dotenv.config()

const main = () => {
  const token = process.env.INFLUXDB_TOKEN
const url = process.env.INFLUXDB_URL

const influxClient = new InfluxDB({url, token})

const host = process.env.MQTT_HOST
const port = process.env.MQTT_PORT
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

const topics = ['terraTemps/1', 'terraTemps/2']

client.on('connect', () => {
  console.log('Connected')
  client.subscribe(topics, () => {
    console.log(`Subscribe to topics`)
  })
})
client.on('message', (topic, payload) => {
  const sensor = topic
  const value = Number(payload.toString().split(':')[1]).toFixed(2)
  console.log(value)
  console.log(`Message received: ${sensor} - ${payload}`)
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

