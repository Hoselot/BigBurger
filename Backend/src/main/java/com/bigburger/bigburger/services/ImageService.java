package com.bigburger.bigburger.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
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

        } catch (IOException e) {
            e.printStackTrace();
            return "Error al guardar la imagen.";
        }
    }
}
