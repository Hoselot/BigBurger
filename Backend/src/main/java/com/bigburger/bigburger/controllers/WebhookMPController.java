package com.bigburger.bigburger.controllers;
import com.bigburger.bigburger.services.CompraService;
import com.bigburger.bigburger.services.PedidoService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/webhook")
public class WebhookMPController {
    @Autowired
    CompraService compraService;
    @Autowired
    PedidoService pedidoService;

    @PostMapping("/mercadopago")
    public ResponseEntity<String> recibirNotificacion(HttpServletRequest request) throws MPException, MPApiException {
        System.out.println("== 📩 LLEGÓ UN WEBHOOK DE MERCADO PAGO ==");

        String rawBody;
        try {
            byte[] bodyBytes = request.getInputStream().readAllBytes();
            rawBody = new String(bodyBytes, StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.out.println("❌ Error leyendo el cuerpo del request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al leer el cuerpo");
        }

        System.out.println("📦 Body recibido:");
        System.out.println(rawBody);

        // 🔍 Parsear JSON con Jackson
        ObjectMapper mapper = new ObjectMapper();
        Long paymentId;
        try {
            JsonNode root = mapper.readTree(rawBody);
            JsonNode dataNode = root.get("data");
            if (dataNode != null && dataNode.has("id")) {
                paymentId = dataNode.get("id").asLong();
            } else {
                System.out.println("❌ No se encontró el campo data.id");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Falta data.id");
            }
        } catch (Exception e) {
            System.out.println("❌ Error parseando el JSON");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al parsear JSON");
        }

        System.out.println("🔎 ID de pago extraído del webhook: " + paymentId);

        // 🔗 Consultar el estado del pago usando la SDK de Mercado Pago
        PaymentClient client = new PaymentClient();
        Payment payment = client.get(paymentId);

        System.out.println("✅ Estado del pago: " + payment.getStatus()); // approved, cancelled, etc.
        System.out.println(payment.getExternalReference());
        System.out.println("💲 Monto pagado: " + payment.getTransactionAmount());

        String resultado = compraService.confirmarCompraMP(payment.getStatus(), payment.getExternalReference());
        pedidoService.borrarPedidoMPPendientePorExternalReference(payment.getExternalReference());
        System.out.println("✅ Resultado confirmarCompra: " + resultado);
        return ResponseEntity.ok(resultado);
    }
}
