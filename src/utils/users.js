const users = []

// addUser, removeUser, getUser, getUsersInRoom


const addUser = ({id, username, room}) => {
    // Clear the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }


    const existingUser = users.find((user => user.room === room && user.username === username))

    if(existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //Store user

    const user = {id, username, room }

    users.push(user)

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1)
        return users.splice(index, 1)[0]
}

const getUser = (id) => {
    const user = users.filter(user => user.id === id)[0]
    return user
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    usersInRoom = users.filter(user => user.room === room)
    return usersInRoom
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}