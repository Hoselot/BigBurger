package com.bigburger.bigburger.controllers;

import com.bigburger.bigburger.models.DetallePedidoModel;
import com.bigburger.bigburger.services.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
@RestController
@RequestMapping("/compra")
public class CompraController {

    @Autowired
    private CompraService compraService;

    @PostMapping("/crearPedido")
    public String crearPedido(@RequestParam String nombre, @RequestParam String apellido, @RequestParam String telefono, @RequestParam String gmail,
                                                   @RequestParam BigDecimal delivery, @RequestBody List<DetallePedidoModel> detallePedido) throws Exception{
        return compraService.RealizarCompraMP(nombre,apellido,telefono,gmail,delivery,detallePedido);
    }
}
