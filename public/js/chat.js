const socket = io()

const $messageForm = document.querySelector('form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const messageLocationTemplate = document.querySelector('#message-location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    // New message element

    const $newMessage = $messages.lastElementChild


    // Height of the last message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height

    const visibleHeight = $messages.offsetHeight

    // Height of messages container

    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('emit_message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        message:msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a'),
        username: msg.username
        
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageLocationTemplate, {
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a'),
        username: msg.username
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const message = $messageFormInput.value
    if(!message){
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.focus()
        return alert('Du must eine Schreiben machen')
    }
        
    socket.emit('message',message, error => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error)
            return console.log(error)

        console.log('The message was delivered')
    })
}) 



$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords
        socket.emit('sendLocation',{latitude,longitude}, (msg) => {
            $sendLocationButton.removeAttribute('disabled')
            console.log(msg)
        })
    })

})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
        
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})