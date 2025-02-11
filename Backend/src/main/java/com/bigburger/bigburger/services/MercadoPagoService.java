package com.bigburger.bigburger.services;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access.token}") // Obtiene el Access Token desde application.properties
    private String accessToken;

//    public String crearPreferenciaDePago(String titulo, int cantidad, double precio) throws Exception {
//        // 1️⃣ Configura Mercado Pago con el Access Token
//        MercadoPagoConfig.setAccessToken(accessToken);
//
//        // 2️⃣ Crea el producto que se va a vender
//        PreferenceItemRequest item = PreferenceItemRequest.builder()
//                .title(titulo)        // Nombre del producto
//                .quantity(cantidad)   // Cantidad
//                .unitPrice((float) precio) // Precio unitario
//                .currencyId("ARS")    // Moneda (puedes cambiarla a USD, etc.)
//                .build();
//
//        // 3️⃣ Define las URLs de retorno
//        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
//                .success("https://tusitio.com/pago-exitoso")  // Si el pago se aprueba
//                .failure("https://tusitio.com/pago-fallido")  // Si el pago falla
//                .pending("https://tusitio.com/pago-pendiente") // Si el pago queda pendiente
//                .build();
//
//        // 4️⃣ Crea la preferencia con el producto y las URLs
//        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
//                .items(List.of(item))  // Lista de productos (puedes agregar más)
//                .backUrls(backUrls)    // Agrega las URLs de redirección
//                .autoReturn("approved") // Si el pago es aprobado, vuelve automáticamente
//                .build();
//
//        // 5️⃣ Envía la preferencia a Mercado Pago y obtiene el link de pago
//        PreferenceClient client = new PreferenceClient();
//        Preference preference = client.create(preferenceRequest);
//
//        return preference.getInitPoint(); // Retorna la URL de pago
//    }
}


