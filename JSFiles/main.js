const jsonFile = "JSFiles/data.json"
let data = null
let currentTargets = [] //adding this line because "ModalPopUp" has been fixed my output
let currentRowSort = "r-id1"
let currentExSort = "e-id1"
let alltags = []

window.onload = () => // Is executed when the page loads
{
    // Fetch json file
    fetch(jsonFile)
        .then(response => response.json())
        .then(jsonData => {
            data = JSON.parse(JSON.stringify(jsonData))
            ratingFavouriteCreate()
            currentTargets = jsonData.goal.targets // There will be more conveniece to modify arrays with all basic information, 
            // base on that we can modify it easily, and won't affect each other
            // Add indexes to examples
            data.goal.targets.forEach((target) => {
                target.examples.forEach((example, index) => {
                    // Starting from 1
                    example["id"] = index;
                })
            })
            viewJSON(currentTargets)
            getTags()
            applyFilter()


        })
}


function viewJSON(targets) //as there was changing at fetch
{ // Displays table items
    let htmlString = ``
    targets.forEach(target => {
        // Display main row
        htmlString += `<div class="row-main" id="${target.id}">
                            <div class="table-item">${target.number}</div>
                            <div class="table-item">${target.description}</div>
                        </div>`
        //Changing how the examples are displayed, checking if the bin icon has been clicked (delete function activated) 
        //  then reconfiguring the array/table and then displaying it again.
        target.examples.forEach(example => {
            htmlString += `<div class="row-example" onclick="exampleDisplay(${target.id}, ${example.id})">
                                <div class="example-item">${example.title}</div>
                                <div class="example-item" id="rating-text">${example.rating}/5</div>
                                <div class="example-item" id="favourite" onclick="event.stopPropagation(); favouriteChange(${target.id}, ${example.id})">${(example.favourite) ? `\u2605` : `\u2729`}</div>
                                    <div class="icon-box">
                                        <div class="modify-icon" onclick="event.stopPropagation(); iniateModifyExample(${target.id}, ${example.id})"></div>
                                        <div class="delete-icon" onclick="event.stopPropagation(); iniateDeleteExample(${target.id}, ${example.id})"></div>
                                    </div>
                    </div>`
        })
    })
    document.getElementById("display-table").innerHTML = htmlString
}

function favouriteChange(targID, exID) // Current ID for target and example of favourite status
{
    const target = currentTargets.find(t => t.id == targID)
    const example = target.examples.find(ex => ex.id == exID)

    example.favourite = !(example.favourite)
    viewJSON(currentTargets)
}

function ratingFavouriteCreate() { // Will add random rating and favourite statuses
    console.log("yup")
    data.goal.targets.forEach(t => {
        t.examples.forEach(ex => {
            // Random number from 0 to 1
            let favouriteCheck = Math.floor(Math.random() * 2)

            // If 1, favourite is true. Otherwise, it's false
            ex["favourite"] = (favouriteCheck == 1) ? true : false

            // Random rating from 1-5
            ex["rating"] = Math.floor(Math.random() * 5 + 1)
        })
    })
}

function modalPopup(isDisplayed, modalString) // Added string parameter to add your own modal text
{ // Pops a modal up with specified items, or removes the modal if already showing
    const modal = document.getElementById("modal")
    const modStyle = document.getElementById("modal").style
    const modBackStyle = document.getElementById("modal-back").style
    if (isDisplayed) {
        modStyle.width = 0
        modStyle.opacity = 0
        modBackStyle.height = 0
        modBackStyle.opacity = 0
    }
    else {
        modStyle.width = "60%"
        modStyle.opacity = 1
        if (window.screen.width < 768)
        {
            modStyle.width = "80%"
        }
        modBackStyle.height = "100%"
        modBackStyle.opacity = 1
    }

    // Displays modal info when clicking row
    if (!isDisplayed) {
        // Put modal back in front
        modStyle.zIndex = 30

        // Argument used to display on modal
        modal.innerHTML = modalString
    }
    else {
        // Put modal behind ONLY after animation is done
        setTimeout(() => {
            modStyle.zIndex = 0
            modal.innerHTML = ""
        }, 200)
    }
}

