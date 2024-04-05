/**
 * here is the javascript for index.html for the Movies API
 */

const URL = 'http://localhost:8282/warehouses';

const URLI = 'http://localhost:8282/inventories'

let allWarehouses = [];

let allInventories = [];

/**
 * GET requests and Table Initializers
 */

document.addEventListener('DOMContentLoaded', () => {


    
    let xhr = new XMLHttpRequest(); 


    xhr.onreadystatechange = () => {



        if(xhr.readyState === 4) {

            let warehouses = JSON.parse(xhr.responseText);

            warehouses.forEach(newWarehouse => {
                addWarehouseToTable(newWarehouse);
            });
        }
    }

    xhr.open('GET', URL);

    xhr.send();

});

function addWarehouseToTable(newWarehouse) {

    console.log(newWarehouse);

 

    let tr = document.createElement('tr');         
    let id = document.createElement('td');          
    let address = document.createElement('td');      
    let capacity = document.createElement('td');     
    let editBtn = document.createElement('td');   


    id.innerText = newWarehouse.id;
    address.innerText = newWarehouse.warehouseAddress;
    capacity.innerText = newWarehouse.capacity;
    editBtn.innerHTML =
    `<button class="btn btn-primary" id="edit-button" onclick="displayWarehouseEditModal(${newWarehouse.id})">Edit</button>`

    tr.appendChild(id);
    tr.appendChild(address);
    tr.appendChild(capacity);
    tr.appendChild(editBtn);

    tr.setAttribute('id', 'TR' + newWarehouse.id);
    tr.addEventListener("click", function(){ 
      
      let xhr = new XMLHttpRequest(); 

      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4) {
          let inventories = JSON.parse(xhr.responseText);
          var table = document.getElementById("sub-table-template");
          for(var i = table.rows.length - 1; i > 0; i--)
          {
              table.deleteRow(i);
          }
          inventories.forEach(newInventory => {
              addInventoryToTable(newInventory, newWarehouse.id);
          });
        }
      }
      xhr.open('GET', URLI);
      xhr.send();
    });
    document.getElementById('list-view-body').appendChild(tr);
    allWarehouses.push(newWarehouse);
}

function addInventoryToTable(newInventory, newWarehouse_id){
  if(newInventory.warehouse.id == newWarehouse_id){
    console.log(newInventory);
    
    let tr = document.createElement('tr');        
    let id = document.createElement('td');          
    let warehouse_id = document.createElement('td');       
    let itemName = document.createElement('td');      
    let quantity = document.createElement('td');    
    let editBtn = document.createElement('td');    

    id.innerText = newInventory.id;
    warehouse_id.innerText = newInventory.warehouse.id;
    itemName.innerText = newInventory.itemName;
    quantity.innerText = newInventory.quantity;
    editBtn.innerHTML =
    `<button class="btn btn-primary" id="edit-button-inv" onclick="displayInventoryEditModal(${newInventory.id})">Edit</button>`

    tr.appendChild(id);
    tr.appendChild(warehouse_id);
    tr.appendChild(itemName);
    tr.appendChild(quantity);
    tr.appendChild(editBtn);

    tr.setAttribute('id', 'TRI' + newInventory.id);

    document.getElementById('sub-table-template').appendChild(tr);
    allInventories.push(newInventory);
  }
}

/**
 * -----------------------------------------------------------------------------------------------------------
 * Initial modal and button configuration
 */

var modal = document.getElementById("create-warehouse-modal");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var modalI = document.getElementById("create-inventory-modal");
var btn2 = document.getElementById("myBtn2");
btn2.onclick = function() {
  modalI.style.display = "block";
}

/**
 * ----------------------------------------------------------------------------------------------------------
 * Modal Display Handlers
 */

function displayWarehouseEditModal(warehouseId){
    for(let w of allWarehouses) {
        if(w.id === warehouseId) {
            
            document.getElementById('update-warehouse-id').value = w.id;
            document.getElementById('update-warehouse-address').value = w.warehouseAddress;
            document.getElementById('update-warehouse-capacity').value = w.capacity;
        }
    }
    document.getElementById('update-warehouse-modal').style.display = 'block';  
}

function displayInventoryEditModal(inventoryId){
  
  for(let i of allInventories) {
      if(i.id === inventoryId) {
           
          document.getElementById('update-inventory-id').value = i.id;
          document.getElementById('update-inventory-warehouse').value = i.warehouse.id;
          document.getElementById('update-inventory-name').value = i.itemName;
          document.getElementById('update-inventory-quantity').value = i.quantity;
      }
  }
  document.getElementById('update-inventory-modal').style.display = 'block';  
}

