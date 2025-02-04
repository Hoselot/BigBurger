package com.bigburger.bigburger.controllers;

import com.bigburger.bigburger.models.Location;
import com.bigburger.bigburger.services.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @PostMapping("/check-location")
    public String checkLocation(@RequestBody Location userLocation) {
        boolean isWithinRange = deliveryService.isWithinDeliveryRange(
                userLocation.getLat(),
                userLocation.getLng()
        );
        return "{ \"isWithinRange\": " + isWithinRange + " }";
    }
}
