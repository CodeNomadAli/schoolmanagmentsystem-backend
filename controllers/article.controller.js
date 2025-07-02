import Article from "../models/article.model.js";
import articleValidationSchema from "../validations/article.validation.js";
import mongoose from "mongoose";

const createArticle = async (req, res) => {
  try {
    const articleData = req.body;

    // Validate article data using the schema
    const { error, value } = articleValidationSchema.validate(articleData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const article = await Article.create(value);

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({
      success: false,
      message: "Error creating article",
      error: error.message,
    });
  }
};

const getAllArticles = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "username profileImage email");

    const total = await Article.countDocuments(query);

    res.status(200).json({
      success: true,
      articles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: error.message,
    });
  }
};

const getArticlesByWriterId = async (req, res) => {
  const author = req.user.id;
  try {
    const { status, page = 1, limit = 10, search = "" } = req.query;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    // Build query
    const query = {};

    if (status) query.status = status;

    if (search.trim() !== "") {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: { $regex: regex } },
        { content: { $regex: regex } },
      ];
    }

    // Fetch filtered and paginated articles
    const articles = await Article.find(query)
      .populate("author", "username profileImage email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    const total = await Article.countDocuments(query);

    res.status(200).json({
      success: true,
      articles,
      pagination: {
        total,
        page: parsedPage,
        pages: Math.ceil(total / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching writer's articles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching writer's articles",
      error: error.message,
    });
  }
};

const getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Input validation
        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Invalid slug provided",
                error: "Slug must be a non-empty string"
            });
        }

        // Sanitize the slug
        const sanitizedSlug = slug.trim().toLowerCase();

        // Find the article
        const article = await Article.findOne({ slug: sanitizedSlug })
            .populate("author", "username email profileImage")
            .lean();

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
                error: `No article found with slug: ${sanitizedSlug}`
            });
        }

        // Increment view count
        await Article.findByIdAndUpdate(article._id, {
            $inc: { viewsCount: 1 }
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Article retrieved successfully",
            article
        });

    } catch (error) {
        // Log the error with detailed information
        console.error("Error in getArticleBySlug:", {
            error: error.message,
            stack: error.stack,
            slug: req.params.slug,
            timestamp: new Date().toISOString()
        });

        // Handle specific error types
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid article format",
                error: "The article data is malformed"
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.message
            });
        }

        // Handle database connection errors
        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            return res.status(503).json({
                success: false,
                message: "Database service unavailable",
                error: "Unable to connect to the database"
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "An unexpected error occurred while fetching the article"
        });
    }
};

const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID format",
      });
    }

    const article = await Article.findById(id).populate(
      "author",
      "username email profileImage"
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: error.message,
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate update data using the schema
    const { error, value } = articleValidationSchema.validate(updateData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Update article with validated data
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      success: false,
      message: "Error updating article",
      error: error.message,
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    await Article.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting article",
      error: error.message,
    });
  }
};

const checkSlugUniqueness = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required"
      });
    }

    // Find article with the given slug
    const existingArticle = await Article.findOne({ slug });

    return res.status(200).json({
      success: true,
      isUnique: !existingArticle,
      message: existingArticle ? "Slug already exists" : "Slug is available"
    });

  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while checking slug uniqueness"
    });
  }
};




const generateSlug = async (req, res) => {
  try {
    const { title } = req.body;
    let slug;

    if (title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    } else {
      // Generate random slug if no title provided
      const randomString = Math.random().toString(36).substring(2, 8);
      slug = `article-${randomString}`;
    }

    // Check if slug exists and append number if needed
    let isUnique = false;
    let counter = 1;
    let finalSlug = slug;

    while (!isUnique) {
      const existingArticle = await Article.findOne({ slug: finalSlug });
      if (!existingArticle) {
        isUnique = true;
      } else {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
    }

    res.status(200).json({
      success: true,
      slug: finalSlug
    });
  } catch (error) {
    console.error("Error generating slug:", error);
    res.status(500).json({
      success: false,
      message: "Error generating slug",
      error: error.message
    });
  }
};

export {
  createArticle,
  getAllArticles,
  getArticlesByWriterId,
  getArticleBySlug,
  getArticleById,
  updateArticle,
  deleteArticle,
  checkSlugUniqueness,
  generateSlug,
};
