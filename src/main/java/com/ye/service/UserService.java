package com.ye.service;

import com.ye.model.User;

public interface UserService {

    User checkUser(String username, String password);
}
