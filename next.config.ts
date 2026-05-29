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
      {
        source: "/images/:path*",
        destination: `${process.env.BLOB_BASE_URL}/images/:path*`,
      },
    ];
  },
};
