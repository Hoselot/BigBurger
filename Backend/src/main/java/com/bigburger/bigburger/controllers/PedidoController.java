package com.bigburger.bigburger.controllers;

import com.bigburger.bigburger.models.DetallePedidoModel;
import com.bigburger.bigburger.models.PedidoModel;
import com.bigburger.bigburger.services.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/crearPedido")
    @PreAuthorize("hasAuthority('CREATE')")
    public ResponseEntity<PedidoModel> crearPedido(@RequestParam String nombre,@RequestParam String apellido,@RequestParam String telefono,@RequestParam String gmail,
                                                   @RequestParam BigDecimal delivery,@RequestBody List<DetallePedidoModel> detallePedido){
        return ResponseEntity.ok(pedidoService.crearPedido(nombre,apellido,telefono,gmail,delivery,detallePedido));
    }

    @GetMapping("/listarAllPedidos")
    @PreAuthorize("hasAuthority('READ')")
    public ResponseEntity<List<PedidoModel>> listarAllPedidos(){
        return ResponseEntity.ok(pedidoService.listarAllPedidos());
    }
}
