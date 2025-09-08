// import jwt from "jsonwebtoken";

// import { CookieValueTypes } from "cookies-next";
// import { UserProfileType } from "@/redux/userProfile";

// const verifyHomeAccessToken = (token: CookieValueTypes) => {
//   const key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string;
//   const userProfile = jwt.verify(
//     token,
//     key,
//     (err: Error, user: UserProfileType) => {
//       if (err) {
//         return err + " JWT Error";
//       } else {
//         return user;
//       }
//     }
//   );
//   return userProfile;
// };

// export default verifyHomeAccessToken;
import { jwtDecode } from "jwt-decode";
import { UserPatientProfileTypeValue } from "@/redux/userPatientProfile";
import { UserDoctorProfileTypeValue } from "@/redux/userDoctorProfile";

const decodeHomeAccessToken = (token: string) => {
  return jwtDecode<TokenType>(token);
};

export interface TokenType {
  accessToken: string;
  services: "google" | "password";
  roleName: "doctors" | "patient";
  userProfile: UserPatientProfileTypeValue | UserDoctorProfileTypeValue;
  user_id: string;
  iat: number;
  exp: number;
}

export default decodeHomeAccessToken;
