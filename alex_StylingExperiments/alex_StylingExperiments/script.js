// document.addEventListener("DOMContentLoaded", () => {
//     document.querySelector(".modal-button")
//     .addEventListener("click", event => {
//       // render the modal
//     })
//   },

// function renderModal(element){
//   // create the background modal div
//   const modal = document.createElement("div")
//   modal.classList.add("modal")
//   // create the inner modal div with appended argument
//   const child = document.createElement("div")
//   child.classList.add("child")
//   child.innerHTML = element
//   // render the modal with child on DOM
//   modal.appendChild("child")
//   document.body.appendChild("modal")
// })

// function removeModal(){
//     // find the modal and remove if it exists
//     const modal = document.querySelector('.modal')
//     if (modal) {
//       modal.remove()
//     }
//   }
//   function renderModal(element){
//     // remove modal if background clicked
//     modal.addEventListener('click', event => {
//       if (event.target.className === 'modal') {
//         removeModal()
//       }
//     })
//   }