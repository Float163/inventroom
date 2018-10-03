module.exports = {
  schema: {
    properties: {
      id: {
        type: "integer"
      },
      name: {
        type: "string"
      },
      vkId: {
        type: "integer"
      },
      avatar: {
        type: "string"
      },
      customInfo: {
        type: "object"
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
