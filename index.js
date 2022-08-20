const express = require('express')
const { auth } = require('google-auth-library')
const {google, GoogleApis} = require('googleapis')

const app = express()

app.get('/',async (req,res)=>{
    ///crediantials.json is a service account created from console.cloud.google.com

    const auth = new google.auth.GoogleAuth({
        keyFile:'credentials.json',
        scopes:"https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();
    
    const googleSheets = google.sheets({version:'v4',auth:client});
    ///spreadsheetId in which we want to work, The spreadsheet also has to be shared with edit option to the service account
    const spreadsheetId='1N0ywk-i_r7GvWhtjXmG4GV34GEWbyPK9be47aym3JPc';
    const metadata = await googleSheets.spreadsheets.get({auth,spreadsheetId}); 
    // res.send(metadata.data) 
    
    ///read rows from spreadsheet with sheet name Sheet1
    const rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:'Sheet1'
    })
    ///read from another sheet within the same spreadsheet
    const rows2 = await googleSheets.spreadsheets.values.get({auth,spreadsheetId,range:'July'})
    console.log('rows1 = ',rows.data)
    console.log('rows2 = ',rows2.data)
    
    //write
    await googleSheets.spreadsheets.values.append({
        auth,spreadsheetId,range:'July',
        valueInputOption:'USER_ENTERED',
        resource:{
            values:[
                ['foo'],
                ['moo']
            ]
        }
    })
    res.send(rows.data)
})

app.listen(1234,(req,res)=>{
    console.log("Running on port 1234")
})

