/**
 * Structure
 * {
 *   [channel]:{
 *     [userId]:{
 *       [platform]:[socket]
 *     }
 *   }
 * }
 */

const proxy = {
  get: (t, a) =>
    t[a] ||
    ((t[a] = new Proxy(
      {},
      {
        get: (t, a) =>
          t[a] ||
          ((t[a] = new Proxy(
            {},
            {
              get: (t, a) => t[a] || ((t[a] = []), t[a])
            }
          )),
          t[a])
      }
    )),
    t[a])
};

module.exports = new Proxy({}, proxy);
