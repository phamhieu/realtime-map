import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import { RoundToFixDecimals } from "lib/Utils"
import TextLog from "components/TextLog"

function MapView({ supabase, center, zoom }) {
  const [log, setLog] = useState(undefined)
  const [positions, setPositions] = useState([])
  const mySubscription = useRef(false)

  useEffect(() => {
    let newLog = `Start listerning...`
    newLog += positions.map(item => { return `\nuser_id=${item.user_id} lat=${RoundToFixDecimals(item.lat)} long=${RoundToFixDecimals(item.lng)}` })
    setLog(newLog)
  }, [positions])

  useEffect(() => {
    // Listen to INSERT event on locations table
    mySubscription.current = supabase
      .from('locations')
      .on('INSERT', payload => {
        const { new: newItem } = payload
        const { id, user_id, latitude, longitude } = newItem
        console.log('Change received!', payload)
        setPositions([...positions, { id, user_id, lat: latitude, lng: longitude }])
      })
      .subscribe()

    return () => {
      if (mySubscription.current) supabase.removeSubscription(mySubscription.current)
    }
  }, [supabase, positions, setPositions])

  function drawPolyline() {
    const temp = positions.map(item => {
      if (!item) return
      const { lat, lng } = item
      return [lat, lng]
    })
    const polyline = [center, ...temp]
    return <Polyline pathOptions={{ color: 'black' }} positions={polyline} />
  }

  return (
    <div className="map-view">
      <MapContainer center={center} zoom={zoom || 15} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {drawPolyline()}
      </MapContainer>
      <TextLog log={log} />

      <style jsx>{`
        .map-view {
        }
      `}</style>
    </div>
  )
}
export default MapView