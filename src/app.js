var App = {

    loading: false,
    contracts: {},

    load: async function() {
        await this.loadWeb3();
        await this.loadAccount();
        await this.loadContract();
        await this.render();
    },

    loadWeb3: async function() {

        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                await ethereum.enable();
                web3.eth.sendTransaction({});
            } catch (error) {
                // TODO:  User denied account access..
            }
        } else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            web3.eth.sendTransaction({});
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    },

    loadAccount: async function() {
        this.account = web3.eth.accounts[0];
        web3.eth.defaultAccount = this.account;
    },

    loadContract: async function() {
        const todoListJSON = await $.getJSON("TodoList.json");

        this.contracts.todoList = TruffleContract(todoListJSON);
        this.contracts.todoList.setProvider(web3.currentProvider);

        this.todoList = await this.contracts.todoList.deployed();
    },

    render: async function() {

        if(App.loading) return;

        this.setLoading(true);

        $("#account").html(App.account);

        await this.renderTasks();

        this.setLoading(false);
    },

    setLoading: function(value) {
        this.loading = value;

        const loader = $("#loader");
        const content = $("#content");

        if(value) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
    },

    renderTasks: async function() {
        const taskCount = await this.todoList.taskCount();
        const taskTemplate = $(".taskTemplate");

        for(let i = 1; i <= taskCount; i++) {

            const task = await this.todoList.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2];

            const newTaskTemplate = taskTemplate.clone();
            newTaskTemplate.find(".content")
                            .html(taskContent);
            newTaskTemplate.find("input")
                            .prop("name", taskId)
                            .prop("checked", taskCompleted)
                            .on("click", (event) => this.toggleCompleted(event));

            if(taskCompleted) {
                $("#completedTaskList").append(newTaskTemplate);
            } else {
                $("#taskList").append(newTaskTemplate);
            }

            newTaskTemplate.show();
        }
    },

    createTask: async function() {

        this.setLoading(true);

        const content = $("#newTask").val();
        await this.todoList.createTask(content);
        window.location.reload();
    },

    toggleCompleted: async function(event) {

        this.setLoading(true);

        const taskId = event.target.name;
        await this.todoList.toggleCompleted(taskId);
        window.location.reload();
    },

};

$(() => {
    $(window).load(() => {
        App.load();
    })
});