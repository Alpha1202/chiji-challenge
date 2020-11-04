import { Article, User } from '../../db/models'
import slugGen from '../../services/slugGen'
import urlExtractor from '../../services/urlExtractor'

/**
 * @description Article Controller
 * @class ArticleController
 */
class PostController {
  /**
   * @description - Creates a new post
   * @static
   * @async
   * @param {object} req - create post request object
   * @param {object} res - create post response object
   * @returns {object} new post
   *
   */
  static async createPost(req, res) {
    try {
      const { title, description, body } = req.body

      const userId = req.user
      const images = req.files
      const imageUrl = urlExtractor(images)
      const slug = slugGen(title)

      const newPostDetails = {
        title,
        slug,
        description,
        body,
        imageUrl,
        userId,
      }

      const newPost = await Article.create(newPostDetails)

      const { id } = newPost

      return res.status(201).json({
        status: 201,
        message: 'Post successfully created',
        data: [newPost],
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   * @description - Get a single post
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} post
   *
   */
  static async getPost(req, res) {
    try {
      const { slug } = req.params

      const post = await Article.findOne({
        where: {
          slug,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'userName', 'imageUrl'],
          },
        ],
      })

      return res.status(200).json({
        status: 200,
        message: `Operation Successful`,
        data: [post],
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   * @description - Get all post authored by a specific user
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} post
   *
   */
  static async getAllPostsByAUser(req, res) {
    try {
      const { userId } = req.params

      const { count, rows: posts } = await Article.findAndCountAll({
        where: {
          userId,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      })

      return res.status(200).json({
        status: 200,
        message: 'All posts fetched successfully',
        data: [
          {
            posts,
            totalPost: count,
          },
        ],
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   * @description - Get all posts
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} post
   *
   */
  static async getAllPosts(req, res) {
    try {
      const { count, rows: posts } = await Article.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        order: [['id', 'ASC']],
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'userName', 'imageUrl'],
          },
        ],
      })

      return res.status(200).json({
        status: 200,
        message: 'All post fetched successfully',
        data: [
          {
            posts,
            totalArticles: count,
          },
        ],
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   * @description - Users update their posts
   * @static
   * @async
   * @param {object} req - request
   * @param {object} res - response
   * @returns {object} post
   *
   */
  static async updatePost(req, res) {
    try {
      const { slug } = req.params
      const userId = req.user

      const getPost = await Article.findOne({
        where: {
          slug,
        },
        attributes: {
          include: ['userId'],
        },
      })

      if (userId !== getPost.userId) {
        return res.status(403).json({
          status: 403,
          message: "You don't have the permission to carry out this operation",
        })
      }

      const { title, description, body } = req.body

      const images = req.files
      const imageUrl = urlExtractor(images)

      const editedPost = {
        title,
        description: description || getPost.description,
        body,
        imageUrl: imageUrl || getPost.imageUrl,
      }

      const result = await Article.update(editedPost, {
        where: {
          slug,
        },
        returning: true,
      })
      const { id } = getPost
      const updatedPost = result[1][0]

      return res.status(200).json({
        status: 200,
        message: 'Post successfully updated',
        data: {
          id: updatedPost.id,
          title: updatedPost.title,
          slug: updatedPost.slug,
          description: updatedPost.description,
          body: updatedPost.body,
          imageUrl: updatedPost.imageUrl,
          updatedAt: updatedPost.updatedAt,
        },
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   * @description - Deletes a post
   * @static
   * @async
   * @param {object} req - delete post request object
   * @param {object} res - delete post response object
   * @returns {object} delete action response
   *
   */
  static async deletePost(req, res) {
    try {
      const dataValues = res.locals.article

      const { slug } = dataValues

      await Article.destroy({ where: { slug } })

      return res.status(200).json({
        status: 200,
        message: 'Article successfully deleted',
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }
}

export default PostController
