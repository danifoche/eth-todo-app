const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", function(accounts) {

    before(async function() {
        this.todoList = await TodoList.deployed();
    });

    it("deploys successfully", async function() {
        const address = await this.todoList.address;

        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    it("lists tasks", async function() {
        const taskCount = await this.todoList.taskCount();
        const task = await this.todoList.tasks(taskCount);

        assert.equal(task.id.toNumber(), taskCount.toNumber());
    });

    it("creates tasks", async function() {
        const result = await this.todoList.createTask("Test creazione todo!");
        const events = result.logs[0].args;
    });

    it("completes tasks", async function() {
        const result = await this.todoList.toggleCompleted(1);
    });
});