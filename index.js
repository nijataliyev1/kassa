class Product {
    constructor (name,price,weight) {
        this.name = name;
        this.price = price;
        this.weight = weight;
    }
}


class RecieptProduct {
    constructor(product,amount) {
        this.product = product;
        if (this.product.weight) {
            if (amount % 1 != 0) {

                amount = String(amount);
                let appending = ""
                for (let i = 0;i < 5 - amount.length;i++) {
                    appending += "0";
                }
                amount += appending;
            }
            else {
                amount = String(amount);
                amount += ".000";
            }
        }
        this.amount = amount;
    }
    price() {
        return this.product.price;
    }
    name() {
        return this.product.name;
    }
    total() {
        return Math.round(this.price() * this.amount * 100) / 100;
    }

    
}


class Reciept {
    constructor (database,id) {
        this.id = id;
        this.products = [];
        let bigDiv = document.querySelector(".operations");
        let inputCash = bigDiv.children[0].children[1].children[1];
        let inpudCard = bigDiv.children[0].children[1].children[3];
        let table = bigDiv.children[1];
        let tbody = table.children[1];
        if (inputCash.checked) {
            this.paymentType = "cash";
        }
        else if (inpudCard.checked) {
            this.paymentType = "card";
        }
        else {
            this.paymentType = null;
        }
        [...tbody.children].forEach(item => {
            let name = item.children[1].innerText;
            let amount = item.children[2].innerText;
            let product;
            database.products.forEach(item2 => {
                if (item2.name.toUpperCase() == name.toUpperCase()) {
                    product = item2;
                }
            })
            let recieptProduct = new RecieptProduct(product,amount);
            this.products.push(recieptProduct);
        })
        this.recieptTotal = 0;
        this.products.forEach(item => {
            this.recieptTotal += item.total(); 
        })
        this.recieptTotal = Math.round(this.recieptTotal * 100) / 100;
        let date = new Date();
        this.date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes(); 
        
       
    }
    apply () {
        let paymentAmount;
        if (this.paymentType == "cash") {
            
            paymentAmount = prompt("Ödəniləcək məbləğ - " + this.recieptTotal + " AZN");
            if (paymentAmount == null) {
                return false;
            }
        }
        else if (this.paymentType == "card") {
            paymentAmount = this.recieptTotal;
        }
        else {
            this.id--;
            alert("Ödəniş üsulu seçilməyib");
            return false;
        }
        if (paymentAmount != null) {
            if (String(paymentAmount - 1) == "NaN" || paymentAmount * 100 % 1 != 0) {
                return this.apply();
            }
            if (paymentAmount < this.recieptTotal ) {
                alert("Məbləğ kifayət etmir");
                return this.apply();
            }
            let reciept = document.querySelector(".reciept");
            document.querySelector(".market-data .date span:nth-child(2)").innerText = this.date;
            document.querySelector(".market-data .id span:nth-child(2)").innerText = this.id;
            let tbody = document.querySelector(".reciept-table tbody");
            this.products.forEach(item => {
                let tr = document.createElement("tr");
                let datas = [item.name().toUpperCase(),item.amount,item.price(),item.total()];
                datas.forEach(item2 => {
                    let td = document.createElement("td");
                    td.innerText = item2;
                    tr.append(td);
                })
                tbody.append(tr);
            })
            document.querySelector(".reciept tfoot td:last-child").innerText = this.recieptTotal;
            let footerTable = document.querySelector(".reciept").children[3].children[1].children[0];
            let values = [this.paymentType == "card" ? "nağdsız" : "nağd",paymentAmount,Math.round((paymentAmount - this.recieptTotal) * 100) / 100,this.recieptTotal];
            values.forEach((item,ind) => {
                footerTable.children[ind].children[1].innerText = item;
            })
            let cancelButtons = document.querySelectorAll(".cancel-button");
            [...cancelButtons].forEach(item => {
                item.classList.add("display-none");
            })
            return true
        }
    }
    empty () {
        let reciept = document.querySelector(".reciept");
        document.querySelector(".market-data .date span:nth-child(2)").innerText = "";
        document.querySelector(".market-data .id span:nth-child(2)").innerText = "";
        let tbody = document.querySelector(".reciept-table tbody").children;
        
        [...tbody].forEach(item => {
            item.remove();
        })
        document.querySelector(".reciept tfoot td:last-child").innerText = "";
        let footerTable = document.querySelector(".reciept").children[3].children[1].children[0];
        for (let i = 0;i < 4;i++) {
            footerTable.children[i].children[1].innerText = "";
        }
    }

}


