package com.bigburger.bigburger.services;

import com.bigburger.bigburger.models.UserModel;
import com.bigburger.bigburger.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private IUserRepository usuarioRepository;

    public Optional<UserModel> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
}

