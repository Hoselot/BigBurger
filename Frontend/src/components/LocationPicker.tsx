import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { URLBASE } from "../utils/VariablesAndMethods";
import {Button} from "@heroui/button";
const LocationPicker: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null);
   const [, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // Referencia al contenedor del mapa
    const mapRef = useRef<L.Map | null>(null); // Referencia al mapa
    const userMarkerRef = useRef<L.Marker | null>(null); // Referencia al marcador de "Tu ubicación"
    const localMarkerRef = useRef<L.Marker | null>(null); // Referencia al marcador de "¡Estamos aquí!"

    const deliveryZones = [
        {
            name: "Zona 1",
            coordinates: [
                [-32.89662346034667, -68.77789932456129],
                [-32.901507581992554, -68.76025493164758],
                [-32.904412077009404, -68.75685620987294],
                [-32.90645026224326, -68.75248642473413],
                [-32.914256627153534, -68.70055485011285],
                [-32.91246615666039, -68.69878322757617],
                [-32.91530992522329, -68.68735606325892],
                [-32.92391987817451, -68.69469972995054],
                [-32.921328465095876, -68.70410990782719],
                [-32.93709191729003, -68.71372524817191],
                [-32.93897651574459, -68.71658322112863],
                [-32.94426233879463, -68.71907367570212],
                [-32.94742020598245, -68.71979374869488],
                [-32.92922935898916, -68.7961825564889],
                
                [-32.90853994812785, -68.783663018205]
                
        
                
            ],
        },
        // Agrega más zonas según sea necesario
    ];

    // Función para inicializar el mapa
    const initializeMap = () => {
        if (!mapContainerRef.current || mapRef.current) return; // Evitar inicializar varias veces
        
        const leafletMap = L.map(mapContainerRef.current).setView([-32.9348, -68.7374], 14);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(leafletMap);
    
        // Crear un ícono personalizado para el local
        const localIcon = L.icon({
            iconUrl: '/local-icon.png',
            iconSize: [60, 60],
            iconAnchor: [30, 60],
            popupAnchor: [0, -60],
        });
// Desactivar la adición de nuevos puntos al hacer clic en el mapa
        leafletMap.on('click', (event: L.LeafletMouseEvent) => {
            const { lat, lng } = event.latlng;
            setSelectedLocation({ lat, lng });

            const link = `https://www.google.com/maps?q=${lat},${lng}`;
            setGoogleMapsLink(link);

            // Limpiar marcadores anteriores (excepto el de la ubicación del usuario y el del local)
            leafletMap.eachLayer((layer) => {
                if (
                    layer instanceof L.Marker &&
                    layer !== userMarkerRef.current &&
                    layer !== localMarkerRef.current
                ) {
                    leafletMap.removeLayer(layer);
                }
            });

            // Agregar un marcador en la ubicación seleccionada
            L.marker([lat, lng]).addTo(leafletMap);
        });
        // Agregar marcador del local
        const localMarker = L.marker([-32.9348, -68.7374], { icon: localIcon })
            .addTo(leafletMap)
            .bindPopup('¡Estamos aquí!')
            .openPopup();

        localMarkerRef.current = localMarker;
        mapRef.current = leafletMap;
        
        // Agregar las zonas de entrega
        deliveryZones.forEach((zone) => {
            L.polygon(zone.coordinates as L.LatLngTuple[], {
                color: 'blue',
                fillColor: 'lightblue',
                fillOpacity: 0.4,
            }).addTo(leafletMap);
        });
    };

    // useEffect para inicializar el mapa
    useEffect(() => {
        initializeMap();
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Función para obtener la ubicación del usuario
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newUserLocation = { lat: latitude, lng: longitude };
                    setUserLocation(newUserLocation);
                    setSelectedLocation(newUserLocation);

                    if (mapRef.current) {
                        mapRef.current.setView([latitude, longitude], 14);

                        if (userMarkerRef.current) {
                            userMarkerRef.current.remove();
                        }

                        userMarkerRef.current = L.marker([latitude, longitude])
                            .addTo(mapRef.current)
                            .bindPopup('Tu ubicación')
                            .openPopup();

                        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
                        setGoogleMapsLink(link);
                    }
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                    alert('No se pudo obtener tu ubicación. Habilita la geolocalización.');
                }
            );
        } else {
            alert('Tu navegador no soporta geolocalización.');
        }
    };

    // Función para confirmar ubicación
    const handleConfirmLocation = () => {
        if (selectedLocation) {
            fetch(`${URLBASE}/api/delivery/check-location`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedLocation),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.isWithinRange) {
                    alert('¡Ubicación válida! Puedes continuar con tu pedido.');
                } else {
                    alert('Lo sentimos, no realizamos entregas en esta ubicación.');
                }
            })
            .catch((error) => {
                console.error('Error al verificar la ubicación:', error);
            });
        }
    };

    return (
        <div>
            <div ref={mapContainerRef} style={{ height: '800px', width: '100%' }}></div>
            <Button onPressEnd={getUserLocation}>
                Obtener Mi Ubicación
            </Button>
            <Button onPressEnd={handleConfirmLocation} disabled={!selectedLocation}>
                Confirmar Ubicación
            </Button>
            {googleMapsLink && (
                <div>
                    <p>Enlace de Google Maps:</p>
                    <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
                        {googleMapsLink}
                    </a>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
