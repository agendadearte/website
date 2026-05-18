module.exports = {
  async rewrites() {
    return [
      {
        source: "/evento/:path*",
        destination: "/event/:path*",
      },
      {
        source: "/lugares",
        destination: "/venues",
      },
    ];
  },
};
