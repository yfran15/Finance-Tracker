package com.example.demo.controller;

import com.example.demo.entity.Transaction;
import com.example.demo.service.TransactionServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
//@CrossOrigin(origins = "*")
public class TransactionController {
    @Autowired
    private TransactionServices transactionServices;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionByUserId(@PathVariable int userId) {
        List<Transaction> transactions = transactionServices.getTransactionsByUserId(userId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
        //return transactionServices.getTransactionsByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Integer id) {
        return transactionServices.getTransactionById(id)
                .map(transaction -> new ResponseEntity<>(transaction, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    public Optional<Transaction> getTransactionById(@PathVariable int id) {
//        return transactionServices.getTransactionById(id);
//    }

    // Create transaction
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction created = transactionServices.saveTransaction(transaction);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

//    public Transaction createTransaction(@RequestBody Transaction transaction) {
//        return transactionServices.saveTransaction(transaction);
//    }

    // Update transaction
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Integer id, @RequestBody Transaction updatedTransaction) {
        return transactionServices.getTransactionById(id)
                .map(previous -> new ResponseEntity<>(transactionServices.updateTransaction(id, updatedTransaction), HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        //return new ResponseEntity<>(transactionServices.updateTransaction(id, updatedTransaction), HttpStatus.OK);
    }

//    public Transaction updateTransaction(@PathVariable int id, @RequestBody Transaction updatateTransaction) {
//        return transactionServices.updateTransaction(id, updatateTransaction);
//    }

    // Delete transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Integer id) {
        transactionServices.deleteTransaction(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

//    public void deleteTransaction(@PathVariable int id) {
//        transactionServices.deleteTransaction(id);
//    }
}
