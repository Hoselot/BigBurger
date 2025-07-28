package com.bigburger.bigburger.services;

import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.models.DetallePedidoModel;
import com.bigburger.bigburger.models.DetallePedidoPendienteModel;
import com.bigburger.bigburger.models.PedidoModel;
import com.bigburger.bigburger.models.PedidoPendienteModel;
import com.bigburger.bigburger.repository.IPedidoPendienteRepository;
import com.bigburger.bigburger.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Random;

@Service
public class CompraService {

    @Autowired
    private MercadoPagoService mercadoPagoService;
    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private IPedidoPendienteRepository iPedidoPendienteRepository;

    public String RealizarCompraMP(String nombre, String apellido, String telefono, String gmail,
                                 BigDecimal delivery, List<DetallePedidoModel> detallePedido) throws Exception{
        PedidoModel pedidoModel = pedidoService.crearPedido(nombre,apellido,telefono,gmail,delivery,detallePedido);


        // 🔐 Generar external_reference cifrado
        String fecha = pedidoModel.getFecha().toString(); // Por ejemplo: "2025-06-24T20:15:00"
        int numeroAleatorio = new Random().nextInt(999999); // Número entre 0 y 999999
        String texto = fecha + "-" + numeroAleatorio; // "2025-06-24T20:15:00-123456"
        // Codificar en Base64
        String externalReference = Base64.getEncoder().encodeToString(texto.getBytes(StandardCharsets.UTF_8));

        PedidoPendienteModel pedidoPendienteModel = new PedidoPendienteModel();
        List<DetallePedidoPendienteModel> detallesPedidoPendienteModel = new ArrayList<>();
        for(DetallePedidoModel detallePedidoModel : pedidoModel.getDetalles()){
            DetallePedidoPendienteModel detallePedidoPendienteModel = new DetallePedidoPendienteModel();
            detallePedidoPendienteModel.setNombreBebida(detallePedidoModel.getNombreBebida());
            detallePedidoPendienteModel.setNombrePapas(detallePedidoModel.getNombrePapas());
            detallePedidoPendienteModel.setNombreHamburguesa(detallePedidoModel.getNombreHamburguesa());
            detallePedidoPendienteModel.setCantidad(detallePedidoModel.getCantidad());
            detallePedidoPendienteModel.setPrecioUnitario(detallePedidoModel.getPrecioUnitario());
            detallePedidoPendienteModel.setPrecioTotal(detallePedidoModel.getPrecioTotal());
            detallePedidoPendienteModel.setGananciaTotal(detallePedidoModel.getGananciaTotal());
            detallePedidoPendienteModel.setGananciaUnitaria(detallePedidoModel.getGananciaUnitaria());
            detallePedidoPendienteModel.setCosto(detallePedidoModel.getCosto());
            detallePedidoPendienteModel.setPedido(pedidoPendienteModel);
            detallesPedidoPendienteModel.add(detallePedidoPendienteModel);
        }
        pedidoPendienteModel.setDetalles(detallesPedidoPendienteModel);
        pedidoPendienteModel.setCliente(pedidoModel.getCliente());
        pedidoPendienteModel.setContacto(pedidoModel.getContacto());
        pedidoPendienteModel.setPrecioTotal(pedidoModel.getPrecioTotal());
        pedidoPendienteModel.setGananciaTotal(pedidoModel.getGananciaTotal());
        pedidoPendienteModel.setCostoTotal(pedidoModel.getCostoTotal());
        pedidoPendienteModel.setDelivery(pedidoModel.getDelivery());
        pedidoPendienteModel.setFecha(pedidoModel.getFecha());
        pedidoPendienteModel.setTransferencia(true);
        pedidoPendienteModel.setExternalReference(externalReference);
        iPedidoPendienteRepository.save(pedidoPendienteModel);

        return mercadoPagoService.crearPreferenciaDePago(nombre,apellido,telefono,gmail,pedidoModel, externalReference);
    }
    public void RealizarCompraLocal(String nombre, String apellido, String telefono, String gmail,
                                   BigDecimal delivery, List<DetallePedidoModel> detallePedido) throws Exception{
        PedidoModel pedidoModel = pedidoService.crearPedido(nombre,apellido,telefono,gmail,delivery,detallePedido);

        String externalReference = "0000000000000000000";

        PedidoPendienteModel pedidoPendienteModel = new PedidoPendienteModel();
        List<DetallePedidoPendienteModel> detallesPedidoPendienteModel = new ArrayList<>();
        for(DetallePedidoModel detallePedidoModel : pedidoModel.getDetalles()){
            DetallePedidoPendienteModel detallePedidoPendienteModel = new DetallePedidoPendienteModel();
            detallePedidoPendienteModel.setNombreBebida(detallePedidoModel.getNombreBebida());
            detallePedidoPendienteModel.setNombrePapas(detallePedidoModel.getNombrePapas());
            detallePedidoPendienteModel.setNombreHamburguesa(detallePedidoModel.getNombreHamburguesa());
            detallePedidoPendienteModel.setCantidad(detallePedidoModel.getCantidad());
            detallePedidoPendienteModel.setPrecioUnitario(detallePedidoModel.getPrecioUnitario());
            detallePedidoPendienteModel.setPrecioTotal(detallePedidoModel.getPrecioTotal());
            detallePedidoPendienteModel.setGananciaTotal(detallePedidoModel.getGananciaTotal());
            detallePedidoPendienteModel.setGananciaUnitaria(detallePedidoModel.getGananciaUnitaria());
            detallePedidoPendienteModel.setCosto(detallePedidoModel.getCosto());
            detallePedidoPendienteModel.setPedido(pedidoPendienteModel);
            detallesPedidoPendienteModel.add(detallePedidoPendienteModel);
        }
        pedidoPendienteModel.setDetalles(detallesPedidoPendienteModel);
        pedidoPendienteModel.setCliente(pedidoModel.getCliente());
        pedidoPendienteModel.setContacto(pedidoModel.getContacto());
        pedidoPendienteModel.setPrecioTotal(pedidoModel.getPrecioTotal());
        pedidoPendienteModel.setGananciaTotal(pedidoModel.getGananciaTotal());
        pedidoPendienteModel.setCostoTotal(pedidoModel.getCostoTotal());
        pedidoPendienteModel.setDelivery(pedidoModel.getDelivery());
        pedidoPendienteModel.setFecha(pedidoModel.getFecha());
        pedidoPendienteModel.setTransferencia(false);
        pedidoPendienteModel.setExternalReference(externalReference);
        iPedidoPendienteRepository.save(pedidoPendienteModel);
    }

