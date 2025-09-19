import CrispChat, {
  configure,
  setUserEmail,
  setUserNickname,
  setUserPhone,
  resetSession
} from 'react-native-crisp-chat-sdk'

// ...
export default function App() {
  // You must set your website ID before calling <CrispChat />
  configure("d777b78e-76ca-42ad-bfd6-a1dcd6ba31ed");

  // this should be user ID that way app will load previous user chats
  // setUserTokenId('abcd12345');

  // Set user's info
  // setUserEmail('test@test.com');
  setUserNickname('John Smith');
  setUserPhone('+614430231224');

  // Call session reset when user loggs out
  resetSession();

  return <CrispChat />;
}