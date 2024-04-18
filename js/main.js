const BASE_URL ='https://60b77f8f17d1dc0017b8a2c4.mockapi.io';

const submitButton = document.getElementById('submitButton');

const title = document.getElementById('title');

const description = document.getElementById('description');

const dateEl = document.getElementById('date');

let idOfItemEdit;

const limitNumber = 10;





async function getData()
{
    const pageNumber = (window.location.search);
    let arrayUrl = pageNumber.split('&');
    // console.log(arrayUrl);
    let findPage;
    for(let i = 0 ;i<arrayUrl.length ; i++)
    {
        if (arrayUrl[i].includes('page') || arrayUrl[i].includes('?page'))
        {
            findPage = arrayUrl[i].split('=');
        }
    }
    // console.log(test[1]);  //


    
    const response =await fetch (`${BASE_URL}/todos`);
    let data = await response.json();
    createButtons(data);
    data.reverse();
    let newData = data.slice((findPage[1]-1) * limitNumber , (findPage[1]-1) * limitNumber + limitNumber);
    // console.log(data);

    createEachToDo(newData);

}


getData();





function createButtons(data) {
    const pageBtn = document.getElementById("pageBtn");
    let counts = (Math.ceil(data.length/limitNumber));  //count of pages

    let textPage = ``;
    for(let i = 0 ; i<counts ; i++)
    {
        textPage +=
            `<button class="btn text-dark fs-3 myPageBtn btn-outline-primary my-5" onclick="showDataInPage(event)" value="${i+1}">${i+1}</button>`
    }

    pageBtn.innerHTML = textPage;

}




function createEachToDo(newData) {
    let html = ``;
    newData.forEach((item , index) => {
            if(newData[index].checked)
            {
                html +=
                    `<li id=${item.id} class="d-flex flex-column  mb-4 mylist p-3 fs-2 text-decoration-line-through rounded-2">
        
              <div  class="d-flex  justify-content-between mb-4">
                 <div>
                    <input onclick="isCheckData(event)" type='checkbox' class='mycheckbox form-check-input' id="myCheck"  checked <span>${item.title} </span> <span class="mx-5 fs-5">${item.dueDate} </span> 
                 </div>

                 <div>
                    <a  href="./home.html?id=${item.id}"  ><img src="./img/pencil.svg" class="mypencil"/></a>
                    <img  onclick="deleteData(event)" src="./img/delete.svg" class="mydelete"/>
                 </div>

              </div>

              

              <div class="fs-5">
                ${item.description}

              </div>

            </li>`

            }

            else //(!data[index].checked)  false
            {
                html +=
                    `<li id=${item.id} class="d-flex flex-column  mb-4 mylist p-3 fs-2 rounded-2">
        
              <div  class="d-flex  justify-content-between mb-4">
                 <div>
                    <input onclick="isCheckData(event)" type='checkbox' class='mycheckbox form-check-input' id="myCheck"   <span>${item.title} </span> <span class="mx-5 fs-5">${item.dueDate} </span> 
                 </div>

                 <div>
                    <a  href="./home.html?id=${item.id}"  ><img  src="./img/pencil.svg" class="mypencil"/></a>
                    <img  onclick="deleteData(event)" src="./img/delete.svg" class="mydelete"/>
                 </div>

              </div>

              

              <div class="fs-5">
                ${item.description}

              </div>

            </li>`

            }

        }

    );
    const items = document.getElementById("items");

    items.innerHTML = html;
}




async function addData(currentData){

    currentData.createdAt = new Date();
    currentData.updatedAt = currentData.createdAt;

    const addItem = await fetch (`${BASE_URL}/todos` , {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        } , 
        body : JSON.stringify(currentData)
    });

    getData();


}






function addItem(e){
    e.preventDefault();


    let titleValue = title.value;
    let dateValue = dateEl.value;

    if(titleValue.trim() == "" || titleValue.trim() == null )
    {
        title.classList.add('btn-outline-danger');
        title.classList.add('border-3');
        const announceTitle = document.getElementById('announceTitle');
        announceTitle.classList.remove('d-none');
        setTimeout(() => {
            title.classList.remove('btn-outline-danger');
            title.classList.remove('border-3');
            announceTitle.classList.add('d-none');
        }, 3000);

        return false;
    }

    else if(dateValue.trim() == "" || dateValue.trim() == null )
    {
        dateEl.classList.add('btn-outline-danger');
        dateEl.classList.add('border-3');
        const announceDate = document.getElementById('announceDate');
        announceDate.classList.remove('d-none');
        setTimeout(() => {
            dateEl.classList.remove('btn-outline-danger');
            dateEl.classList.remove('border-3');
            announceDate.classList.add('d-none');
        }, 3000);

        return false;
    }
        

    else
    {

        if(submitButton.innerHTML === 'Submit')
        {
            const form = new FormData(e.target);
            const currentData = Object.fromEntries(form); //titel-description-dueDate
            console.dir(currentData);
            document.getElementById('title').value = "";
            document.getElementById('description').value = "";
            document.getElementById('date').value = "";

            const successMessage = document.getElementById('successMessage');
            successMessage.classList.remove('d-none');
            setTimeout( () => {
                successMessage.classList.add('d-none');
            } , 3000);

            addData(currentData);

        }

        else  //if(submitButton.innerHTML === 'Save')
        {
            editData1();      
        }


    }


}


