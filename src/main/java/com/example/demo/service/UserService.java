package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findByUsername (String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() ->new IllegalArgumentException("user not found"));
    }

    public boolean existingUser (String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public User saveUser(User user){
        return userRepository.save(user);
    }

    public User updatePassword(User updateUser) {
        User existing = findByUsername(updateUser.getUsername());
        existing.setPassword(updateUser.getPassword());
        return userRepository.save(existing);
    }
    public User findById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }
}
