function base64UrlDecode(str) {
    if (!str) {
      throw new Error("Token inválido: no se puede decodificar el payload.");
    }
  
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Añadir relleno si es necesario
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
  
    return atob(base64);
  }
  
  export function isTokenExpired(token) {
    try {
      if (!token || !token.includes(".")) {
        throw new Error("Token inválido o no presente.");
      }
  
      // Extraer y decodificar el payload del token
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(base64UrlDecode(payloadBase64));
  
      // Mostrar información del token en consola para depuración
      
  
      // Verificar expiración del token
      return Math.floor(Date.now() / 1000) >= payload.exp;
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      return true; // Asumir token inválido si algo falla
    }
  }
  
  
  