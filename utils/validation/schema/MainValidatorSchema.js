exports.checkValidMongoId = (key) => ({
  [key]: {
    isMongoId: {
      errorMessage: "The id is invalid format",
    },
  },
});
