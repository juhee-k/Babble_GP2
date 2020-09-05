const users = [];

//Join user to chat
function userJoin(id, username, room) {

    const user = { id, username, room };

    user.push(user);

    return user;

};

//User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {

        return users.splice(index, 1)[0];

    }
}

//Get current user
function getCurrentUser (id) {
    return users.find(user => user.id === id)
};

//Get room user 
function getRoomUsers () {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};