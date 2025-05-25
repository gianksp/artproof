import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  // use clientId for client side usage
  clientId: `${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`,
  // use secretKey for server side usage
  secretKey: `${process.env.NEXT_PUBLIC_THIRDWEB_SECRET}`, // replace this with full secret key
});
