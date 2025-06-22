package com.example.demo.controller;

import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.service.TransactionService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
//@CrossOrigin(origins = "*")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionByUserId(@PathVariable Integer userId) {
        List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
        //return transactionServices.getTransactionsByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Integer id) {
        return transactionService.getTransactionById(id)
                .map(transaction -> new ResponseEntity<>(transaction, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    public Optional<Transaction> getTransactionById(@PathVariable int id) {
//        return transactionServices.getTransactionById(id);
//    }

    // Create transaction
    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction) {

        if (transaction.getUser() == null || transaction.getUser().getId() == 0) {
            return ResponseEntity.badRequest().body(null);}
        // validate user
        User user = userService.findByUsername(transaction.getUser().getUsername());
        transaction.setUser(user);

        Transaction created = transactionService.saveTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);

            //return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

//    public Transaction createTransaction(@RequestBody Transaction transaction) {
//        return transactionServices.saveTransaction(transaction);
//    }

    // Update transaction
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Integer id, @RequestBody Transaction updatedTransaction) {
        return transactionService.getTransactionById(id)
                .map(previous -> new ResponseEntity<>(transactionService.updateTransaction(id, updatedTransaction), HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        //return new ResponseEntity<>(transactionServices.updateTransaction(id, updatedTransaction), HttpStatus.OK);
    }

//    public Transaction updateTransaction(@PathVariable int id, @RequestBody Transaction updatateTransaction) {
//        return transactionServices.updateTransaction(id, updatateTransaction);
//    }

    // Delete transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Integer id) {
        try {
            transactionService.deleteTransaction(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    public void deleteTransaction(@PathVariable int id) {
//        transactionServices.deleteTransaction(id);
//    }
}
