package com.example.demo.controller;

import com.example.demo.entity.Transaction;
import com.example.demo.service.TransactionServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    private TransactionServices transactionServices;

    @GetMapping("/user/{userId}")
    public List<Transaction> getTransactionByUserId(@PathVariable int userId) {
        return transactionServices.getTransactionsByUserId(userId);
    }

    @GetMapping("/{id}")
    public Optional<Transaction> getTransactionById(@PathVariable int id) {
        return transactionServices.getTransactionById(id);
    }

    // Create transaction
    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionServices.saveTransaction(transaction);
    }

    // Update transaction
    @PutMapping("/{id}")
    public Transaction updateTransaction(@PathVariable int id, @RequestBody Transaction updatateTransaction) {
        Optional<Transaction> transactionOptional = transactionServices.getTransactionById(id);
        if (transactionOptional.isPresent()) {
            Transaction previousTransaction = transactionOptional.get();

            // Update the fields
            previousTransaction.setDescription(updatateTransaction.getDescription());
            previousTransaction.setCategory(updatateTransaction.getCategory());
            previousTransaction.setAmount(updatateTransaction.getAmount());
            previousTransaction.setDate(updatateTransaction.getDate());
            return transactionServices.saveTransaction(previousTransaction);
        }
        else {
            return  null;
        }
    }

    // Delete transaction
    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable int id) {
        transactionServices.deleteTransaction(id);
    }
}
