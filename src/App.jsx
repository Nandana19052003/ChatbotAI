import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState("");

  async function generateAnswer() {
    // Add user's message to the conversation
    const newUserMessage = { role: 'user', text: inputText };
    setConversation(prevConversation => [...prevConversation, newUserMessage]);

    try {
      // Make API call to get bot's response
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDiImJzgMFD2OTFmkmE85-5mtzV9qUjPKQ",
        {
          contents: [{ parts: [{ text: inputText }] }],
        }
      );

      // Get bot's response text and sanitize it to remove asterisks
      const botResponseText = response.data.candidates[0].content.parts[0].text;
      const sanitizedBotResponse = botResponseText.replace(/\*/g, '');

      // Add sanitized bot's response to the conversation
      const newBotMessage = { role: 'bot', text: sanitizedBotResponse };
      setConversation(prevConversation => [...prevConversation, newBotMessage]);

      setInputText(""); // Clear the text area after sending the message
    } catch (error) {
      console.error("Error fetching response:", error);
      alert("Error fetching response. Please try again later.");
    }
  }

  return (
    <div className="App">
      <h1 className="heading">Chatbot AI <span role="img" aria-label="robot">🤖</span></h1>
      <div className="conversation">
        {conversation.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <span className="message-text">{message.text}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here..."
          className="input-text"
        ></textarea>
        <button onClick={generateAnswer} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default App;
