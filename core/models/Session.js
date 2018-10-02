module.exports = {
  schema: {
    properties: {
      id: {
        type: "integer"
      },
      name: {
        type: "string"
      },
      description: {
        type: "string"
      }
    }
  },
  
  api: {
    "session/:id": [
      RestService.findOne("session")
    ],
    "session": [
      RestService.find("session")
    ],
    "put session/:id": [
      RestService.update("session")
    ],
    "post session": [
      RestService.create("session")
    ]
  }
};
