import {MongoClient} from "mongodb"
import * as dotenv from 'dotenv'
import {BlogsTypeInDB} from "../models/blogs-models";
import {UsersTypeInDB} from "../models/users-models";
import {PostsTypeInDB} from "../models/posts-models";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'

export const client = new MongoClient(mongoUrl)

export const runDb = async () => {
    try {
        await client.connect()
        console.log('Connected successfully to mongo db')
    } catch (err) {
        console.log(`Can't connect to mongo db: ` + err)
        await client.close()
    }
}

const db = client.db('service')
export const blogsCollection = db.collection<BlogsTypeInDB>('blogs')
export const postsCollection = db.collection<PostsTypeInDB>('posts')
export const usersCollection = db.collection<UsersTypeInDB>('users')