function sortDisplay() { // Creates modal text for sorting

    // Radio buttons are divided into two sorting ways
    // First sort is by row
    // Second is by example
    // Both are combined to sort, giving user more freedom
    modalString = `<div class= "modal-header">
                        <h3 id= "modal-title">Sorting The Table</h3>
                    </div>
                    <div class= "display-as-row modal-content">
                        <div>
                            <div class="radio-div">
                                <input type="radio" id="r-id1" name="sort-row" value="r-id1" ${(currentRowSort === "r-id1") ? `checked` : ``}/>
                                <label for="r-id1">Row: ID | Ascending </label>
                            </div>
                            <div class="radio-div">
                                <input type="radio" id="r-id2" name="sort-row" value="r-id2" ${(currentRowSort === "r-id2") ? `checked` : ``}/>
                                <label for="r-id2">Row: ID | Descending </label> 
                            </div>
                            <div class="radio-div">
                                <input type="radio" id="r-title1" name="sort-row" value="r-description1" ${(currentRowSort === "r-description1") ? `checked` : ``}/>
                                <label for="r-title1">Row: Title | A-Z </label>  
                            </div>
                            <div class="radio-div">
                                <input type="radio" id="r-title2" name="sort-row" value="r-description2" ${(currentRowSort === "r-description2") ? `checked` : ``}/>
                                <label for="r-title2">Row: Title | Z-A </label>
                            </div>
                        </div>
                        <br>
                        <div>
                            <div class="radio-div">
                                <input type="radio" id="e-id1" name="sort-ex" value="e-id1" ${(currentExSort === "e-id1") ? `checked` : ``}/>
                                <label for="e-id1">Example: ID | Ascending </label> 
                            </div>
                            <div class="radio-div">
                                <input type="radio" id="e-id2" name="sort-ex" value="e-id2" ${(currentExSort === "e-id2") ? `checked` : ``}/>
                                <label for="e-id2">Example: Example | Descending </label> 
                            </div>
                            <div class="radio-div">
                                <input type="radio" id="e-title1" name="sort-ex" value="e-title1" ${(currentExSort === "e-title1") ? `checked` : ``}/>
                                <label for="e-title1">Example: Title | A-Z </label> 
                            </div>
                            <div class="radio-div">
                                <input type="radio" id="e-title2" name="sort-ex" value="e-title2" ${(currentExSort === "e-title2") ? `checked` : ``}/>
                                <label for="e-title2">Example: Title | Z-A </label>
                            </div>
                            <div class="radio-div">
                                <input type="radio" id="e-rating1" name="sort-ex" value="e-rating2" ${(currentExSort === "e-rating2") ? `checked` : ``}/>
                                <label for="e-rating1">Example: Rating | Best-Worst </label> 
                            </div>
                            <div class="radio-div">
                                <input type="radio" id="e-rating2" name="sort-ex" value="e-rating1" ${(currentExSort === "e-rating1") ? `checked` : ``}/> 
                                <label for="e-rating2">Example: Rating | Worst-Best </label> 
                            </div>
                        </div>
                    </div>
                    <div class= "modal-buttons">
                        <button onclick="sortingBy()">Submit</button>
                        <button onclick="hideForm()">Cancel</button>
                    </div>
                </div>`

    modalPopup(false, modalString)
}

function sortingBy() {
    // Sort values are in the following format
    // [r or e, based on row or example]-[key][1 or 2 based on ascending or not]
    // e.g. r-title2 = sort rows by title descending

    // Getting values for row
    currentRowSort = document.querySelector('input[name=sort-row]:checked').value // Set current sorting
    const sortRow = document.querySelector('input[name=sort-row]:checked').value // Get value from checked button
    // Get key from value
    const rowKey = sortRow.substring(2, sortRow.length - 1)
    // Boolean that checks if should be sorted ascending or not
    const rowAscending = (sortRow.charAt(sortRow.length - 1)) == 1

    // Getting value for sorting example
    currentExSort = document.querySelector('input[name=sort-ex]:checked').value // Set current sorting
    let sortExample = document.querySelector('input[name=sort-ex]:checked').value // Get value from checked button
    // Get key from value
    const exKey = sortExample.substring(2, sortExample.length - 1)
    // Boolean that checks if should be sorted ascending or not
    const exAscending = (sortExample.charAt(sortExample.length - 1)) == 1

    // Sort rows first
    if (rowAscending)
        currentTargets.sort((a, b) => a[rowKey] < b[rowKey] ? -1 : 1)
    else
        currentTargets.sort((a, b) => a[rowKey] > b[rowKey] ? -1 : 1)

    // Next examples
    if (exAscending) {
        currentTargets.forEach(t => {
            console.log(t.examples[0].rating)
            console.log(t.examples[1].rating)
            t.examples.sort((a, b) => a[exKey] < b[exKey] ? -1 : 1)
        })
    }
    else {
        currentTargets.forEach(t => {
            console.log(t.examples[0].rating)
            console.log(t.examples[1].rating)
            t.examples.sort((a, b) => a[exKey] > b[exKey] ? -1 : 1)
        })
    }

    viewJSON(currentTargets)
    hideForm()
}

