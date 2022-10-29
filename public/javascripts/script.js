const form = document.getElementById('res') 
form.addEventListener('submit', login)    
async function login(event){
  event.preventDefault()
  const name = document.getElementById('name').value
  const password = document.getElementById('password').value
  const result = await fetch('/users/register',{
    method:'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      password
    })
    }).then((res) => res.json())
  if (result.status === 'ok'){
    console.log('Got the token: ', result.data)
    // localStorage.setItem('token', result.data)
    window.location.href = "http://localhost:3000/home";
  }else {
    alert(result.error)
  }
}