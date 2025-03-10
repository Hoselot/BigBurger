package com.bigburger.bigburger.services;
import com.bigburger.bigburger.models.PedidoModel;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.PhoneRequest;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access.token}") // Obtiene el Access Token desde application.properties
    private String accessToken;

    public String crearPreferenciaDePago(String nombre, String apellido, String telefono, String gmail, PedidoModel pedidoModel) throws Exception {
        try {
            // 1️⃣ Configura Mercado Pago con el Access Token
            MercadoPagoConfig.setAccessToken(accessToken);
            // Crear lista de productos a vender
            List<PreferenceItemRequest> items = pedidoModel.getDetalles().stream().map(detalle ->
                    PreferenceItemRequest.builder()
                            .title(detalle.getNombreHamburguesa() + " + " + detalle.getNombreBebida() + " + " + detalle.getNombrePapas())
                            .quantity(detalle.getCantidad())
                            .unitPrice(detalle.getPrecioUnitario())
                            .currencyId("ARS")
                            .build()
            ).collect(Collectors.toList());


            PreferencePayerRequest payerRequest = PreferencePayerRequest.builder()
                    .name(nombre)
                    .surname(apellido)
                    .phone(
                            PhoneRequest.builder()
                                    .number(telefono)
                                    .build()
                    )
                    .email(gmail)
                    .build();

            // 3️⃣ Define las URLs de retorno
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://www.youtube.com/watch?v=AbARVlSrvWg")  // Si el pago se aprueba
                    .failure("https://www.youtube.com/watch?v=AbARVlSrvWg")  // Si el pago falla
                    .pending("https://www.youtube.com/watch?v=AbARVlSrvWg") // Si el pago queda pendiente
                    .build();

            List<PreferencePaymentMethodRequest> excludedPaymentMethods = new ArrayList<>();
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("argencard").build());
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("cabal").build());
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("cmr").build());
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("cencosud").build());
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("cordobesa").build());
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("diners").build());
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("tarshop").build());
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("debcabal").build());
            excludedPaymentMethods.add(PreferencePaymentMethodRequest.builder().id("maestro").build());

            List<PreferencePaymentTypeRequest> excludedPaymentTypes = new ArrayList<>();
            excludedPaymentTypes.add(PreferencePaymentTypeRequest.builder().id("ticket").build());

            PreferencePaymentMethodsRequest paymentMethod = PreferencePaymentMethodsRequest.builder()
                    .excludedPaymentMethods(excludedPaymentMethods)
                    .excludedPaymentTypes(excludedPaymentTypes)
                    .installments(1)
                    .defaultInstallments(1)
                    .build();

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expirationTime = now.plusMinutes(20);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

            String expirationDateFrom = now.atOffset(ZoneOffset.of("-04:00")).format(formatter);
            String expirationDateTo = expirationTime.atOffset(ZoneOffset.of("-04:00")).format(formatter);

            // 4️⃣ Crea la preferencia con el producto y las URLs
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)  // Lista de productos (puedes agregar más)
                    .backUrls(backUrls)    // Agrega las URLs de redirección
                    .payer(payerRequest)
                    .paymentMethods(paymentMethod)
                    //.autoReturn("approved") // Si el pago es aprobado, vuelve automáticamente
                    .build();

            // 5️⃣ Envía la preferencia a Mercado Pago y obtiene el link de pago
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference.getId(); // Retorna la URL de pago
        }catch (MPException | MPApiException e){return e.toString();}
    }
}