function closeUpdateWarehouseModal(){
  document.getElementById('update-warehouse-modal').style.display = 'none';   
}

function closeUpdateInventoryModal(){
  document.getElementById('update-inventory-modal').style.display = 'none';   
}

function closeCreateWarehouseModal(){
  document.getElementById('create-warehouse-modal').style.display = 'none'; 
}

function closeCreateInventoryModal(){
  document.getElementById('create-inventory-modal').style.display = 'none'; 
}

/**
 * --------------------------------------------------------------------------------------------------
 * Form Submission Listeners
 */
// Warehouse Creator Submission Listener
document.getElementById('create-warehouse-form').addEventListener('submit', (event) => {
  event.preventDefault();         
  let inputData = new FormData(document.getElementById('create-warehouse-form'));
  let newWarehouse = {
      warehouseAddress : inputData.get("new-warehouse-address"),
      capacity : inputData.get("new-warehouse-capacity")
  }
  doWarehousePostRequest(newWarehouse);
  closeCreateWarehouseModal();

});

//  Inventory Creator Submission Listener
document.getElementById('create-inventory-form').addEventListener('submit', (event) => {
  event.preventDefault();         
  let inputData = new FormData(document.getElementById('create-inventory-form'));
  for(let w of allWarehouses) {
    if(w.id == inputData.get("new-inventory-warehouse")) {
        
        warehouse2 = w;
        let newInventory = {
          warehouse : {
            id : warehouse2.id,
            warehouseAddress : warehouse2.address,
            capacity : warehouse2.capacity
          },
          itemName : inputData.get("new-inventory-name"),
          quantity : inputData.get("new-inventory-quantity")
      }
      doInventoryPostRequest(newInventory); // Performs the POST request to create new item in database
      closeCreateInventoryModal(); // Closes Modal on Submission
    }
}
});

//  Warehouse Updater Submission Listener
document.getElementById('update-warehouse-form').addEventListener('submit', (event) => {
  event.preventDefault();  
  let inputData = new FormData(document.getElementById('update-warehouse-form'));
  let warehouse = {
    id : document.getElementById('update-warehouse-id').value,
    warehouseAddress : inputData.get("update-warehouse-address"),
    capacity : inputData.get("update-warehouse-capacity")
}
  fetch(URL + '/warehouse', { // Performs POST request to update data in the database
      method : 'PUT',
      headers : {
          'Content-Type' : 'application/json',
      }, 
      body : JSON.stringify(warehouse)
  })
  .then((data) => {

      return data.json();
  })
  .then((warehouseJSON) => {      
      updateWarehouseInTable(warehouseJSON); // Responsible for updating the Front end to Match the Database
  })
  .catch((error) => {

      console.error(error);
  })

});

//   Inventory Updater Submission Listener
document.getElementById('update-inventory-form').addEventListener('submit', (event) => {
  event.preventDefault();  
  let inputData = new FormData(document.getElementById('update-inventory-form'));
  let w3 = document.getElementById("update-inventory-warehouse").value;
  for(let w of allWarehouses) {
    if(w.id == w3) {
     
      let inventory = {
        id : document.getElementById('update-inventory-id').value,
        warehouse : {
            id : w.id,
            warehouseAddress : w.warehouseAddress,
            capacity : w.capacity
        },
        itemName : inputData.get("update-inventory-name"),
        quantity : inputData.get("update-inventory-quantity")
    }
      fetch(URLI + '/inventory', { // Perforns PUT request to update item in Database
          method : 'PUT',
          headers : {
              'Content-Type' : 'application/json',
          }, 
          body : JSON.stringify(inventory)
      })
      .then((data) => {
    
          return data.json();
      })
      .then((inventoryJSON) => {      
          updateInventoryInTable(inventoryJSON); // Responsible for updating the table in the Front End
      })
      .catch((error) => {
    
          console.error(error);
      })
      break;
    
    };
  }
}
)
/**
 * ---------------------------------------------------------------------------------------------------
 *  ASYNC Post Requests
 */

