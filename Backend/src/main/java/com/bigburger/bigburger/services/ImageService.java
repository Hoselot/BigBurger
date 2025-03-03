package com.bigburger.bigburger.services;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${app.base-url}") // URL base desde application.properties
    private String baseUrl;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/static/uploads/";

    public String uploadImage(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return "El archivo está vacío.";
            }

            String fileType = file.getContentType();
            if (fileType == null || !fileType.startsWith("image/")) {
                return "El archivo no es una imagen válida.";
            }

            // Crear la carpeta de subida si no existe
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Procesar la imagen: redimensionar a 500x500 y comprimir a calidad 0.8,
            // guardando el resultado en un ByteArrayOutputStream
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            Thumbnails.of(file.getInputStream())
                    .size(500, 500)
                    .outputQuality(0.8)
                    .outputFormat("jpg") // opcional: forzar a JPEG
                    .toOutputStream(os);
            byte[] processedImageBytes = os.toByteArray();

            // Calcular el hash de la imagen ya procesada
            String processedHash = calculateBytesHash(processedImageBytes);

            // Buscar si ya existe un archivo con el mismo hash
            File[] existingFiles = directory.listFiles();
            if (existingFiles != null) {
                for (File existingFile : existingFiles) {
                    if (processedHash.equals(calculateFileHash(existingFile))) {
                        return baseUrl + "/uploads/" + existingFile.getName();
                    }
                }
            }

            // Generar un nombre único para el archivo y guardar los bytes procesados
            String extension = ".jpg"; // Como forzamos JPEG
            String uniqueFileName = UUID.randomUUID() + extension;
            String fullPath = Paths.get(UPLOAD_DIR, uniqueFileName).toString();

            try (FileOutputStream fos = new FileOutputStream(new File(fullPath))) {
                fos.write(processedImageBytes);
            }

            return baseUrl + "/uploads/" + uniqueFileName;

        } catch (IOException | NoSuchAlgorithmException e) {
            e.printStackTrace();
            return "Error al guardar la imagen.";
        }
    }

    // Calcula el hash SHA-256 de un arreglo de bytes
    private String calculateBytesHash(byte[] data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(data);
        return bytesToHex(hash);
    }

    private String calculateFileHash(MultipartFile file) throws NoSuchAlgorithmException, IOException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] bytes = file.getBytes();
        byte[] hash = digest.digest(bytes);
        return bytesToHex(hash);
    }

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
