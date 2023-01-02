import request from 'supertest'
import {app} from '../../src/app'
import {HTTP_STATUSES} from '../../src/constats/status'
import {CommentsTypeInput} from "../../src/models/comments-models";
import {PostsTypeInput} from "../../src/models/posts-models";
import {BlogsTypeInput} from "../../src/models/blogs-models";

const correctBlog: BlogsTypeInput = {
    name: 'Name',
    description: 'Description',
    websiteUrl: 'https://testurl.com'
}

const correctPost: PostsTypeInput = {
    title: 'Title',
    shortDescription: 'Short Description',
    content: 'Content',
    blogId: '1'
}

const correctUser = {
    login: 'login',
    password: 'password',
    email: 'email@gmail.com'
}

const correctLogin = {
    loginOrEmail: 'login',
    password: 'password'
}

const correctComment: CommentsTypeInput = {
    content: "content content content content more 20"
}


let createdComment: any = null
let createdUser: any = null
describe('/comments', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
        const createdResponseBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(correctBlog)
            .expect(HTTP_STATUSES.CREATED_201)
        const createdBlog = createdResponseBlog.body
        correctPost.blogId = createdBlog.id
        const createdResponsePost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(correctPost)
            .expect(HTTP_STATUSES.CREATED_201)
        const createdPost = createdResponsePost.body
        const createdResponseUser = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(correctUser)
            .expect(HTTP_STATUSES.CREATED_201)
        createdUser = createdResponseUser.body
        const createdResponseToken = await request(app)
            .post('/auth/login')
            .send(correctLogin)
            .expect(HTTP_STATUSES.OK_200)
        const createdToken = createdResponseToken.body
        const createdResponseComment = await request(app)
            .post('/posts' + '/' +createdPost.id + '/comments')
            .set('Authorization', 'Bearer ' + createdToken.accessToken)
            .send(correctComment)
            .expect(HTTP_STATUSES.CREATED_201)
        createdComment = createdResponseComment.body
    })
    it('GET /comments/bad-id: should return 404 for not existing comments', async () => {
        await request(app)
            .get('/comments/999')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`GET /comments/id: should return comments by id`, async () => {
        const response = await request(app)
            .get('/comments' + '/' + createdComment.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctComment,
            userId: createdUser.id,
            userLogin: createdUser.login,
            createdAt: expect.any(String)
        })
    })
})