/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
type IUser = {
  userName: string;
  displayName: string;
  id: string;
  isAdmin: boolean;
};
type User = IUser & { loggedIn: boolean };
type UserContextType = [User, (user: User) => void];
const defaultUser: User = { userName: '', displayName: '', isAdmin: false, id: '', loggedIn: false };
const UserContext = React.createContext<UserContextType>([defaultUser, () => {}]);

type Props = {
  children: React.ReactNode;
};
const UserContextProvider = (props: Props) => {
  const [user, setUser] = useState<User>(defaultUser);

  return <UserContext.Provider value={[user, setUser]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserContextProvider };
