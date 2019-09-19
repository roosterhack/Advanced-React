const Mutations = {
  async createItem(parent, args, ctz, info) {
    //TODO: check if they are logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
  }
};

module.exports = Mutations;