class User {
    constructor() {
        this.username = null;
        this.pass = null;
        this.name = null;
        this.surname = null;
    }
}

class Database {
    constructor() {
        this.users = [];
        this.balance = 0;
        this.products = [];
    }
    addUser(user) {
        this.users.push(user);
    }
}

class Session {
    constructor(database) {
        this.payed = false;
        this.recieptNumber = 1;
        this.database = database;
        let main = document.querySelector("main");
        let logInDiv = document.createElement("div");
        logInDiv.classList.add("container")
        let form = document.createElement("form")
        let labelText = document.createElement("label");
        labelText.innerText = "Username";
        let inputText = document.createElement("input");
        inputText.type = "text";
        inputText.name = "username";
        labelText.append(inputText)
        form.append(labelText);
        let labelPass = document.createElement("label");
        labelPass.innerText = "Şifrə";
        let inputPass = document.createElement("input");
        inputPass.type = "password";
        inputPass.name = "pass"
        labelPass.append(inputPass)
        form.append(labelPass);
        let submitButton = document.createElement("button");
        submitButton.classList.add("submit");
        submitButton.innerText = "Daxil ol";
        form.append(submitButton);
        logInDiv.append(form);
        main.append(logInDiv);
        form.addEventListener("submit", event => {
            event.preventDefault();
            let newForm = new FormData(event.target);
            database.users.forEach(item => {
                if (item.username == newForm.get("username") && item.pass == newForm.get("pass")) {
                    this.cashier = item;
                    this.checkoutPage();
                }
            });
        })
    }
    checkoutPage() {
        let main = document.querySelector("main");
        [...main.children].forEach(item => {
            item.classList.toggle("display-none");
        })
        let cashierName = document.querySelector(".cashier-name span:nth-child(2)");
        cashierName.innerHTML += this.cashier.name + " " + this.cashier.surname;
        function updateOrder() {
            let tds = document.querySelectorAll(".products td:first-child");
            tds.forEach((item,ind) => {
                item.innerText = ind + 1;
            })
        }
        updateOrder();
        let tfootInput = document.querySelector("tfoot input");
        let currentProduct = null;
        tfootInput.addEventListener("keyup", event => {
            let tfootTr = document.querySelector("tfoot tr");
            if (event.key == "Enter") {
                if (tfootTr.children[4].innerText != 0) {
                    addToTable();
                }
            } 
            else {

                let flag = true;
                this.database.products.forEach(item => {
                    if (item.name.toUpperCase() == event.target.value.toUpperCase()) {
                    currentProduct = item;
                    
                    tfootTr.children[2].children[0].style.display = "inline-block"
                    tfootTr.children[2].children[0].value = 1;
                    tfootTr.children[3].innerText = item.price;
                    tfootTr.children[4].innerText = item.price * tfootTr.children[2].children[0].value;
                    flag = false;
                    }
                })
                if (flag) {
                    tfootTr.children[2].children[0].value = "";
                    tfootTr.children[3].innerText = "";
                    tfootTr.children[4].innerText = "";
                    tfootTr.children[2].children[0].style.display = "none"
                    currentProduct = null;
                }  
            }
        })
        let amountInput = document.querySelector(".products .amount");
        amountInput.addEventListener("keyup", event => {
            if (event.key == "Enter" && event.target.value != 0) {
                if (currentProduct.weight) {
                    event.target.value = Math.round(event.target.value * 1000) / 1000
                    event.target.parentElement.parentElement.children[4].innerText = Math.round(currentProduct.price * event.target.value * 100) / 100;
                }
                addToTable();
            }
            if (currentProduct != null) {
                if (!currentProduct.weight) {
                    event.target.value = Math.round(event.target.value);
                }
            }
            if (currentProduct == null) {
                event.target.value = "";
            }
            else if (event.target.value < 0) {
                event.target.value = 1;
            }
            else {
                event.target.parentElement.parentElement.children[4].innerText = Math.round(currentProduct.price * event.target.value * 100) / 100;
            }

        })
        function addToTable () {
            let productName = document.querySelector("tfoot input").value;
            let productAmount = document.querySelector(".products .amount").value;
            let productPrice = document.querySelector("tfoot").children[0].children[3].innerText;
            let productTotal = document.querySelector("tfoot").children[0].children[4].innerText;
            let tbody = document.querySelector(".operations tbody");
            let tr = document.querySelector("tr");
            let newTr = document.createElement("tr");
            let td = document.createElement("td");
            newTr.append(td);
            function func(cont) {
                let td = document.createElement("td");
                td.innerText = cont;
                newTr.append(td);
                currentProduct = null;
            }
            func(productName);
            document.querySelector(".products .amount").style.display = "none";
            func(productAmount);
            func(productPrice);
            func(productTotal);
            let newTdButton = document.createElement("td");
            let newButton = document.createElement("button");
            newButton.classList.add("cancel-button");
            newButton.textContent = "Ləğv et";
            newButton.addEventListener("click", event => {
            event.target.parentElement.parentElement.remove();
                updateOrder();
            })
            newTdButton.append(newButton);
            newTr.append(newTdButton);
            tbody.append(newTr);
            updateOrder();
            document.querySelector("tfoot input").value = "";
            document.querySelector(".products .amount").value = "";
            document.querySelector("tfoot").children[0].children[3].innerText = "";
            document.querySelector("tfoot").children[0].children[4].innerText = "";
        }
        
        
        let resetButton = document.querySelector(".reset");
        
        let pay = document.querySelector(".pay");
        let listener = pay.addEventListener("click", event => {
            if (!this.payed){

                let reciept = new Reciept(this.database,this.recieptNumber++);
                this.payed = reciept.apply();
                if (this.payed) {

                    document.querySelector("tfoot").classList.add("display-none");
                }

                    
            }
            // event.target.removeEventListener("click",listener);
        })

        resetButton.addEventListener("click", event => {
            document.querySelector("tfoot").classList.remove("display-none");
            document.querySelector(".cash-pay").checked = false;
            document.querySelector(".card-pay").checked = false;
            this.payed = false;
            let tbody = document.querySelector(".products tbody");
            [...tbody.children].forEach(event => {
                event.remove();
            })
            let reciept = new Reciept(this.database,this.recieptNumber);
            reciept.empty();
            let tfootTr = document.querySelector(".products tfoot tr");
            tfootTr.children[1].children[0].value = "";
            tfootTr.children[2].children[0].value = "";
            tfootTr.children[3].innerText = "";
            tfootTr.children[4].innerText = "";

            updateOrder();
        })
    }

}

let database = new Database();
database.products.push(new Product("ÇÖRƏK",0.6,false));
database.products.push(new Product("ŞƏKƏR TOZU",1.2,true));
database.products.push(new Product("ALPEN GOLD",2.5,false));
database.products.push(new Product("YUMURTA",0.23,false));
database.products.push(new Product("UN",1.3,true));
let cashier1 = new User();
cashier1.username = "nijat";
cashier1.pass = "1234";
cashier1.name = "Nicat";
cashier1.surname = "Əliyev";
database.users.push(cashier1);
let cashier2 = new User();
cashier2.username = "nargiz";
cashier2.pass = "nargiz";
cashier2.name = "Nərgiz";
cashier2.surname = "Avazova";
database.users.push(cashier2);
let cashier3 = new User();
cashier3.username = "nuhu";
cashier3.pass = "nuhunuhu";
cashier3.name = "Nohəddin";
cashier3.surname = "Qurbanlı";
database.users.push(cashier3);
let cashier4 = new User();
cashier4.username = "ali";
cashier4.pass = "aliqasim";
cashier4.name = "Qasıməli";
cashier4.surname = "Quluzadə";
database.users.push(cashier4);
let session = new Session(database);