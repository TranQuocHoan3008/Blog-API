exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/car.jpg",
        creator: {
          name: "Tran Quoc Hoan",
        },
        date: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;
  const name = req.body.creator.name;
  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      id: new Date().toISOString().split("T")[0],
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: {
        name: name,
      },
    },
  });
};
