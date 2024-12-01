const BlogList = ({ blogs }) => {
  return (
    <div className="blog-list">
      {blogs.map(blog => (
        <div className="blog-preview" key={blog.id}>
          <div className="blog-text">
            <h2>{blog.title}</h2>
            {blog.type === "vegetable" && (
              <>
                <p className="price-per-kg">{blog.pricePerKg} €/kg</p>
                <span className="weight-badge">{blog.weight}</span>
              </>
            )}
            {blog.type === "product" && (
              <span className="weight-badge">{blog.pieces}</span>
            )}
          </div>
          <span className="price">{blog.price}</span>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
