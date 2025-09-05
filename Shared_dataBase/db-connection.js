import Fastify from 'fastify';

const sqlite = require('sqlite3').verbose

const path = require('path')


class Database 
{
    constructor() 
    {
        const db_path = path.join(__dirname, '../database/transcendence.db')
        this.db = new sqlite.Database(db_path, (err) =>
        {
            if (err)
                console.error('Database opening error: ', err);
            else
                console.log("Connecting to database ");
        })         
        this.initTables()
    }
}

    initTables() 
    {
        // Users table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            avatar TEXT,
            is_42_user BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)
}