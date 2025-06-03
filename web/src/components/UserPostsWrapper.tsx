import { ReactNode } from 'react';
import { UserPostProvider } from '../context/UserPostContext'; // or whatever the correct path is
import { useParams } from 'react-router';

const UserPostWrapper = ({ children }: { children: ReactNode }) => {
  const { userID } = useParams();
  console.log("UserID: ",userID)
  return (
    <UserPostProvider userID={userID!}>
      {children}
    </UserPostProvider>
  );
};

export default UserPostWrapper;