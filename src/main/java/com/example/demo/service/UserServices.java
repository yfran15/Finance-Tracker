package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServices {
    @Autowired
    private UserRepository userRepository;

    public User findByUsername (String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() ->new UsernameNotFoundException("user not found"));
    }
}
