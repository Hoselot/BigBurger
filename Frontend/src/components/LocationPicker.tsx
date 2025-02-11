import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { URLBASE } from "../utils/VariablesAndMethods";

const LocationPicker: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // Referencia al contenedor del mapa
    const mapRef = useRef<L.Map | null>(null); // Referencia al mapa
    const userMarkerRef = useRef<L.Marker | null>(null); // Referencia al marcador de "Tu ubicación"
    const localMarkerRef = useRef<L.Marker | null>(null); // Referencia al marcador de "¡Estamos aquí!"

    const deliveryZones = [
        {
            name: "Zona 1",
            coordinates: [
                [-32.93, -68.74], // Vértice 1
                [-32.93, -68.73], // Vértice 2
                [-32.935, -68.72], // Vértice 3 (punto adicional)
                [-32.94, -68.73], // Vértice 4
                [-32.94, -68.74], // Vértice 5
                [-32.935, -68.75], // Vértice 6 (punto adicional)
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
            <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }}></div>
            <button onClick={getUserLocation} style={{ margin: '10px' }}>
                Obtener Mi Ubicación
            </button>
            <button onClick={handleConfirmLocation} disabled={!selectedLocation}>
                Confirmar Ubicación
            </button>
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
