module.exports = {
  schema: {
    properties: {
      id: {
        type: "integer"
      },
      name: {
        type: "string",
        format: "email"
      },
      vkId: {
        type: "integer",
        format: "email"
      }
    },
    required: ["vkId"]
  },
  
  api: {
    "/api/user/:id": [
      RestService.findOne("user")
    ],
    "/api/user": [
      RestService.find("user")
    ],
    "put /api/user/:id": [
      RestService.update("user")
    ],
    "post /api/user": [
      RestService.create("user")
    ]
  }
};
