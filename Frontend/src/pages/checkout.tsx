import React, { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { URLBASE } from '@/utils/VariablesAndMethods';

// Inicializa el SDK de Mercado Pago con tu clave pública
initMercadoPago('APP_USR-cf987a0e-118d-4e72-b2c9-d164701323f0');

interface PedidoItem {
  nombreHamburguesa: string;
  nombrePapas: string;
  nombreBebida: string;
  cantidad: number;
}

interface Pedido {
  nombre: string;
  apellido: string;
  telefono: string;
  gmail: string;
  delivery: number;
  items: PedidoItem[];
}

const App: React.FC = () => {
  // Constante para personalizar el pedido
  const pedido: Pedido = {
    nombre: 'Juan',
    apellido: 'Perez',
    telefono: '123456789',
    gmail: 'juan.perez@example.com',
    delivery: 0,
    items: [
      {
        nombreHamburguesa: 'BIG BURGUER',
        nombrePapas: 'Chedar big',
        nombreBebida: 'coca',
        cantidad: 1,
      }
      // ,
      // {
      //   nombreHamburguesa: 'CheeseBurger',
      //   nombrePapas: 'Papas comunes',
      //   nombreBebida: 'Coca cola',
      //   cantidad: 1,
      // }
    ],
  };

  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Función para crear el pedido y obtener el preferenceId
  const handleCompra = async () => {
    try {
      const url = `${URLBASE}/compra/crearPedido?nombre=${encodeURIComponent(
        pedido.nombre
      )}&apellido=${encodeURIComponent(pedido.apellido)}&telefono=${encodeURIComponent(
        pedido.telefono
      )}&gmail=${encodeURIComponent(pedido.gmail)}&delivery=${pedido.delivery}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        // Se envía el array de items en el body
        body: JSON.stringify(pedido.items),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error('Error al crear el pedido');
      }

      // Suponemos que la API devuelve el preferenceId en texto plano
      const preference = await response.text();
      setPreferenceId(preference);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h1>Comprar producto</h1>
      <p>Detalles del pedido:</p>
      <pre>{JSON.stringify(pedido, null, 2)}</pre>
      <button onClick={handleCompra}>Comprar</button>
      <div id="wallet_container" style={{ marginTop: '20px' }}>
        {preferenceId && (
          <Wallet
            initialization={{
              preferenceId,
            }}
            onReady={() => console.log('Wallet listo')}
          />
        )}
      </div>
    </div>
  );
};

export default App;
