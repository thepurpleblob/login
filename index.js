
require('dotenv').config()
const fs = require('fs')
const axios = require('axios')
const { URLSearchParams } = require('url')

const token = process.env.REST_TOKEN
const url = process.env.REST_URL


let lines = []
try {
    lines = fs.readFileSync(process.env.CSV_FILE, 'utf8').split('\n').filter(Boolean)
} catch (err) {
    console.log(err)
    process.exit()
}

fs.writeFileSync(process.env.OUT_FILE, 'username, firstname, lastname, last access')
let out = '';
lines.forEach(element => {
    const params = new URLSearchParams()
    params.append('criteria[0][key]', 'username')
    params.append('criteria[0][value]', element)
    let moodlep = axios.post(url + '?wstoken=' + token + '&wsfunction=core_user_get_users&moodlewsrestformat=json', params)
    moodlep.then(result => {
        const user = result.data.users[0]
        const lastaccess = user.lastaccess
        const username = user.username
        const firstname = user.firstname
        const lastname = user.lastname

        const date = new Date(lastaccess * 1000)
        const formattedaccess = date.toISOString()

        const outline = username + ',' + firstname + ',' + lastname + ',' + formattedaccess + '\n'
        console.log(outline)
        fs.appendFileSync(process.env.OUT_FILE, outline)
    })
    .catch(error => {
        console.log(error.message)
    })

    
})

console.log(out)
