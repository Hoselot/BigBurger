package com.bigburger.bigburger.services;

import com.bigburger.bigburger.exeptions.BurgerNotFoundException;
import com.bigburger.bigburger.models.*;
import com.bigburger.bigburger.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private IDetallePedidoRepository detallePedidoRepository;
    @Autowired
    private IBurgerRepository burgerRepository;
    @Autowired
    private IPapasRepository papasRepository;
    @Autowired
    private IBebidaRepository bebidaRepository;
    @Autowired
    private PedidoRepository pedidoRepository;

    public PedidoModel crearPedido(String nombre, String apellido, String telefono, String gmail,
                                   BigDecimal delivery, List<DetallePedidoModel> detallePedido) {
        PedidoModel pedidoModel = new PedidoModel();

        pedidoModel.setGananciaTotal(BigDecimal.ZERO);
        pedidoModel.setPrecioTotal(BigDecimal.ZERO);
        pedidoModel.setCostoTotal(BigDecimal.ZERO);

        pedidoModel.setCliente(nombre + " " + apellido);
        pedidoModel.setContacto("TELEFONO: " + telefono + " GMAIL: " + gmail);
        pedidoModel.setDelivery(delivery);
        pedidoModel.setFecha(LocalDate.now());

        for (DetallePedidoModel detalle : detallePedido) {
            // Buscar la hamburguesa
            BurgerModel burgerModel = burgerRepository.findBurgerByName(detalle.getNombreHamburguesa())
                    .orElseThrow(() -> new BurgerNotFoundException("Hamburguesa no encontrada"));

            // Buscar papas y bebida (pueden ser null)
            PapasModel papasModel = Optional.ofNullable(detalle.getNombrePapas())
                    .flatMap(papasRepository::findPapasByName)
                    .orElse(null);

            BebidaModel bebidaModel = Optional.ofNullable(detalle.getNombreBebida())
                    .flatMap(bebidaRepository::findBebidaByName)
                    .orElse(null);

            // Asignar nombres a los detalles
            detalle.setNombreHamburguesa(burgerModel.getName());
            detalle.setNombrePapas(papasModel != null ? papasModel.getName() : "No compró");
            detalle.setNombreBebida(bebidaModel != null ? bebidaModel.getName() : "No compró");

            // Calcular costo y ganancia evitando null
            BigDecimal costo = burgerModel.getCosto()
                    .add(papasModel != null ? papasModel.getCosto() : BigDecimal.ZERO)
                    .add(bebidaModel != null ? bebidaModel.getCosto() : BigDecimal.ZERO);

            BigDecimal ganancia = burgerModel.getGanancia()
                    .add(papasModel != null ? papasModel.getGanancia() : BigDecimal.ZERO)
                    .add(bebidaModel != null ? bebidaModel.getGanancia() : BigDecimal.ZERO);

            BigDecimal precio = burgerModel.getPrice()
                    .add(papasModel != null ? papasModel.getPrice() : BigDecimal.ZERO)
                    .add(bebidaModel != null ? bebidaModel.getPrice() : BigDecimal.ZERO);

            // Asignar valores al detalle
            detalle.setGananciaUnitaria(ganancia);
            detalle.setCosto(costo.multiply(BigDecimal.valueOf(detalle.getCantidad())));
            detalle.setPrecioUnitario(precio);

            // Evitar null en los cálculos de totales
            detalle.setGananciaTotal(ganancia.multiply(BigDecimal.valueOf(detalle.getCantidad())));
            detalle.setPrecioTotal(burgerModel.getPrice().multiply(BigDecimal.valueOf(detalle.getCantidad())));

            // Actualizar el pedido con los nuevos valores
            pedidoModel.setGananciaTotal(
                    pedidoModel.getGananciaTotal().add(detalle.getGananciaTotal())
            );
            pedidoModel.setPrecioTotal(
                    pedidoModel.getPrecioTotal().add(detalle.getPrecioTotal())
            );
            pedidoModel.setCostoTotal(
                    pedidoModel.getCostoTotal().add(detalle.getCosto())
            );

            // Asignar el pedido al detalle
            detalle.setPedido(pedidoModel);
        }

        pedidoModel.setDetalles(detallePedido);

        return pedidoModel;
    }

    public List<PedidoModel> listarAllPedidos(){
        return pedidoRepository.findAll();
    }




}