function exampleDisplay(targID, exID) // Displays example info when example row is clicked
{
    let target = currentTargets.find(t => t.id == targID) //https://www.w3schools.com/jsref/jsref_find.asp
    let modalString = ``
    const example = target.examples.find(ex => ex.id == exID) // Finds current example 
    modalString += `<div class="modal-header">
                        <h3>${example.title}</h3>
                        <img src="Images/x.png" onclick="hideForm()">
                    </div>
                    <div class="modal-content">
                        <h4>Rating: ${example.rating}/5</h4>
                        <br>
                        <p id="ex-description">${example.description}</p>
                        <div class="images" style= "display: flex">` /*Hardcode for now*/

    example.images.forEach(image => {
        modalString += `<img src=${image}>`
    })
    modalString += `</div><br>
                        <h2>Tags</h2><br>`
    example.tags.forEach(tag => {
        modalString += `<p class="tag"><strong>${tag}</strong></p>`
    })

    modalString += `</div>`

    // Displays on modal
    modalPopup(false, modalString)
}

function searchItemsByTitle(title) {
    const searchItems = currentTargets.filter(target => target.description.toLowerCase().includes(title.toLowerCase()))
    viewJSON(searchItems)
}

function tagManager() {

    let tagOptions = `<option value="">Select tag option</option>`;
    alltags.forEach(tag => {
        tagOptions += `<option value="${tag}">${tag}</option>`;
    });

    let tagManagerString = `
                        <div class= "modal-header">
                            <h3>Tag Manager</h3>
                        </div>
                        <br>
                        <div class="modal-content display-as-row">
                            <div>
                                <h2>Add Tag</h2>
                                <input id="newTagName" placeholder="NewTagName" type="text">
                                <button class="button" onclick ="addTag(); modalPopup(true)">Add</button>
                            </div>

                            <div>
                                <h2>Delete tag</h2>
                                <select id="deleteTagName" placeholder="DeleteTagName" type="text">${tagOptions}</select>
                                <button class="button" onclick ="deleteTag(); modalPopup(true)">Delete</button>
                            </div>

                            <div>
                                <h2>Modify Tag</h2>
                                <select id="oldTag" placeholder="ModifyTag" type="text">${tagOptions}</select>
                                <input id="newTag" placeholder="NewTagName" type="text">
                                <button class="button" onclick ="modifyTag(); modalPopup(true)">Modify</button>
                            </div>
                        </div>
                        
                        <br><br>
                        <div class= "modal-buttons">
                            <button id="closeButton" onclick="modalPopup(true)">Cancel</button>
                        </div>
                    `
    modalPopup(false, tagManagerString)
    console.log(tagManagerString)
}

function filterOpen() {
    let modalString = `
        <div class="modal-header"><h3>Tags</h3></div>
        <br>
        <div id="Filter-table"></div>
        <div id= "option" class= "modal-buttons">
            <button onclick="applyFilter(); modalPopup(true)">Apply</button>
            <button onclick="clearTags()" style="margin-right: 30px">Clear</button>
            <button id="closeButton" onclick="modalPopup(true)">Cancel</button>
        </div>
    `
    modalPopup(false, modalString)

    document.getElementById("Filter-table").innerHTML = getTags()
}

function getTags() {
    let tagsString = ``
    alltags = []

    //go by each element until reach tags
    data.goal.targets.forEach(target => {

        target.examples.forEach(example => {
            example.tags.forEach(tag => {

                //basse on the alltags array created, if doesnt exist in that array, add the tags in
                if (!alltags.includes(tag)) //https://www.w3schools.com/jsref/jsref_includes_array.asp
                {
                    alltags.push(tag) //boom, ${tag} has been added in  (lmao)
                }
            })
        })
    });

    // display tags in modal, literally same shit as Andrea did for the car example
    alltags.forEach(tag => {
        tagsString +=
            `<div class="tag-div">
                <th><input class="tag-Checkbox" type="checkbox" value="${tag}"></th>
                <th>${tag}</th>
            </div>`
    })


    return tagsString
}

function addTag() {
    let newTag = document.getElementById("newTagName").value


    data.goal.targets.forEach(target => {
        target.examples.forEach(example => {
            if (!example.tags.includes(newTag)) {
                example.tags.push(newTag)
            }
        })
    });

    //document.getElementById("Filter-table").innerHTML = getTags()
}

