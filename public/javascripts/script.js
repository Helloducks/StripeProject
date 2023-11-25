function areYouSure(){
    return confirm("Are you sure You want to delete this Item??");
}

var deleteButton = document.getElementById("deleteButton");
console.log(deleteButton);
deleteButton.addEventListener('click',function(){
    areYouSure();
})