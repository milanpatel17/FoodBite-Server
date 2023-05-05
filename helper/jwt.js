// Import Statements...
const { expressjwt: expressjwt } = require("express-jwt");

// protection function
function authJwt() {
  // Environment Variables
  const api = process.env.API_URL;
  const secret = process.env.secret;

  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      //--- Image Upload APIS
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },

      //--- Restaurants APIs
      { url: /\/api\/v1\/restaurants(.*)/, methods: ["GET", "OPTIONS"] },
      {
        url: /\/api\/v1\/tableBookings(.*)/,
        methods: ["GET", "POST", "OPTIONS"],
      },
      { url: /\/api\/v1\/foodMenus(.*)/, methods: ["GET", "OPTIONS"] },
      {
        url: /\/api\/v1\/restaurantOrders(.*)/,
        methods: ["GET", "POST", "OPTIONS"],
      },

      //--- Tiffin Services APIs
      { url: /\/api\/v1\/tiffinServices(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/tiffinMenus(.*)/, methods: ["GET", "OPTIONS"] },
      {
        url: /\/api\/v1\/tiffinOrders(.*)/,
        methods: ["GET", "POST", "OPTIONS"],
      },

      //--- User Login & Registration APIs
      {
        url: /\/api\/v1\/users\/userProfile(.*)/,
        methods: ["GET", "PUT", "OPTIONS"],
      },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, token) {
  if (token.payload.isAdmin == false) {
    console.log("This user is Not-Admin");
    return true;
  } else {
    console.log("This user is Admin");
    return false;
  }
}

// Export Statements...
module.exports = authJwt;