function deleteTag() {
    let tagName = document.getElementById("deleteTagName").value


    data.goal.targets.forEach(target => {
        target.examples.forEach(example => {
            example.tags = example.tags.filter(tag => tag !== tagName) //filter the targetName
        })
    });

    //document.getElementById("Filter-table").innerHTML = getTags()

}

function modifyTag() {
    let oldTag = document.getElementById("oldTag").value
    let newTag = document.getElementById("newTag").value

    data.goal.targets.forEach(target => {
        target.examples.forEach(example => {
            example.tags = example.tags.map(tag => {
                if (tag === oldTag) // checking the tag is equal with the oldTag Value or not
                {
                    return newTag //if so, the value of tag will change to the value of newtag
                }
                else {
                    return tag//else, the value of tag will remain as tag
                }
            })
        })
    });


    //document.getElementById("Filter-table").innerHTML = getTags()
}

function applyFilter() {
    let checkBoxes = document.getElementsByClassName("tag-Checkbox") // to get every checkbox information
    let selectedtags = []

    for (let i = 0; i < checkBoxes.length; i++) {
        // checking whether which boxes were ticked, if so push the value which means
        //  the name of the tag to the array (selectedTags)
        if (checkBoxes[i].checked) {
            selectedtags.push(checkBoxes[i].value)
        }
    }

    if (selectedtags.length === 0) {
        currentTargets = data.goal.targets
        viewJSON(currentTargets)
        return //let the code stop at here
    }

    // to filter the selected targets and example out
    let filteredTargets = data.goal.targets.map(target => {
        let newExamples = target.examples.filter(
            example => selectedtags.some(
                tag => example.tags.includes(tag))) //checking what tag is existed

        //return a new array with the example that only exist in those selected tags
        // those doesnt consist selected tags example will be directly delete but the arrays will still exist 
        // with nothing inside
        return {
            ...target, examples: newExamples
        }
    })
    //to filter those targets(title) were doesnt contain any example
    filteredTargets = filteredTargets.filter(target => target.examples.length > 0)

    currentTargets = filteredTargets
    viewJSON(currentTargets)
}

function clearTags() {
    let checkBoxes = document.getElementsByClassName("tag-Checkbox")

    for (let i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].checked = false
    }

    currentTargets = data.goal.targets
    viewJSON(currentTargets)
}

//function to hide the table and show the form
function showAddForm() {
    //This a for loop for the target box in the add form
    let selectHTML = "";
    for (let i = 1; i <= 8; i++) {
        // This creates the list from 12.1 to 12.8 
        selectHTML += `<option value="${i}">12.${i}</option>`;
    }
    document.getElementById("newTarget").innerHTML = selectHTML;

    //For loop for the tag options in the add-form
    let tagHTML = "";
    for (let i = 1; i <= alltags.length; i++) {
        tagHTML += `<option value="${alltags[i - 1]}">${alltags[i - 1]}</option>`;
    }
    document.getElementById("newTag1").innerHTML += tagHTML;
    console.log(document.getElementById("newTag1").innerHTML)
    document.getElementById("newTag2").innerHTML += tagHTML;
    document.getElementById("newTag3").innerHTML += tagHTML;
    document.getElementById("newTag4").innerHTML += tagHTML;

    // Getting the html from the existing addExample form/div
    const formHtml = document.getElementById('addExample').innerHTML;

    // Wrapping it in a string for the modal to display. Also styling this div on css
    const modalContent = `
        <div class="add-form-modal">
            ${formHtml}
        </div>
    `

    // Displaying the modal with the string inside
    modalPopup(false, modalContent);
}

//function to reverse the view back to the table 
function hideForm() {
    //This will close close the modal pop up and remove the string
    modalPopup(true, 0);
}


function processAdd() {

    //Looking specifically for the content in the modal/div
    const modal = document.getElementById('modal');

    // Getting the values from the user entered from the modal first (not picking up ghost values from addExample in the background)
    let targetNum = parseInt(modal.querySelector('#newTarget').value);
    let t = modal.querySelector('#newTitle').value;
    let r = modal.querySelector('#newRating').value;
    let d = modal.querySelector('#newDesc').value;
    let i = modal.querySelector('#newImg').value;

    let tag_one = modal.querySelector('#newTag1').value;
    let tag_two = modal.querySelector('#newTag2').value;
    let tag_three = modal.querySelector('#newTag3').value;
    let tag_four = modal.querySelector('#newTag4').value;

    // Running the add function
    addExample(targetNum, t, r, d, i, tag_one, tag_two, tag_three, tag_four);
}