async function doWarehousePostRequest(newWarehouse) {

  console.log(newWarehouse);
  let returnedData = await fetch(URL + '/warehouse', {
      method : 'POST',
      headers : {
          'Content-Type' : 'application/json' 
      },
      body : JSON.stringify(newWarehouse)    
  });
  let warehouseJSON = await returnedData.json();
  console.log('WAREHOUSE JSON' + warehouseJSON);
  addWarehouseToTable(warehouseJSON);
  document.getElementById('create-warehouse-form').reset();
}
async function doInventoryPostRequest(newInventory) {

  console.log(newInventory);
  let returnedData = await fetch(URLI + '/inventory', {
      method : 'POST',
      headers : {
          'Content-Type' : 'application/json' 
      },
      body : JSON.stringify(newInventory)     
  });
  let inventoryJSON = await returnedData.json();
  console.log('INVENTORY JSON' + inventoryJSON);
  addInventoryToTable(inventoryJSON);
  document.getElementById('create-inventory-form').reset();
}
/**
 * -------------------------------------------------------------------------------------------------
 * Table Updaters
 */

function updateWarehouseInTable(warehouse) {
 
  document.getElementById('TR' + warehouse.id).innerHTML = `
  <td>${warehouse.id}</td>
  <td>${warehouse.warehouseAddress}</td>
  <td>${warehouse.capacity}</td>
  <td><button class="btn btn-primary" id="editButton" onclick="displayWarehouseEditModal(${warehouse.id})">Edit</button></td>
  `;
  for(let w of allWarehouses) {
    if(w.id === warehouse.id) {
        
        w.id = warehouse.id;
        w.warehouseAddress = warehouse.warehouseAddress;
        w.capacity = warehouse.capacity;
    }
}
  document.getElementById("update-warehouse-form").reset();
  closeUpdateWarehouseModal();
}

function updateInventoryInTable(inventory) {
  
  document.getElementById('TRI' + inventory.id).innerHTML = `
  <td>${inventory.id}</td>
  <td>${inventory.warehouse.id}</td>
  <td>${inventory.itemName}</td>
  <td>${inventory.quantity}</td>
  <td><button class="btn btn-primary" id="editButton" onclick="displayInventoryEditModal(${inventory.id})">Edit</button></td>
  `;
  for(let i of allInventories) {
    if(i.id == inventory.id) {
        
        i.id = inventory.id;
        i.warehouse.id = inventory.warehouse.id;
        i.itemName = inventory.itemName;
        i.quantity = inventory.quantity;
    }
}
  document.getElementById("update-inventory-form").reset();
  closeUpdateInventoryModal();
}

function removeWarehouseFromTable(warehouse){
  const element = document.getElementById('TR' + warehouse.id)
  element.remove();
}

function removeInventoryFromTable(inventory){
  const element2 = document.getElementById('TRI' + inventory.id)
  element2.remove();
}
/**
 * Delete Methods and Requests
 */

function deleteWarehouse(){
  let warehouseID = document.getElementById("update-warehouse-id").value;
  let warehouse_address = document.getElementById("update-warehouse-address").value;
  let warehouse_cap = document.getElementById("update-warehouse-capacity").value;

  let warehouse = {
    id : warehouseID,
    warehouseAddress: warehouse_address,
    capacity : warehouse_cap
  }
  fetch(URL + '/warehouse', {
    method : 'DELETE',
    headers : {
        'Content-Type' : 'application/json',
    },
    body : JSON.stringify(warehouse)
})
.then((data) => {

    if(data.status === 204) {

        removeWarehouseFromTable(warehouse);
    }
})
.catch((error) => {
    console.error(error);
})
closeUpdateWarehouseModal();
}

function deleteInventory(){
  let inventoryID = document.getElementById("update-inventory-id").value;
  let warehouseID = document.getElementById("update-inventory-warehouse").value;
  let inventoryItem = document.getElementById("update-inventory-name").value;
  let inventoryQauntity = document.getElementById("update-inventory-quantity").value;

  let warehouse2 = {
    id : null,
    warehouseAddress: null,
    capacity : null
  }
  for(let w of allWarehouses) {
    if(w.id === warehouseID) {
        
        warehouse2.id = w.id;
        warehouse2.warehouseAddress = w.warehouseAddress;
        warehouse2.capacity = w.capacity;
    }
}
  let inventory = {
    id : inventoryID,
    warehouse : {
      id : warehouse2.id,
      warehouseAddress : warehouse2.warehouseAddress,
      capacity : warehouse2.capacity
    },
    itemName : inventoryItem,
    quantity : inventoryQauntity
  }

  fetch(URLI + '/inventory', {
    method : 'DELETE',
    headers : {
        'Content-Type' : 'application/json',
    },
    body : JSON.stringify(inventory)
})
.then((data) => {
    if(data.status === 204) {
        removeInventoryFromTable(inventory);
    }
})
.catch((error) => {
    console.error(error);
})
closeUpdateInventoryModal();
}

