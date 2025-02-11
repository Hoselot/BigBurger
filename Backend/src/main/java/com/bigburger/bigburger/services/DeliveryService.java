package com.bigburger.bigburger.services;

import org.springframework.stereotype.Service;

@Service
public class DeliveryService {

    private static final double LOCAL_LAT = -32.934814453125; // Latitud del local
    private static final double LOCAL_LNG = -68.73741912841797; // Longitud del local
    private static final double MAX_DISTANCE_KM = 4.3; // Distancia máxima en kilómetros

    public boolean isWithinDeliveryRange(double userLat, double userLng) {
        double distance = calculateDistance(LOCAL_LAT, LOCAL_LNG, userLat, userLng);
        return distance <= MAX_DISTANCE_KM;
    }

    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        double earthRadius = 6371; // Radio de la Tierra en kilómetros
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }
}
