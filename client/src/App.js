import Chat from './components/Chat';

function App() {
  // Replace with actual logic to get logged-in user and selected friend
  const currentUserId = 1;
  const selectedFriendId = 2;

  return (
    <div className="App">
      <h1>SUP Chat App</h1>
      <Chat currentUserId={currentUserId} selectedFriendId={selectedFriendId} />
    </div>
  );
}

export default App;