    public String confirmarCompraMP(String paymentStatus, String externalReference) {
        try {
            PedidoPendienteModel pedidoPendienteModel = iPedidoPendienteRepository
                    .findPedidoPendienteModelByExternalReference(externalReference)
                    .orElseThrow(() -> new BurgerNotFoundException("Pedido pendiente no encontrado"));

            if ("approved".equals(paymentStatus)) {
                PedidoModel pedidoModel = new PedidoModel();
                List<DetallePedidoModel> detallesPedidoModels = new ArrayList<>();
                for (DetallePedidoPendienteModel detalle : pedidoPendienteModel.getDetalles()) {
                    DetallePedidoModel nuevoDetalle = new DetallePedidoModel();
                    nuevoDetalle.setNombreBebida(detalle.getNombreBebida());
                    nuevoDetalle.setNombrePapas(detalle.getNombrePapas());
                    nuevoDetalle.setNombreHamburguesa(detalle.getNombreHamburguesa());
                    nuevoDetalle.setCantidad(detalle.getCantidad());
                    nuevoDetalle.setPrecioUnitario(detalle.getPrecioUnitario());
                    nuevoDetalle.setPrecioTotal(detalle.getPrecioTotal());
                    nuevoDetalle.setGananciaTotal(detalle.getGananciaTotal());
                    nuevoDetalle.setGananciaUnitaria(detalle.getGananciaUnitaria());
                    nuevoDetalle.setCosto(detalle.getCosto());
                    nuevoDetalle.setPedido(pedidoModel);
                    detallesPedidoModels.add(nuevoDetalle);
                }

                pedidoModel.setDetalles(detallesPedidoModels);
                pedidoModel.setCliente(pedidoPendienteModel.getCliente());
                pedidoModel.setContacto(pedidoPendienteModel.getContacto());
                pedidoModel.setPrecioTotal(pedidoPendienteModel.getPrecioTotal());
                pedidoModel.setGananciaTotal(pedidoPendienteModel.getGananciaTotal());
                pedidoModel.setCostoTotal(pedidoPendienteModel.getCostoTotal());
                pedidoModel.setDelivery(pedidoPendienteModel.getDelivery());
                pedidoModel.setFecha(pedidoPendienteModel.getFecha());
                pedidoModel.setTransferencia(pedidoPendienteModel.getTransferencia());

                pedidoRepository.save(pedidoModel);
                return "Pedido guardado con éxito";
            } else {
                return "El pago no fue aprobado";
            }
        } catch (Exception e) {
            e.printStackTrace();  // o usá Logger
            return "❌ Error al confirmar la compra: " + e.getMessage();
        }
    }


}
