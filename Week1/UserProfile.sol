// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UserProfile {

    struct User {
        string name;
        uint age;
        string email;
        uint registrationTimestamp;
        bool isRegistered;
    }

    mapping(address => User) private users;

    // Register a new user
    function register(string memory _name, uint _age, string memory _email) public {
        require(!users[msg.sender].isRegistered, "User already registered");

        users[msg.sender] = User({
            name: _name,
            age: _age,
            email: _email,
            registrationTimestamp: block.timestamp,
            isRegistered: true
        });
    }

    // Update existing user profile
    function updateProfile(string memory _name, uint _age, string memory _email) public {
        require(users[msg.sender].isRegistered, "User not registered");

        User storage user = users[msg.sender];
        user.name = _name;
        user.age = _age;
        user.email = _email;
    }

    // Get user profile info
    function getProfile(address _user) public view returns (
        string memory name,
        uint age,
        string memory email,
        uint registrationTimestamp,
        bool isRegistered
    ) {
        User memory user = users[_user];
        return (
            user.name,
            user.age,
            user.email,
            user.registrationTimestamp,
            user.isRegistered
        );
    }
}