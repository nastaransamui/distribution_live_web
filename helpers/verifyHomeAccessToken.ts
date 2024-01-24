import jwt from 'jsonwebtoken';

import { UserProfileType } from '@/redux/userProfile';
import { CookieValueTypes } from 'cookies-next';

const verifyHomeAccessToken = (token: CookieValueTypes) => {
  const key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string;
  const userProfile = jwt.verify(
    token,
    key,
    (err: Error, user: UserProfileType) => {
      if (err) {
        return err + ' JWT Error';
      } else {
        return user;
      }
    }
  );
  return userProfile;
};

export default verifyHomeAccessToken;