function addExample(targetIndex, title, rating, desc, img, tag1, tag2, tag3, tag4) {

    //Creating this new object of objects identical to 
    let targetList = data.goal.targets[targetIndex - 1];

    //This sets a unique id for the next example in the target
    let newId = targetList.examples.length;

    let newEntry = {
        id: newId, //unique (last id + 1)
        title: title,
        rating: rating,
        description: desc,
        images: [img],
        tags: [tag1, tag2, tag3, tag4]
    };

    targetList.examples.push(newEntry);


    // Updating current targets for filtering + searching functions working properly (Gary)
    currentTargets = data.goal.targets;

    //Hiding the add form and now displaying the updated table
    hideForm();
    viewJSON(data.goal.targets);

    //Clearing the inputs
    document.getElementById('newTitle').value = "";
    document.getElementById('newRating').value = "";
    document.getElementById('newDesc').value = "";
    document.getElementById('newImg').value = "";
    document.getElementById('newTag1').value = "";
    document.getElementById('newTag2').value = "";
    document.getElementById('newTag3').value = "";

}

function iniateDeleteExample(targID, exID) {
    // Finding+Matching the id of the object in your array and with the id of the target (example) row specifically (very important these match)
    let target = data.goal.targets.find(t => t.id == targID);

    // Wrapping it in a string for the modal to display. Also styling this div on css
    const modalContent = `
        <div class="modal-content">
            <p style="font-size: 30px">Are you sure you want to delete "${target.examples[exID].title}"?<p>
        </div>
        <br>
        <div class= "modal-buttons">
            <button onclick="deleteExample(${targID}, ${exID}); ">Confirm-delete</button>
            <button onclick="hideForm()">Cancel</button>
        </div>
    `;

    // Displaying the modal with the string inside
    modalPopup(false, modalContent);

}

function deleteExample(targID, exID) {
    let target = data.goal.targets.find(t => t.id == targID);

    //Deletes/Removes this one example from the array
    target.examples.splice(exID, 1);

    // Loop through example array, reset example IDs so they're ID's are all updated.
    target.examples.forEach((ex, index) => {
        ex.id = index;
    });

    // Displaying updated table
    hideForm()
    viewJSON(data.goal.targets);
}

function iniateModifyExample(targID, exID) {
    // Finding+Matching to use the correct target and example objects
    let target = data.goal.targets.find(t => t.id == targID);
    let example = target.examples.find(ex => ex.id == exID);

    //Getting all of the tag options displayed for each select tag box
    let tagOptions = `<option value="">Select tag option</option>`;
    alltags.forEach(tag => {
        tagOptions += `<option value="${tag}">${tag}</option>`;
    });

    // Wrapping it in a string for the modal to display. Also styling this div on css
    const modalContent = `
        <div class="modal-header">
            <h3>Modify Example</h3>
        </div>
            
        <div class="modal-content">
            <p>Target:12.${targID}</p> 
            
            <input type="text" id="modTitle" value="${example.title}">
            <input type="text" id="modDesc" value="${example.description}">
            <input type="text" id="modImg" value="${example.images[0]}">
        
            <h2>Tags</h2>

            <select id="modTag1">${tagOptions}</select>
            <select id="modTag2">${tagOptions}</select>
            <select id="modTag3">${tagOptions}</select>
            <select id="modTag4">${tagOptions}</select>
        </div>

        <div class= "modal-buttons">
            <button onclick="saveModify(${targID}, ${exID})">Update Record</button>
            <button onclick="hideForm()">Cancel</button>
        </div>`

    // Displaying the modal with the string inside
    modalPopup(false, modalContent);

}

//Updating/Modifying your example 
function saveModify(targID, exID) {
    let target = data.goal.targets.find(t => t.id == targID);
    let example = target.examples.find(ex => ex.id == exID);

    //Grab values in the boxes and modify the current examples values
    example.title = document.getElementById('modTitle').value;
    example.description = document.getElementById('modDesc').value;
    example.images = [document.getElementById('modImg').value];
    example.tags[0] = document.getElementById('modTag1').value;
    example.tags[1] = document.getElementById('modTag2').value;
    example.tags[2] = document.getElementById('modTag3').value;
    example.tags[3] = document.getElementById('modTag4').value;

    currentTargets = data.goal.targets;

    //Refresh the screen 
    hideForm();
    viewJSON(currentTargets);

}

function hamburgerDisplay() {
    const hamMenu = document.querySelector(".hamburger-menu")

    hamMenu.classList.toggle("menu-active")
}