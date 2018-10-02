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
    "user/:id": [
      RestService.findOne("user")
    ],
    "user": [
      RestService.find("user")
    ],
    "put user/:id": [
      RestService.update("user")
    ],
    "post user": [
      RestService.create("user")
    ]
  }
};
