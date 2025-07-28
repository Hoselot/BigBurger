package com.bigburger.bigburger.controllers;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/webhookCancelado")
public class WebhooksController {

    @Value("${mercadopago.webhook.secret}")
    private String secretKey;

    @PostMapping("/mercadopagoCancelado")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> recibirNotificacion(
            @RequestHeader(value = "x-signature", required = false) String signatureHeader,
            HttpServletRequest request) {

        System.out.println("== INICIO WEBHOOK ==");

        if (signatureHeader == null) {
            System.out.println("❌ No se recibió el header x-signature");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Falta x-signature");
        }

        System.out.println("✔️ x-signature recibido: " + signatureHeader);

        // Desglosar ts y v1
        String[] parts = signatureHeader.split(",");
        String ts = null;
        String v1 = null;

        for (String part : parts) {
            if (part.startsWith("ts=")) ts = part.substring(3);
            if (part.startsWith("v1=")) v1 = part.substring(3);
        }

        if (ts == null || v1 == null) {
            System.out.println("❌ Header x-signature incompleto");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Firma inválida (faltan partes)");
        }

        System.out.println("🔍 Timestamp (ts): " + ts);
        System.out.println("🔍 Firma recibida (v1): " + v1);

        // ✅ Leer el body crudo en bytes exactos
        byte[] bodyBytes;
        String rawBody;
        try {
            bodyBytes = request.getInputStream().readAllBytes();
            rawBody = new String(bodyBytes, StandardCharsets.UTF_8);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se pudo leer el cuerpo");
        }

        System.out.println("📦 BODY RAW:");
        System.out.println(rawBody);

        System.out.print("🔬 BODY ASCII: ");
        for (byte b : bodyBytes) {
            System.out.print(b + " ");
        }
        System.out.println();

        String message = ts + "." + rawBody;
        System.out.println("🔐 Mensaje a firmar (ts.body): " + message);

        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hashBytes = sha256_HMAC.doFinal(message.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = bytesToHex(hashBytes);

            System.out.println("🔏 Firma generada: " + expectedSignature);

            if (!expectedSignature.equalsIgnoreCase(v1)) {
                System.out.println("❌ La firma no coincide");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Firma inválida");
            }
        } catch (Exception e) {
            System.out.println("❌ Error generando/verificando firma:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno");
        }

        System.out.println("✅ Firma válida. Webhook recibido correctamente.");
        return ResponseEntity.ok("OK");
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}
