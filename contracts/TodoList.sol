// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {

    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    event TaskCompleted(
        uint id,
        bool completed
    );

    constructor() public {
        createTask("Completare l'app");
        createTask("Andare a letto");
        createTask("Controllare segnalazione");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        tasks[_id].completed = !tasks[_id].completed;
        emit TaskCompleted(_id, tasks[_id].completed);
    }
}