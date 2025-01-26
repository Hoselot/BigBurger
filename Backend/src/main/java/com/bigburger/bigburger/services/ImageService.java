package com.bigburger.bigburger.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${app.base-url}") // URL base desde application.properties
    private String baseUrl;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/static/uploads/"; // Carpeta para guardar imágenes

    public String uploadImage(MultipartFile file) {
        try {
            // Validar que el archivo no esté vacío
            if (file.isEmpty()) {
                return "El archivo está vacío.";
            }

            // Validar que el archivo sea una imagen
            String fileType = file.getContentType();
            if (fileType == null || !fileType.startsWith("image/")) {
                return "El archivo no es una imagen válida.";
            }

            // Crear la carpeta de subida si no existe
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Calcular el hash (SHA-256) del archivo
            String fileHash = calculateFileHash(file);

            // Buscar si ya existe un archivo con el mismo hash
            File[] existingFiles = directory.listFiles();
            if (existingFiles != null) {
                for (File existingFile : existingFiles) {
                    if (fileHash.equals(calculateFileHash(existingFile))) {
                        // Si ya existe un archivo igual, devolver su URL
                        String existingFileUrl = baseUrl + "/uploads/" + existingFile.getName();
                        return existingFileUrl;
                    }
                }
            }

            // Generar un nombre único para el archivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg"; // Extensión predeterminada si no hay
            String uniqueFileName = UUID.randomUUID() + extension;

            // Guardar el archivo
            String fullPath = Paths.get(UPLOAD_DIR, uniqueFileName).toString();
            file.transferTo(new File(fullPath));

            // Construir la URL pública del archivo
            String fileUrl = baseUrl + "/uploads/" + uniqueFileName;
            return fileUrl;

        } catch (IOException | NoSuchAlgorithmException e) {
            e.printStackTrace();
            return "Error al guardar la imagen.";
        }
    }

    /**
     * Calcula el hash SHA-256 de un archivo.
     *
     * @param file El archivo a calcular el hash.
     * @return El hash en formato hexadecimal.
     */
    private String calculateFileHash(MultipartFile file) throws NoSuchAlgorithmException, IOException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] bytes = file.getBytes();
        byte[] hash = digest.digest(bytes);
        return bytesToHex(hash);
    }

    /**
     * Calcula el hash SHA-256 de un archivo en disco.
     *
     * @param file El archivo en disco a calcular el hash.
     * @return El hash en formato hexadecimal.
     */
    private String calculateFileHash(File file) throws NoSuchAlgorithmException, IOException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }
        }
        byte[] hash = digest.digest();
        return bytesToHex(hash);
    }

    /**
     * Convierte un arreglo de bytes en una representación hexadecimal.
     *
     * @param bytes El arreglo de bytes.
     * @return La cadena en formato hexadecimal.
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
