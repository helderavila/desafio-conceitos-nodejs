const express = require("express");
const { uuid } = require('uuidv4')
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  if (repositories.length === 0) return response.status(400).json({
    status: 400,
    friendlyMsg: 'Repositories not found'
  })

  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository)
  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(r => r.id === id)

  if (repositoryIndex < 0) return response.status(400).json({ status: 400, friendlyMsg: 'Repository not found' })

  repositories[repositoryIndex].title = title
  repositories[repositoryIndex].url = url
  repositories[repositoryIndex].techs = techs

  return response.status(200).json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(r => r.id === id)

  if (repositoryIndex < 0) return response.status(400).json({ status: 400, friendlyMsg: 'Repository not found' })

  repositories.splice(repositoryIndex, 1)

  return response.status(204).json({
    status: 204,
    friendlyMsg: 'Repository deleted'
  })

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(r => r.id === id)

  if (repositoryIndex < 0) return response.status(400).json({ status: 400, friendlyMsg: 'Repository not found' })

  repositories[repositoryIndex].likes += 1

  return response.status(200).json({
    likes: repositories[repositoryIndex].likes
  })
});

module.exports = app;
