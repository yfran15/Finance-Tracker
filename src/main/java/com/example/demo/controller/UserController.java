package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        try{
            User user = userService.findByUsername(username);
            return ResponseEntity.ok(user);
        } catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    // Create a user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userService.existingUser(user.getUsername())) {
            return ResponseEntity.badRequest().build();
        }
        User newUser = userService.saveUser(user);
        return ResponseEntity.ok(newUser);
    }

    // Reset password
    @PutMapping("/update-password")
    public ResponseEntity<User> updatePassword(@RequestBody User updatedUser) {
        try{
            User updated = userService.updatePassword(updatedUser);
            return ResponseEntity.ok(updated);
        } catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }
}
