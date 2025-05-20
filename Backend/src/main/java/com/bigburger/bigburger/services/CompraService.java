package com.bigburger.bigburger.services;

import com.bigburger.bigburger.models.DetallePedidoModel;
import com.bigburger.bigburger.models.PedidoModel;
import com.bigburger.bigburger.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CompraService {

    @Autowired
    private MercadoPagoService mercadoPagoService;
    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private PedidoRepository pedidoRepository;

    public String RealizarCompra(String nombre, String apellido, String telefono, String gmail,
                                 BigDecimal delivery, List<DetallePedidoModel> detallePedido) throws Exception{
        PedidoModel pedidoModel = pedidoService.crearPedido(nombre,apellido,telefono,gmail,delivery,detallePedido);
        pedidoRepository.save(pedidoModel);
        return mercadoPagoService.crearPreferenciaDePago(nombre,apellido,telefono,gmail,pedidoModel);
    }

}
