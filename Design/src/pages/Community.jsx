import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap';

// Dummy community posts
const dummyPosts = [
  {
    id: 1,
    title: 'How to control pests in wheat?',
    author: 'Rajesh',
    date: '07/09/2025',
    category: 'Pests',
    replies: 5,
    likes: 12,
  },
  {
    id: 2,
    title: 'Best fertilizer for maize?',
    author: 'Anjali',
    date: '05/09/2025',
    category: 'Fertilizer',
    replies: 3,
    likes: 8,
  },
  {
    id: 3,
    title: 'Organic farming tips for vegetables',
    author: 'Sunil',
    date: '03/09/2025',
    category: 'Organic',
    replies: 7,
    likes: 15,
  },
  {
    id: 4,
    title: 'Weather forecast affecting paddy crops',
    author: 'Meena',
    date: '02/09/2025',
    category: 'Weather',
    replies: 4,
    likes: 10,
  },
  {
    id: 5,
    title: 'How to increase storage life of onions?',
    author: 'Ramesh',
    date: '01/09/2025',
    category: 'Storage',
    replies: 2,
    likes: 5,
  },
];

function Community() {
  const [posts, setPosts] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPosts(dummyPosts);
    }, 500);
  }, []);

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newQuestion) return;

    const newPost = {
      id: posts.length + 1,
      title: newQuestion,
      author: 'You',
      date: new Date().toLocaleDateString(),
      category: newCategory,
      replies: 0,
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    setNewQuestion('');
    setNewCategory('General');
  };

  const handleLike = (id) => {
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
  };

  return (
    <div className="container mt-4 mb-4">
      <h2 className="text-center mb-4">Community</h2>

      {/* Ask Question Form */}
      <Form onSubmit={handleAddPost} className="mb-4 d-flex flex-wrap gap-2 align-items-center">
        <Form.Control
          type="text"
          placeholder="Ask a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          required
        />
        <Form.Select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        >
          <option value="General">General</option>
          <option value="Pests">Pests</option>
          <option value="Fertilizer">Fertilizer</option>
          <option value="Organic">Organic</option>
          <option value="Weather">Weather</option>
          <option value="Storage">Storage</option>
        </Form.Select>
        <Button type="submit" variant="success">Post</Button>
      </Form>

      {/* Questions List */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {posts.map((post) => (
          <Col key={post.id}>
            <Card
              className="h-100 shadow-sm"
              style={{ transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {post.author} | {post.date} | <Badge bg="info">{post.category}</Badge>
                </Card.Subtitle>
                <Card.Text>
                  Replies: {post.replies} | Likes: {post.likes}
                </Card.Text>
                <Button size="sm" variant="outline-success" onClick={() => handleLike(post.id)}>
                  Like
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Community;
