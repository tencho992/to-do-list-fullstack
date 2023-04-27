var thumbUp = document.getElementsByClassName("fa-thumbs-up");
const done = document.querySelector('.thanksPatricia')
const trash = document.getElementsByClassName("delete");
const task = document.querySelector('#tasks').value
const all = document.querySelector('.messages');



Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        
        const task = this.parentNode.parentNode.childNodes[1].innerText
        console.log(task)
        // const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('/messages/completed', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'msg': task,
            'completed': true
          })
          

        })
        .then(response => {
          if (response.ok){
            return response.json()
          }
          
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'msg': task,
        'completed': true
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