async function deleteData(e){

    const idOfItem = e.target.parentNode.parentNode.parentNode.getAttribute('id');


    const response = await fetch (`${BASE_URL}/todos/${idOfItem}`);
    const deleteItem = await response.json();


    const titleModal = document.getElementById('titleModal');
    const dateModal  = document.getElementById('dateModal');

    titleModal.innerText = deleteItem.title;
    dateModal.innerText = deleteItem.dueDate;


    showPrompt()

    function showCover() {
        const coverEl = document.createElement('div');
        coverEl.id = 'cover-div';
        document.body.style.overflowY = 'hidden';
        document.body.append(coverEl);
    }


    function hideCover() {
        document.getElementById('cover-div').remove();
        document.body.style.overflowY = '';
    }



    function showPrompt( ) {
        showCover();
        const form = document.getElementById('prompt-form');
        const doneEl = document.getElementById('doneEl');
        const container = document.getElementById('prompt-form-container');



        function complete() {
            hideCover();
            container.style.display = 'none';
            document.onkeydown = null;

        }

        doneEl.onclick = async function()  {
                     const deleteItem = await fetch (`${BASE_URL}/todos/${idOfItem}` , {
                     method: 'DELETE',
                });

            getData();
            complete();


        };

        form.cancel.onclick = function() {
            getData();
            complete();
        };

        container.style.display = 'block';

    }

}




async function isCheckData(e){
    const idOfItem = e.target.parentNode.parentNode.parentNode.getAttribute('id');

    const response =await fetch (`${BASE_URL}/todos/${idOfItem}`);
    let data = await response.json();

    if(data.checked)
    {
        data.checked = false;
        const addItem = await fetch (`${BASE_URL}/todos/${idOfItem}` , {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json'
            } , 
            body : JSON.stringify(data)
        });
    }
    else
    {
        data.checked = true;
        const addItem = await fetch (`${BASE_URL}/todos/${idOfItem}` , {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json'
            } , 
            body : JSON.stringify(data)
        });
    }
    
    getData();

}




async function editData(){
    // idOfItemEdit = e.target.parentNode.parentNode.parentNode.getAttribute('id');


    const idNumber = window.location.search;
    let arrayUrlId = idNumber.split('&');

    let findItem;
    for(let i = 0 ;i<arrayUrlId.length ; i++)
    {
        if (arrayUrlId[i].includes('id') || arrayUrlId[i].includes('?id'))
        {
            findItem = arrayUrlId[i].split('=');

            idOfItemEdit = findItem[1];

            const response =await fetch (`${BASE_URL}/todos/${findItem[1]}`);
            let data = await response.json();
            if ( data !== 'Not found')
            {
                submitButton.innerHTML = 'Save';
                document.getElementById('title').value = data.title;
                document.getElementById('description').value = data.description;
                document.getElementById('date').value = data.dueDate;
            }
            else {
                window.location.search = "";
            }

        }
    }
}

 editData();




async function editData1()
{

    const response =await fetch (`${BASE_URL}/todos/${idOfItemEdit}`);
    let data = await response.json();
    data.title = title.value;
    data.description = description.value;
    data.dueDate = dateEl.value;
    data.updatedAt = new Date();
    


    const editItem = await fetch (`${BASE_URL}/todos/${idOfItemEdit}` , {
    method: 'PUT',
    headers: {
        'Content-Type' : 'application/json'
    } , 
    body : JSON.stringify(data)
    });  

    submitButton.innerHTML = 'Submit';

    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('date').value = "";





    const successMessage = document.getElementById('editMessage');
    successMessage.classList.remove('d-none');
    setTimeout( () => {
        successMessage.classList.add('d-none') , window.location.search = "";
    } , 3000);
    getData();   
 

}




function showDataInPage(e){
    window.location.search = `page=${e.target.value}`;
}
















