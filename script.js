function saveBoard() {
    console.log("Saving to localStorage...");
    const boardState = {};

    const lists = document.querySelectorAll('.list');
    lists.forEach(list => {
        const listId = list.id;
        const cards = list.querySelectorAll('.card');
        boardState[listId] = [];

        cards.forEach(card => {
            boardState[listId].push({
                id: card.id,
                text: card.textContent
            });
        });
    });

    localStorage.setItem('kanbanBoard', JSON.stringify(boardState));
}


let cardIdCounter = 4; // update this if you add more cards later

document.querySelector('.enter').addEventListener('click', () => {
    const taskText = prompt('Enter task name:');
    if (!taskText) return;

    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.setAttribute('draggable', 'true');
    newCard.setAttribute('id', `card${cardIdCounter++}`);
    newCard.textContent = taskText;

    // Attach the existing drag handlers
    newCard.addEventListener("dragstart", dragStart);
    newCard.addEventListener("dragend", dragEnd);

    // Append to the "To Do" column
    document.getElementById('list1').appendChild(newCard);
    saveBoard();

});

let deleteMode = false;

document.querySelector('.delete').addEventListener('click', () => {
    deleteMode = !deleteMode;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (deleteMode) {
            card.classList.add('deleting');
            card.addEventListener('click', deleteCardOnce);
        } else {
            card.classList.remove('deleting');
            card.removeEventListener('click', deleteCardOnce);
        }
    });
});


const cards = document.querySelectorAll(".card");
const lists = document.querySelectorAll(".list");

for (const card of cards){
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);

}
for(const list of lists){
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop",dragDrop);
}

function dragStart(e){
    e.dataTransfer.setData("text/plain", this.id);
}
function dragEnd(){
    console.log("Drag ended");
}
function dragOver(e){
    e.preventDefault();
}
function dragEnter(e){
    e.preventDefault();
    this.classList.add('over');
}
function dragLeave(e){
    this.classList.remove('over');
}
function dragDrop(e){
    const id = e.dataTransfer.getData("text/plain");
    const card= document.getElementById(id);
    this.appendChild(card);
    saveBoard();
    this.classList.remove("over");
}

function deleteCardOnce(e) {
    if (!deleteMode) return;
    e.stopPropagation(); // Prevent event bubbling
    this.remove();
saveBoard();
}

window.addEventListener('load', () => {
    const saved = localStorage.getItem('kanbanBoard');
    if (!saved) return;

    const boardState = JSON.parse(saved);
    for (const listId in boardState) {
        const list = document.getElementById(listId);
        boardState[listId].forEach(cardData => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('draggable', 'true');
            card.setAttribute('id', cardData.id);
            card.textContent = cardData.text;

            card.addEventListener("dragstart", dragStart);
            card.addEventListener("dragend", dragEnd);

            list.appendChild(card);

            const idNum = parseInt(cardData.id.replace('card', ''));
            if (idNum >= cardIdCounter) {
                cardIdCounter = idNum + 1;
            }
        });
    }
});

