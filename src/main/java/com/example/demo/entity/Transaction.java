package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String description;
    private String category;
    private double amount;
    private LocalDateTime date;

    // Map the transaction to the user
    @ManyToOne
    @JoinColumn(name ="user_id", nullable = false)
    private User user;
}
