module.exports.sleep = async (time) => {
  await new Promise((solve) => {
    setTimeout(() => {
      solve(true);
    }, time);
  })
}