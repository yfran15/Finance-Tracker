package com.example.demo.service;

import com.example.demo.entity.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionServices {
    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByUserId(int userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(int id) {
        transactionRepository.deleteById(id);
    }

    public Optional<Transaction> getTransactionById(int id) {
        return transactionRepository.findById(id);
    }

}
