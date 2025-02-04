import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LocationPicker: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const mapRef = useRef<L.Map | null>(null); // Referencia al mapa
    const userMarkerRef = useRef<L.Marker | null>(null); // Referencia al marcador de "Tu ubicación"

    // Función para obtener la ubicación del usuario
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newUserLocation = { lat: latitude, lng: longitude };
                    setUserLocation(newUserLocation);

                    // Actualizar selectedLocation con la nueva ubicación del usuario
                    setSelectedLocation(newUserLocation);

                    // Centrar el mapa en la nueva ubicación
                    if (mapRef.current) {
                        mapRef.current.setView([newUserLocation.lat, newUserLocation.lng], 14);

                        // Eliminar el marcador de "Tu ubicación" anterior si existe
                        if (userMarkerRef.current) {
                            mapRef.current.removeLayer(userMarkerRef.current);
                        }

                        // Agregar un nuevo marcador en la nueva ubicación del usuario
                        const newUserMarker = L.marker([newUserLocation.lat, newUserLocation.lng])
                            .addTo(mapRef.current)
                            .bindPopup('Tu ubicación')
                            .openPopup();
                        userMarkerRef.current = newUserMarker; // Guardar el nuevo marcador en la referencia

                        // Generar el enlace de Google Maps
                        const link = `https://www.google.com/maps?q=${newUserLocation.lat},${newUserLocation.lng}`;
                        setGoogleMapsLink(link);
                    }
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                    alert('No se pudo obtener tu ubicación. Asegúrate de permitir el acceso a la geolocalización.');
                }
            );
        } else {
            console.error('Geolocalización no es soportada por este navegador.');
            alert('Tu navegador no soporta geolocalización.');
        }
    };

    useEffect(() => {
        // Configurar el mapa
        const leafletMap = L.map('map').setView([-32.934814453125, -68.73741912841797], 14); // Ubicación inicial del local

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(leafletMap);

        // Guardar la referencia del mapa
        mapRef.current = leafletMap;

        // Manejar clics en el mapa
        leafletMap.on('click', (event: L.LeafletMouseEvent) => {
            const { lat, lng } = event.latlng;
            setSelectedLocation({ lat, lng });

            // Generar el enlace de Google Maps
            const link = `https://www.google.com/maps?q=${lat},${lng}`;
            setGoogleMapsLink(link);

            // Limpiar marcadores anteriores (excepto el de la ubicación del usuario)
            leafletMap.eachLayer((layer) => {
                if (layer instanceof L.Marker && layer !== userMarkerRef.current) {
                    leafletMap.removeLayer(layer);
                }
            });

            // Agregar un marcador en la ubicación seleccionada
            L.marker([lat, lng]).addTo(leafletMap);
        });

        return () => {
            leafletMap.remove();
        };
    }, []);

    const handleConfirmLocation = () => {
        if (selectedLocation) {
            // Enviar la ubicación al backend
            fetch('http://localhost:8080/api/delivery/check-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
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